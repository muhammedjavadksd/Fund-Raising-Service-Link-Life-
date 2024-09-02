import CommentsRepo from "../repositorys/CommentRepo";
import { StatusCode } from "../types/Enums/UtilEnum";
import { ICommentTemplate } from "../types/Interface/IDBmodel";
import { HelperFuncationResponse } from "../types/Interface/Util";


interface ICommentService {
    addComment(comment: string, fund_id: string, user_id: string, user_name: string, mention: string): Promise<HelperFuncationResponse>
    editComment(new_comment: string, comment_id: string): Promise<HelperFuncationResponse>
    deleteComment(comment_id: string): Promise<HelperFuncationResponse>
    getPaginatedComments(fund_id: string, skip: number, limit: number): Promise<HelperFuncationResponse>
    createCommentId(): Promise<HelperFuncationResponse>
}


class CommentService implements ICommentService {

    private readonly commentsRepo;

    constructor() {
        this.commentsRepo = new CommentsRepo()
    }

    async addComment(comment: string, fund_id: string, user_id: string, user_name: string, mention: string): Promise<HelperFuncationResponse> {
        const comment_id: string = "123";
        const comments_data: ICommentTemplate = {
            comment,
            comment_id,
            fund_id,
            is_edited: false,
            mention,
            user_name,
            user_id
        }

        const saveComment: string | undefined = await this.commentsRepo.addComment(comments_data);
        if (saveComment) {
            return {
                status: true,
                statusCode: StatusCode.CREATED,
                msg: "Comment addedd success",
                data: {
                    comment_id: comment_id,
                }
            }
        } else {
            return {
                status: false,
                statusCode: StatusCode.BAD_REQUESR,
                msg: "Comment addedd failed",
            }
        }
    }

    editComment(new_comment: string, comment_id: string): Promise<HelperFuncationResponse> {
        throw new Error("Method not implemented.");
    }
    deleteComment(comment_id: string): Promise<HelperFuncationResponse> {
        throw new Error("Method not implemented.");
    }
    getPaginatedComments(fund_id: string, skip: number, limit: number): Promise<HelperFuncationResponse> {
        throw new Error("Method not implemented.");
    }
    createCommentId(): Promise<HelperFuncationResponse> {
        throw new Error("Method not implemented.");
    }

}