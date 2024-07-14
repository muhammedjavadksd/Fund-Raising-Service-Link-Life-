"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DbEnum_1 = require("../../types/Enums/DbEnum");
const UtilEnum_1 = require("../../types/Enums/UtilEnum");
// FundRaiserCategory
const _fundRaiseSchema = {
    fund_id: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true,
    },
    collected: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: true,
        enum: UtilEnum_1.FundRaiserCategory //[...Object.keys(const_data.fund_raise_category)]
    },
    sub_category: {
        type: String,
        required: true,
    },
    phone_number: {
        type: Number,
        required: true,
    },
    email_id: {
        type: String,
        required: true
    },
    validation: {
        otp: {
            type: Number,
        },
        otp_expired: {
            type: Number
        }
    },
    otp_validate: {
        type: Boolean,
        defualt: false,
    },
    full_name: {
        type: String,
        required: false
    },
    created_date: {
        type: Date,
        required: true
    },
    created_by: {
        type: String,
        required: true,
        enum: DbEnum_1.FundRaiserCreatedBy
    },
    user_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    age: {
        type: Number,
    },
    city: {
        type: String,
    },
    pincode: {
        type: Number,
    },
    state: {
        type: String,
    },
    district: {
        type: String,
    },
    full_address: {
        type: String,
    },
    picture: {
        type: Array,
    },
    documents: {
        type: Array,
    },
    about: {
        type: String,
    },
    benificiary_relation: {
        type: String
    },
    description: {
        type: String,
    },
    closed: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: DbEnum_1.FundRaiserStatus,
        default: false,
    },
    deadline: {
        type: Date,
        required: false
    },
};
const schemeFundRaise = new mongoose_1.default.Schema(_fundRaiseSchema);
const InitFundRaisingModel = mongoose_1.default.model("init_fund_raising", schemeFundRaise, "init_fund_raising");
exports.default = InitFundRaisingModel;
