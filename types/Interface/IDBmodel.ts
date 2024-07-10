import mongoose from "mongoose";
import { FundRaiserCreatedBy, FundRaiserStatus } from "../Enums/DbEnum";


interface iFundRaiseModel extends Document, IFundRaiseInitial {
    collected: number
    validate: {
        otp: number
        otp_expired: number
    },
    otp_validate: boolean
    picture: string[]
    documents: string[]
    about: string,
    deadline: Date
}


interface IFundRaiseInitial {
    "fund_id": string,
    "amount": number,
    "category": string,
    "sub_category": string,
    "phone_number": number,
    "email_id": string,
    "created_date": Date,
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
    "state": string
}

export { IFundRaiseInitial, iFundRaiseModel }