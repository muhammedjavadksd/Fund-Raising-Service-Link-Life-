"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
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
});
const CommentCollection = (0, mongoose_1.model)("comments", schema, "comments");
exports.default = CommentCollection;
