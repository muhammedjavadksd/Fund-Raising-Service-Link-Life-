const InitFundRaisingModel = require("../util/config/db/model/initFundRaiseModel");
const tokenHelper = require("../util/helper/tokenHelper");


let authMiddleware = {

    isValidUser: async (req, res, next) => {
        let headers = req.headers;
        console.log(headers);

        console.log(req.headers);
        if (headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            if (!req.context) {
                req.context = {}
            }
            let token = req.headers.authorization.split(' ')[1]
            req.context.auth_token = token;
            let checkValidity = await tokenHelper.checkTokenValidity(token)
            if (checkValidity) {
                console.log('Decode jwt is : ');

                if (checkValidity?.email) {
                    req.context.email_id = checkValidity?.email;
                    req.context.token = token;
                    req.context.user_id = checkValidity.id;
                    console.log("Requested phone number is", checkValidity?.email);
                    next()
                } else {
                    res.status(401).json({
                        status: false,
                        msg: "Authorization is failed"
                    })
                }
            } else {
                res.status(401).json({
                    status: false,
                    msg: "Authorization is failed"
                })
            }
        } else {
            res.status(401).json({
                status: false,
                msg: "Invalid auth attempt"
            })
        }
    },


    isFundRaiseRequestValid: async (req, res, next) => {

        let fundRaise = req.params.edit_id;
        let user_id = req.context.user_id;

        try {
            if (fundRaise && user_id) {
                let findFundRaise = await InitFundRaisingModel.findOne({ fund_id: fundRaise, user_id: user_id });
                if (findFundRaise) {
                    next();
                } else {
                    res.status(401).json({
                        status: false,
                        msg: "Un Authorized Access"
                    })
                }
            } else {
                res.status(401).json({
                    status: false,
                    msg: "Un Authorized Access"
                })
            }
        } catch (e) {
            res.status(500).json({
                status: false,
                msg: "Internal Server Error"
            })
        }
    },

    isValidAdmin: (req, res, next) => {
        next()
    }
}

module.exports = authMiddleware