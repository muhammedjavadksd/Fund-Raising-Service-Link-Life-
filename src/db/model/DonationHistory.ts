import { model, Schema } from "mongoose";
import { IDonateHistoryCollection } from "../../types/Interface/IDBmodel";



const DonateHistoryScheme = new Schema<IDonateHistoryCollection>({
    donation_id: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    profile_id: {
        type: String,
        required: true
    },
    receipt: {
        type: String,
        required: true
    },
    fund_id: {
        type: String,
        required: true
    },
    hide_profile: {
        type: Boolean,
        required: true
    }
})


const DonateHistoryCollection = model<IDonateHistoryCollection>("donate-history", DonateHistoryScheme, "donate-history");
export default DonateHistoryCollection