"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokenHelper_1 = __importDefault(require("../util/helper/tokenHelper"));
const FundRaiserRepo_1 = __importDefault(require("../repositorys/FundRaiserRepo"));
const UtilEnum_1 = require("../types/Enums/UtilEnum");
class AuthMiddleware {
    isValidUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = req.headers;
            const auth = headers['authorization'];
            console.log("Hello world");
            console.log(auth);
            console.log(headers);
            if (auth && auth.split(' ')[0] === 'Bearer') {
                if (!req.context) {
                    req.context = {};
                }
                const token = auth.split(' ')[1];
                req.context.auth_token = token;
                console.log("TOken");
                console.log(token);
                const tokenHelper = new tokenHelper_1.default();
                const checkValidity = yield tokenHelper.checkTokenValidity(token);
                console.log(checkValidity);
                if (checkValidity && typeof checkValidity == "object") {
                    console.log(checkValidity);
                    if (checkValidity && checkValidity.email) {
                        req.context.email_id = checkValidity === null || checkValidity === void 0 ? void 0 : checkValidity.email;
                        req.context.token = token;
                        req.context.user_id = checkValidity.user_id;
                        req.context.profile_id = checkValidity.profile_id;
                        console.log("Test");
                        next();
                    }
                    else {
                        res.status(UtilEnum_1.StatusCode.UNAUTHORIZED).json({
                            status: false,
                            msg: "Authorization is failed"
                        });
                    }
                }
                else {
                    console.log("This error 2");
                    res.status(UtilEnum_1.StatusCode.UNAUTHORIZED).json({
                        status: false,
                        msg: "Authorization is failed"
                    });
                }
            }
            else {
                res.status(UtilEnum_1.StatusCode.UNAUTHORIZED).json({
                    status: false,
                    msg: "Invalid auth attempt"
                });
            }
        });
    }
    isFundRaiseRequestValid(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const fund_id = req.params.edit_id;
            const user_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.user_id;
            try {
                if (fund_id && user_id) {
                    const fundRaiseRepo = new FundRaiserRepo_1.default();
                    const findFundRaise = yield fundRaiseRepo.getSingleFundRaiseOfUser(user_id, fund_id); //InitFundRaisingModel.findOne({ fund_id: fundRaise, user_id: user_id });
                    console.log(user_id, fund_id);
                    if (findFundRaise) {
                        next();
                    }
                    else {
                        res.status(UtilEnum_1.StatusCode.UNAUTHORIZED).json({
                            status: false,
                            msg: "Un Authorized Access"
                        });
                    }
                }
                else {
                    console.log("Un auth two");
                    res.status(UtilEnum_1.StatusCode.BAD_REQUESR).json({
                        status: false,
                        msg: "Un Authorized Access"
                    });
                }
            }
            catch (e) {
                res.status(UtilEnum_1.StatusCode.SERVER_ERROR).json({
                    status: false,
                    msg: "Internal Server Error"
                });
            }
        });
    }
    isValidAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = req.headers;
            const auth = headers['authorization'];
            if (auth && auth.split(' ')[0] === 'Bearer') {
                const tokenHelper = new tokenHelper_1.default();
                const token = auth.split(' ')[1];
                const checkValidity = yield tokenHelper.checkTokenValidity(token);
                console.log(token);
                if (!req.context) {
                    req.context = {};
                }
                req.context.auth_token = token;
                if (checkValidity && typeof checkValidity == "object") {
                    if ((checkValidity === null || checkValidity === void 0 ? void 0 : checkValidity.email) && checkValidity.role == "admin") {
                        req.context.email_id = checkValidity === null || checkValidity === void 0 ? void 0 : checkValidity.email;
                        req.context.token = token;
                        req.context.user_id = checkValidity.id;
                        console.log("Requested phone number is", checkValidity === null || checkValidity === void 0 ? void 0 : checkValidity.email);
                        next();
                    }
                    else {
                        console.log("This error 1");
                        res.status(UtilEnum_1.StatusCode.UNAUTHORIZED).json({
                            status: false,
                            msg: "Authorization is failed"
                        });
                    }
                }
                else {
                    console.log("This error 2");
                    console.log(checkValidity);
                    res.status(UtilEnum_1.StatusCode.UNAUTHORIZED).json({
                        status: false,
                        msg: "Authorization is failed"
                    });
                }
            }
            else {
                console.log("Headers");
                console.log(req.headers);
                console.log("This error 3");
                res.status(UtilEnum_1.StatusCode.UNAUTHORIZED).json({
                    status: false,
                    msg: "Invalid auth attempt"
                });
            }
        });
    }
}
exports.default = AuthMiddleware;
