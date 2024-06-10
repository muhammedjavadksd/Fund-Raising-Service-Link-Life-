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

    isValidAdmin: (req, res, next) => {
        next()
    }
}

module.exports = authMiddleware