"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comments_1 = __importDefault(require("../db/model/comments"));
const CommentRepo_1 = __importDefault(require("../repositorys/CommentRepo"));
const UtilEnum_1 = require("../types/Enums/UtilEnum");
const utilHelper_1 = __importDefault(require("../util/helper/utilHelper"));
class CommentService {
    constructor() {
        this.commentsRepo = new CommentRepo_1.default();
    }
    addComment(comment, fund_id, user_id, user_name, mention) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment_id = yield this.createCommentId();
            const comments_data = {
                comment,
                comment_id,
                fund_id,
                is_edited: false,
                mention,
                user_name,
                user_id
            };
            const saveComment = yield this.commentsRepo.addComment(comments_data);
            if (saveComment) {
                return {
                    status: true,
                    statusCode: UtilEnum_1.StatusCode.CREATED,
                    msg: "Comment addedd success",
                    data: {
                        comment_id: comment_id,
                    }
                };
            }
            else {
                return {
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.BAD_REQUESR,
                    msg: "Comment addedd failed",
                };
            }
        });
    }
    editComment(new_comment, comment_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let editData = {
                comment: new_comment,
                is_edited: true,
            };
            const editComment = yield this.commentsRepo.editComment(comment_id, editData);
            if (editComment) {
                return {
                    status: true,
                    statusCode: UtilEnum_1.StatusCode.OK,
                    msg: "Comment updated success",
                };
            }
            else {
                return {
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.BAD_REQUESR,
                    msg: "Comment updated failed",
                };
            }
        });
    }
    deleteComment(comment_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteComment = yield this.commentsRepo.deleteComment(comment_id);
            if (deleteComment) {
                return {
                    status: true,
                    statusCode: UtilEnum_1.StatusCode.OK,
                    msg: "Comment deleted success"
                };
            }
            else {
                return {
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.BAD_REQUESR,
                    msg: "Comment deleted failed"
                };
            }
        });
    }
    getPaginatedComments(fund_id, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const findComments = yield this.commentsRepo.getPaginatedComments(fund_id, skip, limit);
            if (findComments.) {
                return {
                    status: true,
                    msg: "All comment fetched",
                    statusCode: UtilEnum_1.StatusCode.OK,
                    data: findComments
                };
            }
            else {
                return {
                    status: false,
                    msg: "No comments found",
                    statusCode: UtilEnum_1.StatusCode.NOT_FOUND,
                };
            }
        });
    }
    createCommentId() {
        return __awaiter(this, void 0, void 0, function* () {
            const utilHelper = new utilHelper_1.default();
            let randomNumber = utilHelper.generateAnOTP(4);
            let randomText = utilHelper.createRandomText(4);
            let commentId = `${randomText}${randomNumber}`;
            let findComment = yield comments_1.default.findOne({ comment_id: commentId });
            while (findComment) {
                randomNumber++;
                commentId = `${randomText}${randomNumber}`;
                findComment = yield comments_1.default.findOne({ comment_id: commentId });
            }
            return commentId;
        });
    }
}
