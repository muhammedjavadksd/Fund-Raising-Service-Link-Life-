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
const CommentRepo_1 = __importDefault(require("../repositorys/CommentRepo"));
const UtilEnum_1 = require("../types/Enums/UtilEnum");
class CommentService {
    constructor() {
        this.commentsRepo = new CommentRepo_1.default();
    }
    addComment(comment, fund_id, user_id, user_name, mention) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment_id = "123";
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
        throw new Error("Method not implemented.");
    }
    deleteComment(comment_id) {
        throw new Error("Method not implemented.");
    }
    getPaginatedComments(fund_id, skip, limit) {
        throw new Error("Method not implemented.");
    }
    createCommentId() {
        throw new Error("Method not implemented.");
    }
}
