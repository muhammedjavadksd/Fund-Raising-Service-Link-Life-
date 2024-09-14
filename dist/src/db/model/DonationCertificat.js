"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const gridFsRootScheme = new mongoose_1.Schema({
    filename: {
        type: String,
        required: true
    },
    contentType: {
        type: String
    },
    length: {
        type: Number
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    metadata: {
        type: Map, of: mongoose_1.Schema.Types.Mixed
    }
});
const ;
