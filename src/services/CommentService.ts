import CommentCollection from "../db/model/comments";
import CommentsRepo from "../repositorys/CommentRepo";
import { StatusCode } from "../types/Enums/UtilEnum";
import { ICommentTemplate } from "../types/Interface/IDBmodel";
import { HelperFuncationResponse } from "../types/Interface/Util";
import UtilHelper from "../util/helper/utilHelper";


interface ICommentService {
    addComment(comment: string, fund_id: string, user_id: string, user_name: string, mention: string, replay_id: string): Promise<HelperFuncationResponse>
    editComment(new_comment: string, comment_id: string): Promise<HelperFuncationResponse>
    deleteComment(comment_id: string): Promise<HelperFuncationResponse>
    getPaginatedComments(fund_id: string, skip: number, limit: number): Promise<HelperFuncationResponse>
    createCommentId(): Promise<string>
}


class CommentService implements ICommentService {

    private readonly commentsRepo;

    constructor() {
        this.commentsRepo = new CommentsRepo()
    }

    async addComment(comment: string, fund_id: string, user_id: string, user_name: string, mention: string, replay_id: string): Promise<HelperFuncationResponse> {
        const comment_id: string = await this.createCommentId();
        const comments_data: ICommentTemplate = {
            comment,
            comment_id,
            fund_id,
            is_edited: false,
            mention,
            user_name,
            user_id,
            replay_id
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

    async editComment(new_comment: string, comment_id: string): Promise<HelperFuncationResponse> {
        let editData: Partial<ICommentTemplate> = {
            comment: new_comment,
            is_edited: true,
        }
        const editComment = await this.commentsRepo.editComment(comment_id, editData)
        if (editComment) {
            return {
                status: true,
                statusCode: StatusCode.OK,
                msg: "Comment updated success",
            }
        } else {
            return {
                status: false,
                statusCode: StatusCode.BAD_REQUESR,
                msg: "Comment updated failed",
            }
        }
    }

    async deleteComment(comment_id: string): Promise<HelperFuncationResponse> {
        const deleteComment = await this.commentsRepo.deleteComment(comment_id);
        if (deleteComment) {
            return {
                status: true,
                statusCode: StatusCode.OK,
                msg: "Comment deleted success"
            }
        } else {
            return {
                status: false,
                statusCode: StatusCode.BAD_REQUESR,
                msg: "Comment deleted failed"
            }
        }
    }

    async getPaginatedComments(fund_id: string, skip: number, limit: number): Promise<HelperFuncationResponse> {
        const findComments = await this.commentsRepo.getPaginatedComments(fund_id, skip, limit);
        if (findComments.total_records > 0) {
            return {
                status: true,
                msg: "All comment fetched",
                statusCode: StatusCode.OK,
                data: findComments
            }
        } else {
            return {
                status: false,
                msg: "No comments found",
                statusCode: StatusCode.NOT_FOUND,
            }
        }
    }

    async createCommentId(): Promise<string> {

        const utilHelper = new UtilHelper();
        let randomNumber: number = utilHelper.generateAnOTP(4)
        let randomText: string = utilHelper.createRandomText(4)
        let commentId: string = `${randomText}${randomNumber}`;
        let findComment = await CommentCollection.findOne({ comment_id: commentId })
        while (findComment) {
            randomNumber++
            commentId = `${randomText}${randomNumber}`;
            findComment = await CommentCollection.findOne({ comment_id: commentId })
        }

        return commentId
    }

}

export default CommentService;