import CommentCollection from "../db/model/comments";
import { ICommentTemplate, IPaginatedCommente } from "../types/Interface/IDBmodel";
import { HelperFuncationResponse } from "../types/Interface/Util";


interface ICommentRepo {
    findCommentByCommentId(comment_id: string): Promise<ICommentTemplate | null>
    addComment(data: ICommentTemplate): Promise<undefined | string>
    deleteComment(comment_id: string): Promise<boolean>
    editComment(comment_id: string, comments: Partial<ICommentTemplate>): Promise<boolean>
    getPaginatedComments(fund_id: string, skip: number, limit: number): Promise<IPaginatedCommente>
}

class CommentsRepo implements ICommentRepo {

    async findCommentByCommentId(comment_id: string): Promise<ICommentTemplate | null> {
        const findComment = await CommentCollection.findOne({ comment_id }).lean();
        return findComment
    }

    async deleteComment(comment_id: string): Promise<boolean> {
        const deleteComment = await CommentCollection.deleteOne({ comment_id });
        return deleteComment.deletedCount > 0
    }

    async editComment(comment_id: string, comments: Partial<ICommentTemplate>): Promise<boolean> {
        const edit = await CommentCollection.updateOne({ comment_id }, { $set: comments })
        return edit.modifiedCount > 0
    }

    async getPaginatedComments(fund_id: string, skip: number, limit: number): Promise<IPaginatedCommente> {
        const findComments: IPaginatedCommente[] = await CommentCollection.aggregate(
            [
                {
                    $match: {
                        fund_id,
                        replay_id: null,
                    }
                },
                {
                    $skip: skip
                },
                {
                    $limit: limit
                },
                {
                    $facet: {
                        paginated: [
                            {
                                $graphLookup: {
                                    from: "comments",
                                    startWith: "$comment_id",
                                    connectFromField: "comment_id",
                                    connectToField: "replay_id",
                                    as: "replay",
                                    depthField: "depth"
                                }
                            }
                        ],
                        total_records: [
                            {
                                $count: "total_records"
                            }
                        ]
                    }
                },
                {
                    $sort: {
                        date: -1
                    }
                },
                {
                    $unwind: "$total_records"
                },
                {
                    $project: {
                        paginated: 1,
                        total_records: "$total_records.total_records"
                    }
                }
            ])



        return findComments[0]
    }

    async addComment(data: ICommentTemplate): Promise<undefined | string> {
        const commentInstance = new CommentCollection(data);
        const saveComment = await commentInstance.save()
        return saveComment?.id
    }
}

export default CommentsRepo