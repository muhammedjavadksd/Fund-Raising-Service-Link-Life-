const { default: mongoose } = require("mongoose");
const const_data = require("../../../utilFiles/const");


let _fundRaiseSchema = {

    amount: {
        type: Number,
        required: function () {
            return this.status;
        }
    },
    category: {
        type: String,
        required: function () {
            return this.status;
        },
        enum: [...Object.keys(const_data.fund_raise_category)]
    },
    sub_category: {
        type: String,
        required: function () {
            return this.status;
        },
        enum: function () {
            return const_data.fund_raise_category[this.category]
        }
    },
    phone_number: {
        type: Number,
        required: true,
    },
    validate: {
        otp: {
            type: Number,

        },
        otp_expired: {
            type: Number
        }
    },
    otp_validate: Boolean,
    full_name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    full_address: {
        type: String,
        required: true
    },
    picture: {
        type: Array,
        required: true
    },
    documents: {
        type: Array,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    closed: {
        type: Boolean,
    },
    status: {
        type: Boolean,
        default: false,
    },
    deadline: {
        type: String,
        required: true
    },
    created_date: {
        type: String,
        required: true
    },
    created_by: {
        type: String,
        required: true,
        enum: const_data.USER_TYPE
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true
    }
}

let schemeFundRaise = new mongoose.Schema(_fundRaiseSchema);
let FundRaisingModel = mongoose.model("fund_raising", schemeFundRaise, "fund_raising");
module.exports = FundRaisingModel;