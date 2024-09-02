import CommentCollection from "../db/model/comments";
import { ICommentTemplate, IEditComment } from "../types/Interface/IDBmodel";
import { HelperFuncationResponse } from "../types/Interface/Util";


interface ICommentRepo {
    addComment(data: ICommentTemplate): Promise<undefined | string>
    deleteComment(comment_id: string): Promise<HelperFuncationResponse>
    editComment(comment_id: string, new_comment: string,): Promise<boolean>
    getAllComment(fund_id: string): Promise<ICommentTemplate[]>
}

class CommentsRepo implements ICommentRepo {

    deleteComment(comment_id: string): Promise<HelperFuncationResponse> {
        throw new Error("Method not implemented.");
    }

    async editComment(comment_id: string, new_comment: string): Promise<boolean> {
        const edit = await CommentCollection.updateOne({ comment_id }, { $set: { comment_id: comment_id, comment: new_comment, } })
        return edit.modifiedCount > 0
    }

    async getAllComment(fund_id: string): Promise<ICommentTemplate[]> {
        const findComments: ICommentTemplate[] = await CommentCollection.find({ fund_id }).lean()
        return findComments
    }

    async addComment(data: ICommentTemplate): Promise<undefined | string> {
        const commentInstance = new CommentCollection(data);
        const saveComment = await commentInstance.save()
        return saveComment?.id
    }

}