"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DonateHistoryScheme = new mongoose_1.Schema({
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
});
const DonateHistoryCollection = (0, mongoose_1.model)("donate-history", DonateHistoryScheme, "donate-history");
exports.default = DonateHistoryCollection;
