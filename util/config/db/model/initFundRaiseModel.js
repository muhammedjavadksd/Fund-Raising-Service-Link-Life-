const { default: mongoose } = require("mongoose");
const const_data = require("../../../utilFiles/const");


let _fundRaiseSchema = {
    fund_id: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: [...Object.keys(const_data.fund_raise_category)]
    },
    sub_category: {
        type: String,
        required: true,
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
    otp_validate: {
        type: Boolean,
        defualt: false,
    },
    full_name: {
        type: String,
        required: false
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
    },
    age: {
        type: Number,
    },
    city: {
        type: String,
    },
    pincode: {
        type: Number,
    },
    state: {
        type: String,
    },
    district: {
        type: String,
    },
    full_address: {
        type: String,
    },
    picture: {
        type: Array,
    },
    documents: {
        type: Array,
    },
    description: {
        type: String,
    },
    closed: {
        type: Boolean,
        default: false,
    },
    status: {
        type: Boolean,
        default: false,
    },
    deadline: {
        type: String,
        required: false
    },
}

let schemeFundRaise = new mongoose.Schema(_fundRaiseSchema);
let InitFundRaisingModel = mongoose.model("init_fund_raising", schemeFundRaise, "init_fund_raising");
module.exports = InitFundRaisingModel;