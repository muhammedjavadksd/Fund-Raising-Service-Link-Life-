import { model, Schema } from "mongoose";
import { ICommentCollection } from "../../types/Interface/IDBmodel";


const schema = new Schema<ICommentCollection>({
    comment: {
        type: String,
        required: true
    },
    comment_id: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        required: true,
        default: new Date()
    },
    is_edited: {
        type: Boolean,
        required: false,
        default: false,
    },
    user_name: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    mention: {
        type: String,
    },
    fund_id: {
        type: String,
        required: true
    },
    replay_id: {
        type: String,
    }
})

const CommentCollection = model("comments", schema, "comments");
export default CommentCollection