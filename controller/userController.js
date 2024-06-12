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

            console.log(fundRaiseData);

            fundRaisingHelper.insertInitialData(fundRaiseData).then((data) => {
                console.log(fund_id);
                let objectToPass = {
                    status: data.status,
                    msg: data.msg,
                    fund_id: fund_id
                }
                console.log(objectToPass);
                res.status(data?.statusCode ?? 400).json(objectToPass)
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


    editFundRaise: async (req, res) => {


        console.log("For editing middleware has been passed");

        try {
            let edit_id = req.params.edit_id;
            let body = req.body;
            console.log("Images is");


            if (req.files) {
                const imageBuffer = req.files['images[data]'];
                let isDocument = body['images[type]'] == "Documents"

                console.log("The images is");
                console.log(imageBuffer);
                console.log("The type is");
                console.log(isDocument);

                await fundRaisingHelper.saveFundRaiserImage(imageBuffer, edit_id, isDocument)
            } else {
                await fundRaisingHelper.fundRaiserUpdate(body, edit_id);
            }

            res.status(200).json({ status: true, msg: "Updated success" })

        } catch (e) {
            console.log(e);
            res.status(e.status ?? 500).json({ status: false, msg: e.msg ?? "Something went wrong" })
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