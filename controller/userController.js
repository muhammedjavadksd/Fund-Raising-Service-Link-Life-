const fundRaisingHelper = require("../util/helper/fundRaiserHelper");
const utilHelper = require("../util/helper/utilHelper");
const const_data = require("../util/utilFiles/const");


let userController = {

    createFundRaise: (req, res) => {

        console.log("Create fund raise controller");

        try {

            //Create fund id
            //OTP management

            let {
                amount,
                category,
                sub_category,
                phone_number,
                email
            } = req.body;


            console.log(req.body);


            let otpNumber = utilHelper.generateAnOTP(const_data.OTP_LENGTH);
            let otpExpire = const_data.OTP_EXPIRE_TIME();
            let todayDate = new Date();
            let user_id = req.context.user_id;
            let fund_id = utilHelper.createFundRaiseID("USER").toUpperCase()


            console.log("User Id : " + user_id);
            console.log(email);

            let fundRaiseData = {
                validate: {
                    otp: otpNumber,
                    otp_expired: otpExpire
                },
                // description,
                created_date: todayDate,
                created_by: "USER",
                user_id,
                fund_id,
                amount,
                category,
                sub_category,
                phone_number,
                email_id: email,
            }

            fundRaisingHelper.insertInitialData(fundRaiseData).then((data) => {
                res.status(data?.statusCode ?? 400).json({
                    status: data.status,
                    msg: data.msg
                })
            }).catch((err) => {
                console.log(err);
                res.status(500).json({
                    status: false,
                    msg: "Internal Servor Error"
                })
            })
        } catch (e) {
            console.log(e);
            res.status(500).json({
                status: false,
                msg: "Internal Servor Error"
            })
        }
    },


    editFundRaise: (req, res) => {

        try {
            let edit_id = req.params.edit_id;


        } catch (e) {
            edit_id
        }
    },


    uploadImage: async (req, res) => {

        console.log("D");

        try {

            let file = req.file.fund_raise_image;
            let fundRaiserID = req.body.fund_raise_id;

            let saveFundRaise = await fundRaisingHelper.saveFundRaiserImage(file, fundRaiserID, false)

            res.status(saveFundRaise.statusCode).json({
                status: saveFundRaise.status,
                msg: saveFundRaise.msg
            })

        } catch (e) {
            console.log(e);
            res.status(500).json({
                status: false,
                msg: "Internal Server Error"
            })
        }

    }

}

module.exports = userController;