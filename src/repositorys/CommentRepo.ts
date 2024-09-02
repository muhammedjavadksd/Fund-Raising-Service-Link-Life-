import CommentCollection from "../db/model/comments";
import { ICommentTemplate } from "../types/Interface/IDBmodel";
import { HelperFuncationResponse } from "../types/Interface/Util";


interface ICommentRepo {
    findCommentByCommentId(comment_id: string): Promise<ICommentTemplate | null>
    addComment(data: ICommentTemplate): Promise<undefined | string>
    deleteComment(comment_id: string): Promise<boolean>
    editComment(comment_id: string, new_comment: string,): Promise<boolean>
    getAllComment(fund_id: string, skip: number, limit: number): Promise<ICommentTemplate[]>
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

    async editComment(comment_id: string, new_comment: string): Promise<boolean> {
        const edit = await CommentCollection.updateOne({ comment_id }, { $set: { comment_id: comment_id, comment: new_comment, } })
        return edit.modifiedCount > 0
    }

    async getAllComment(fund_id: string, skip: number, limit: number): Promise<ICommentTemplate[]> {
        const findComments: ICommentTemplate[] = await CommentCollection.find({ fund_id }).lean().skip(skip).limit(limit)
        return findComments
    }

    async addComment(data: ICommentTemplate): Promise<undefined | string> {
        const commentInstance = new CommentCollection(data);
        const saveComment = await commentInstance.save()
        return saveComment?.id
    }
}

export default CommentsRepo