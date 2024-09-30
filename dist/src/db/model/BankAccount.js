"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DbEnum_1 = require("../../types/Enums/DbEnum");
const bankAccountSchema = new mongoose_1.Schema({
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
        enum: Object.values(DbEnum_1.BankAccountType)
    },
    fund_id: {
        type: String,
        required: true
    }
});
const BankAccountCollection = (0, mongoose_1.model)("bank-accounts", bankAccountSchema);
exports.default = BankAccountCollection;
