import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../types/DataType/Objects";
import TokenHelper from "../util/helper/tokenHelper";
import { JwtPayload } from "jsonwebtoken";
import FundRaiserRepo from "../repositorys/FundRaiserRepo";
import { IAuthMiddleware } from "../types/Interface/IMiddleware";


class AuthMiddleware implements IAuthMiddleware {

    async isValidUser(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        const headers: Request['headers'] = req.headers;
        const auth: string = headers['authorization'] as string;

        if (auth && auth.split(' ')[0] === 'Bearer') {
            if (!req.context) {
                req.context = {}
            }

            const token: string = auth.split(' ')[1]
            req.context.auth_token = token;

            console.log("TOken");
            console.log(token);



            const tokenHelper = new TokenHelper();

            const checkValidity: JwtPayload | string | false = await tokenHelper.checkTokenValidity(token)
            console.log(checkValidity);

            if (checkValidity && typeof checkValidity == "object") {

                console.log(checkValidity);


                if (checkValidity && checkValidity.email) {
                    req.context.email_id = checkValidity?.email;
                    req.context.token = token;
                    req.context.user_id = checkValidity.user_id;
                    req.context.profile_id = checkValidity.profile_id;
                    console.log("Test");

                    next()
                } else {
                    res.status(401).json({
                        status: false,
                        msg: "Authorization is failed"
                    })
                }
            } else {
                console.log("This error 2");

                res.status(401).json({
                    status: false,
                    msg: "Authorization is failed"
                })
            }
        } else {
            console.log("Headers");
            console.log(req.headers);
            console.log("This error 3");

            res.status(401).json({
                status: false,
                msg: "Invalid auth attempt"
            })
        }
    }

    async isFundRaiseRequestValid(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        const fund_id: string = req.params.edit_id;
        const user_id: string = req.context?.user_id;

        try {
            console.log("D");

            console.log(fund_id, user_id);

            if (fund_id && user_id) {
                const fundRaiseRepo = new FundRaiserRepo()
                const findFundRaise = await fundRaiseRepo.getSingleFundRaiseOfUser(user_id, fund_id)  //InitFundRaisingModel.findOne({ fund_id: fundRaise, user_id: user_id });
                console.log(user_id, fund_id);

                if (findFundRaise) {
                    console.log("Test passed");

                    next();
                } else {
                    console.log("Un auth one");
                    res.status(401).json({
                        status: false,
                        msg: "Un Authorized Access"
                    })
                }
            } else {
                console.log("Un auth two");

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
    }

    async isValidAdmin(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {

        const headers: CustomRequest['headers'] = req.headers;
        const auth: string | undefined = headers['authorization'];

        if (auth && auth.split(' ')[0] === 'Bearer') {

            const tokenHelper = new TokenHelper();

            const token: string = auth.split(' ')[1]
            const checkValidity: string | false | JwtPayload = await tokenHelper.checkTokenValidity(token)
            console.log(token);

            if (!req.context) {
                req.context = {}
            }
            req.context.auth_token = token;

            if (checkValidity && typeof checkValidity == "object") {
                if (checkValidity?.email && checkValidity.role == "admin") {
                    req.context.email_id = checkValidity?.email;
                    req.context.token = token;
                    req.context.user_id = checkValidity.id;
                    console.log("Requested phone number is", checkValidity?.email);
                    next()
                } else {
                    console.log("This error 1");
                    res.status(401).json({
                        status: false,
                        msg: "Authorization is failed"
                    })
                }
            } else {
                console.log("This error 2");
                console.log(checkValidity);

                res.status(401).json({
                    status: false,
                    msg: "Authorization is failed"
                })
            }
        } else {
            console.log("Headers");
            console.log(req.headers);
            console.log("This error 3");

            res.status(401).json({
                status: false,
                msg: "Invalid auth attempt"
            })
        }
    }

}

export default AuthMiddleware