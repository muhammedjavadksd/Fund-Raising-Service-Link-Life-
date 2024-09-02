import mongoose, { Document } from "mongoose";
import { FundRaiserCreatedBy, FundRaiserStatus } from "../Enums/DbEnum";
import { FundRaiserBankAccountType, FundRaiserCategory } from "../Enums/UtilEnum";


interface iFundRaiseModel extends Document, IFundRaise {
    collected: number
    validation: {
        otp: number
        otp_expired: number
    },
    otp_validate: boolean
    picture: string[]
    documents: string[]
    about: string,
    deadline: Date
}

interface IFundRaiseInitialData {
    validate: {
        otp: number,
        otp_expired: number
    }
    created_date: Date
    created_by: FundRaiserCreatedBy
    user_id: mongoose.Types.ObjectId | string
    fund_id: string
    amount: number
    category: string
    sub_category: string
    phone_number: number
    email_id: string,
    status: FundRaiserStatus
}


interface IEditableFundRaiser {
    "amount"?: number,
    "category"?: string,
    "sub_category"?: string,
    "about"?: string,
    "age"?: number,
    "benificiary_relation"?: string,
    "full_name"?: string,
    "city"?: string,
    "district"?: string,
    "full_address"?: string,
    "pincode"?: number,
    "state"?: string
    "deadline"?: Date
    "withdraw_docs": IWithdrawDetails
}

interface IWithdrawDetails {
    account_number: string,
    holder_name: string,
    ifsc_code: string,
    accont_type: FundRaiserBankAccountType
}

interface IFundRaise {
    "fund_id": string,
    "amount": number,
    "category": FundRaiserCategory,
    "sub_category": string,
    "phone_number": number,
    "email_id": string,
    "created_date": Date,
    "description": string,
    "created_by": FundRaiserCreatedBy,
    "user_id": mongoose.Types.ObjectId | string,
    "closed": boolean,
    "status": FundRaiserStatus,
    "about": string,
    "age": number,
    "benificiary_relation": string,
    "full_name": string,
    "city": string,
    "district": string,
    "full_address": string,
    "pincode": number,
    "state": string,
    "withdraw_docs": IWithdrawDetails
}


interface IPaginatedCommente {
    paginated: ICommentTemplate[],
    total_records: number,
}


interface ICommentTemplate {
    comment: string,
    fund_id: string,
    comment_id: string,
    user_id: string,
    user_name: string,
    date?: Date,
    is_edited: boolean,
    mention: string //profile id
}

interface ICommentCollection extends Document, ICommentTemplate { }

export { IPaginatedCommente, ICommentCollection, ICommentTemplate, IWithdrawDetails, IFundRaise, IFundRaiseInitialData, iFundRaiseModel, IEditableFundRaiser }