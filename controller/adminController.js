const fundRaisingHelper = require("../util/helper/fundRaiserHelper");
const utilHelper = require("../util/helper/utilHelper");


let adminController = {

    getSingleProfile: async (req, res) => {
        try {
            let profile_id = req.params.profile_id;
            let profile = await fundRaisingHelper.getSingleFundRaise(profile_id);
            if (profile) {
                res.status(200).json({ status: true, data: profile })
            } else {
                res.status(404).json({ status: false, msg: "No profile found" })
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({ status: false, msg: "Internal server error" })
        }
    },

    getAllProfile: async (req, res) => {

        try {
            let limit = req.params.limit
            let page = req.params.page;

            let allFundRaisers = await fundRaisingHelper.getAllFundRaisers(limit, page);
            if (allFundRaisers?.length) {
                res.status(200).json({ status: true, data: allFundRaisers })
            } else {
                res.status(204).json({ status: false, msg: "No profile found" })
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({ status: false, msg: "Internal server error" })
        }
    },


    addFundRaiser: (req, res) => {

        try {

            const amount = req.body.amount;
            const category = req.body.category;
            const sub_category = req.body.sub_category;
            const phone_number = req.body.phone_number;
            const email_id = req.body.email_id;
            const age = req.body.age;
            const about = req.body.about;
            const benificiary_relation = req.body.benificiary_relation;
            const full_name = req.body.full_name;
            const city = req.body.city;
            const district = req.body.district;
            const full_address = req.body.full_address;
            const pincode = req.body.pin_code;
            const state = req.body.state

            const fundID = utilHelper.createFundRaiseID("ADMIN")
            const createdDate = new Date()



            fundRaisingHelper.insertInitialData({
                fund_id: fundID,
                "amount": amount,
                "category": category,
                "sub_category": sub_category,
                "phone_number": phone_number,
                "email_id": email_id,
                "created_date": createdDate,
                "created_by": "ADMIN",
                "user_id": "admin",
                "closed": false,
                "status": false,
                "about": about,
                "age": age,
                "benificiary_relation": benificiary_relation,
                "full_name": full_name,
                "city": city,
                "district": district,
                "full_address": full_address,
                "pincode": pincode,
                "state": state
            })

        } catch (e) {

        }
    }
}

module.exports = adminController;