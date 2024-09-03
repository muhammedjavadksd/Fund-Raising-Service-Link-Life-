"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const DbEnum_1 = require("../../types/Enums/DbEnum");
const UtilEnum_1 = require("../../types/Enums/UtilEnum");
// FundRaiserCategory
const schemeFundRaise = new mongoose_1.default.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: [String],
    },
    documents: {
        type: [String],
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
        enum: Object.values(DbEnum_1.FundRaiserStatus),
        required: true
    },
    deadline: {
        type: Date,
        required: false
    },
    withdraw_docs: {
        account_number: String,
        holder_name: String,
        ifsc_code: String,
        account_type: {
            type: String,
            enum: Object.values(UtilEnum_1.FundRaiserBankAccountType)
        }
    }
});
const InitFundRaisingModel = mongoose_1.default.model("init_fund_raising", schemeFundRaise, "init_fund_raising");
exports.default = InitFundRaisingModel;
