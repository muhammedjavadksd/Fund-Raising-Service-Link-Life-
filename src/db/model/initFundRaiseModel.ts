import mongoose, { Schema } from "mongoose";
import { iFundRaiseModel } from "../../types/Interface/IDBmodel";
import { const_data } from "../../types/Enums/ConstData";
import { FundRaiserCreatedBy, FundRaiserStatus } from "../../types/Enums/DbEnum";
import { FundRaiserBankAccountType, FundRaiserCategory } from "../../types/Enums/UtilEnum";
// FundRaiserCategory



const schemeFundRaise = new mongoose.Schema<iFundRaiseModel>({
    benf_id: {
        type: String
    },
    close_token: {
        type: String,
        required: false
    },
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
        enum: FundRaiserCategory //[...Object.keys(const_data.fund_raise_category)]
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
        enum: FundRaiserCreatedBy
    },
    user_id: {
        type: Schema.Types.ObjectId,
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
        enum: Object.values(FundRaiserStatus),
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
            enum: Object.values(FundRaiserBankAccountType)
        }
    }
});

const InitFundRaisingModel = mongoose.model<iFundRaiseModel>("init_fund_raising", schemeFundRaise, "init_fund_raising");

export default InitFundRaisingModel