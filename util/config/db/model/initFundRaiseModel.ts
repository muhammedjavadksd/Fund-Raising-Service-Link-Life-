import mongoose from "mongoose";
import { iFundRaiseModel } from "../../../../types/Interface/IDBmodel";
import const_data from "../../../utilFiles/const";
import { FundRaiserCreatedBy } from "../../../../types/Enums/DbEnum";

// const { default: mongoose } = require("mongoose");
// const const_data = require("../../../utilFiles/const");


let _fundRaiseSchema = {
    fund_id: {
        type: String,
        required: true
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
        enum: [...Object.keys(const_data.fund_raise_category)]
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
    validate: {
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
        enum: FundRaiserCreatedBy
    },
    user_id: {
        type: mongoose.Types.ObjectId,
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
        type: Boolean,
        default: false,
    },
    deadline: {
        type: Date,
        required: false
    },
}

const schemeFundRaise = new mongoose.Schema(_fundRaiseSchema);
const InitFundRaisingModel = mongoose.model<iFundRaiseModel>("init_fund_raising", schemeFundRaise, "init_fund_raising");

export default InitFundRaisingModel