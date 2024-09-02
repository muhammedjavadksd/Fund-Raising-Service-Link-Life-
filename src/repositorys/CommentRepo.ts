import CommentCollection from "../db/model/comments";
import { ICommentTemplate } from "../types/Interface/IDBmodel";
import { HelperFuncationResponse } from "../types/Interface/Util";


interface ICommentRepo {
    addComment(data: ICommentTemplate): Promise<undefined | string>
    deleteComment(comment_id: string): Promise<HelperFuncationResponse>
    editComment(comment_id: string, new_comment: string,): Promise<HelperFuncationResponse>
    getAllComment(fund_id: string): Promise<HelperFuncationResponse>
}

class CommentsRepo implements ICommentRepo {

    deleteComment(comment_id: string): Promise<HelperFuncationResponse> {
        throw new Error("Method not implemented.");
    }
    editComment(comment_id: string, new_comment: string): Promise<HelperFuncationResponse> {
        throw new Error("Method not implemented.");
    }
    getAllComment(fund_id: string): Promise<HelperFuncationResponse> {
        throw new Error("Method not implemented.");
    }

    async addComment(data: ICommentTemplate): Promise<undefined | string> {
        const commentInstance = new CommentCollection(data);
        const saveComment = await commentInstance.save()
        return saveComment?.id
    }

}