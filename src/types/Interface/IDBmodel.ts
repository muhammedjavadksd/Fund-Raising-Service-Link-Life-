import mongoose, { Document } from "mongoose";
import { FundRaiserCreatedBy, FundRaiserStatus } from "../Enums/DbEnum";
import { FundRaiserBankAccountType, FundRaiserCategory } from "../Enums/UtilEnum";
import { WebhookPayload } from "./Util";


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
    validate?: {
        otp: number,
        otp_expired: number
    }
    created_date: Date
    created_by: FundRaiserCreatedBy
    user_id?: mongoose.Types.ObjectId | string
    fund_id: string
    amount: number
    category: string
    sub_category: string
    phone_number: number
    email_id: string,
    status: FundRaiserStatus

}


interface IEditableFundRaiser {
    "benf_id"?: string
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
    "description"?: string
    "withdraw_docs": IWithdrawDetails
}

interface IWithdrawDetails {
    account_number: string,
    holder_name: string,
    ifsc_code: string,
    accont_type: FundRaiserBankAccountType
}

interface IAdminAddFundRaiser {
    created_by: FundRaiserCreatedBy,
    fund_id: string,
    status: FundRaiserStatus,
    full_name: string;               // Name of the fundraiser
    age: number | null;         // Age of the fundraiser (nullable)
    deadline: Date | null;             // Deadline for the fundraiser (nullable)
    benificiary_relation: string;      // Relation to the beneficiary
    amount: number | null;             // Amount to be raised (nullable)
    category: string;                  // Category of the fundraiser
    sub_category: string;               // Sub-category of the fundraiser
    phone_number: string | null;       // Phone number (nullable)
    email_id: string;                  // Email address
    city: string;                      // City of the fundraiser
    pincode: string | null;            // Pincode (nullable)
    state: string;                     // State of the fundraiser
    district: string;                  // District of the fundraiser
    full_address: string;               // Full address of the fundraiser
    about: string;                     // Information about the fundraiser
    description: string;               // Detailed description of the fundraiser
    created_date: Date,
}

interface IFundRaise {
    "benf_id"?: string
    "close_token"?: string
    "fund_id": string,
    "amount": number,
    "category": FundRaiserCategory,
    "sub_category": string,
    "phone_number": number,
    "email_id": string,
    "created_date": Date,
    "description": string,
    "created_by": FundRaiserCreatedBy,
    "user_id"?: mongoose.Types.ObjectId | string,
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
    mention: string, //profile id
    replay_id: string,
}

interface IDonateHistoryTemplate {
    is_settled: boolean
    order_id: string
    fund_id: String,
    profile_id: String,
    name: String,
    amount: number,
    receipt: String,
    date: Date
    hide_profile: boolean,
    donation_id: string
}


interface IPaymentOrder {
    name: string,
    order_id: string,
    fund_id: string,
    date: Date,
    status: boolean,
    amount: number
    hide_profile: boolean,
    profile_id: string
}


interface IMetaData {
    filename: string,
    contentType: string,
    length: number,
    uploadDate: Date,
    metadata: Map<any, any>
}


interface IMetaDataCollection extends Document, IMetaData { }
interface IDonateHistoryCollection extends Document, IDonateHistoryTemplate { }
interface IPaymentOrderCollection extends IPaymentOrder, Document { }

interface ICommentCollection extends Document, ICommentTemplate {
}


interface IWebhookCollection extends WebhookPayload, Document {
    is_checked: boolean

}

export { IMetaData, IMetaDataCollection }
export { IPaymentOrderCollection, IPaymentOrder, IDonateHistoryTemplate, IDonateHistoryCollection, IWebhookCollection, IPaginatedCommente, ICommentCollection, ICommentTemplate, IWithdrawDetails, IFundRaise, IFundRaiseInitialData, iFundRaiseModel, IEditableFundRaiser, IAdminAddFundRaiser }