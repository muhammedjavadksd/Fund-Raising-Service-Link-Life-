"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const OrderSchema = new mongoose_1.Schema({
    order_id: {
        type: String,
        required: true
    },
    order_amount: {
        type: Number,
        required: true
    },
    order_currency: {
        type: String,
        required: true
    },
    order_tags: {
        type: String,
    }
});
const PaymentSchema = new mongoose_1.Schema({
    cf_payment_id: {
        type: Number,
        required: true
    },
    payment_status: {
        type: String,
        required: true
    },
    payment_amount: {
        type: Number,
        required: true
    },
    payment_currency: {
        type: String,
        required: true
    },
    payment_message: {
        type: String,
    },
    payment_time: {
        type: String,
        required: true
    },
    bank_reference: {
        type: String,
    },
    auth_id: {
        type: String,
    },
    payment_group: {
        type: String
    }
});
const CustomerDetailsSchema = new mongoose_1.Schema({
    customer_name: {
        type: String,
        required: true
    },
    customer_id: {
        type: String,
        required: true
    },
    customer_email: {
        type: String,
        required: true
    },
    customer_phone: {
        type: String,
        required: true
    },
});
const ChargesDetailsSchema = new mongoose_1.Schema({
    service_charge: {
        type: String,
    },
    service_tax: {
        type: String,
    },
    settlement_amount: {
        type: String,
    },
    settlement_currency: String,
    service_charge_discount: String
});
// Define the main schema using the nested schemas
const PaymentWebHookSchema = new mongoose_1.Schema({
    data: {
        order: {
            type: OrderSchema,
            required: true
        },
        payment: {
            type: PaymentSchema,
            required: true
        },
        customer_details: {
            type: CustomerDetailsSchema,
            required: true
        },
        charges_details: {
            type: ChargesDetailsSchema,
        }
    },
    event_time: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    is_checked: {
        type: Boolean,
        required: true
    }
});
const PaymentWebHookCollection = (0, mongoose_1.model)("payment-webhook", PaymentWebHookSchema, "payment-webhook");
exports.default = PaymentWebHookCollection;
