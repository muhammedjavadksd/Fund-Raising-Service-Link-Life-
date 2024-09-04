import { model, Schema } from "mongoose";
import { IPaymentOrderCollection } from "../../types/Interface/IDBmodel";


const PaymentOrderSchema = new Schema<IPaymentOrderCollection>({
    order_id: {
        type: String,
        required: true,
        unique: true
    },
    fund_id: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    }
})

const PaymentOrderCollection = model("payment-order", PaymentOrderSchema)
export default PaymentOrderCollection