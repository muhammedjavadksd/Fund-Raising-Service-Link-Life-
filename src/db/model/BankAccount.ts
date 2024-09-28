import { model, Schema } from "mongoose";
import { IBankAccountCollection } from "../../types/Interface/IDBmodel";


const bankAccountSchema = new Schema<IBankAccountCollection>({
    befId: {
        type: String,
        required: true
    },
    account_number: {
        type: Number,
        required: true
    },
    ifsc_code: {
        type: String,
        required: true
    },
    holder_name: {
        type: String,
        required: true
    },
    account_type: {
        type: String,
        required: true,
        enum: ['saving', 'current']
    },
    fund_id: {
        type: String,
        required: true
    }
})

const BankAccountCollection = model("bank-accounts", bankAccountSchema);
export default BankAccountCollection