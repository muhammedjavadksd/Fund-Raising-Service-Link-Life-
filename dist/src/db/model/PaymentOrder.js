"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PaymentOrderSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    profile_id: {
        type: String,
        required: true
    },
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
    },
    hide_profile: {
        type: Boolean,
        required: true
    }
});
const PaymentOrderCollection = (0, mongoose_1.model)("payment-order", PaymentOrderSchema);
exports.default = PaymentOrderCollection;
