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
const FundRaiserService_1 = __importDefault(require("../services/FundRaiserService"));
const DbEnum_1 = require("../types/Enums/DbEnum");
const FundRaiserRepo_1 = __importDefault(require("../repositorys/FundRaiserRepo"));
const utilHelper_1 = __importDefault(require("../util/helper/utilHelper"));
const ConstData_1 = require("../types/Enums/ConstData");
class UserController {
    constructor() {
        this.getUserFundRaisePost = this.getUserFundRaisePost.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
        this.closeFundRaise = this.closeFundRaise.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.editFundRaise = this.editFundRaise.bind(this);
        this.createFundRaise = this.createFundRaise.bind(this);
        this.getActiveFundRaise = this.getActiveFundRaise.bind(this);
        this.getSingleProfile = this.getSingleProfile.bind(this);
        this.fundRaiserService = new FundRaiserService_1.default();
        this.fundRaiserRepo = new FundRaiserRepo_1.default();
    }
    getUserFundRaisePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.user_id;
                if (user_id) {
                    const getMyFundRaisePost = yield this.fundRaiserService.getOwnerFundRaise(user_id, DbEnum_1.FundRaiserCreatedBy.USER);
                    if (getMyFundRaisePost.status) {
                        const data = getMyFundRaisePost.data;
                        res.status(getMyFundRaisePost.statusCode).json({ status: true, data });
                    }
                    else {
                        res.status(getMyFundRaisePost.statusCode).json({ status: false, msg: getMyFundRaisePost.msg });
                    }
                }
                else {
                    res.status(401).json({ status: false, msg: "Authentication failed" });
                }
            }
            catch (e) {
                res.status(500).json({ status: false, msg: "Internal server error" });
            }
        });
    }
    deleteImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const type = req.params.type;
            const edit_id = req.params.edit_id;
            const image_id = req.params.image_id;
            try {
                const deleteImage = yield this.fundRaiserService.deleteImage(edit_id, type, image_id);
                if (deleteImage) {
                    res.status(200).json({ status: true, msg: "Image delete success" });
                }
                else {
                    res.status(500).json({ status: false, msg: "Something went wrong" });
                }
            }
            catch (e) {
                console.log(e);
                res.status(500).json({ status: false, msg: "Something went wrong" });
            }
        });
    }
    closeFundRaise(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fund_id = req.params.fund_id;
                const closePost = yield this.fundRaiserService.closeFundRaiser(fund_id);
                res.status(closePost.statusCode).json({ status: closePost.status, msg: closePost.msg });
            }
            catch (e) {
                res.status(500).json({ status: false, msg: "Internal server error" });
            }
        });
    }
    uploadImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                let file = (_a = req.files) === null || _a === void 0 ? void 0 : _a.files;
                console.log(file);
                if (file) {
                    const fundRaiserID = req.params.edit_id;
                    const edit_type = req.body.edit_type;
                    const saveFundRaise = yield this.fundRaiserService.uploadImage(file, fundRaiserID, edit_type);
                    res.status(saveFundRaise.statusCode).json({
                        status: saveFundRaise.status,
                        msg: saveFundRaise.msg,
                        data: {
                            picture: (_b = saveFundRaise.data) === null || _b === void 0 ? void 0 : _b.picture,
                            documents: (_c = saveFundRaise.data) === null || _c === void 0 ? void 0 : _c.documents
                        }
                    });
                }
                else {
                    res.status(400).json({
                        status: false,
                        msg: "Please provide valid files"
                    });
                }
            }
            catch (e) {
                console.log(e);
                res.status(500).json({
                    status: false,
                    msg: "Internal Server Error"
                });
            }
        });
    }
    editFundRaise(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const edit_id = req.params.edit_id;
                const body = req.body;
                const editResponse = yield this.fundRaiserRepo.updateFundRaiser(edit_id, body);
                if (editResponse) {
                    res.status(200).json({ status: true, msg: "Updated success" });
                }
                else {
                    res.status(500).json({ status: false, msg: "Internal server error" });
                }
            }
            catch (e) {
                res.status(500).json({ status: true, msg: "Internal server error" });
            }
        });
    }
    createFundRaise(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const bodyData = req.body;
                const utilHelper = new utilHelper_1.default();
                console.log(bodyData);
                const amount = bodyData.amount;
                const category = bodyData.category;
                const sub_category = bodyData.sub_category;
                const phone_number = bodyData.phone_number;
                const email = bodyData.email;
                const otpNumber = utilHelper.generateAnOTP(ConstData_1.const_data.OTP_LENGTH);
                const otpExpire = ConstData_1.const_data.OTP_EXPIRE_TIME;
                const todayDate = new Date();
                const user_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.user_id;
                const fund_id = utilHelper.createFundRaiseID(DbEnum_1.FundRaiserCreatedBy.USER).toUpperCase();
                console.log(fund_id);
                console.log(req.context);
                if (user_id && fund_id) {
                    const fundRaiseData = {
                        validate: {
                            otp: otpNumber,
                            otp_expired: otpExpire
                        },
                        created_date: todayDate,
                        created_by: DbEnum_1.FundRaiserCreatedBy.USER,
                        user_id,
                        fund_id,
                        amount,
                        category,
                        sub_category,
                        phone_number,
                        email_id: email,
                    };
                    console.log(fundRaiseData);
                    const createFundRaise = yield this.fundRaiserService.createFundRaisePost(fundRaiseData);
                    if (createFundRaise.status) {
                        res.status(createFundRaise.statusCode).json({ status: true, msg: createFundRaise.msg, data: { id: (_b = createFundRaise.data) === null || _b === void 0 ? void 0 : _b.id } });
                    }
                    else {
                        res.status(createFundRaise.statusCode).json({ status: false, msg: createFundRaise.msg });
                    }
                }
                else {
                    res.status(500).json({
                        status: false,
                        msg: "Internal Servor Error"
                    });
                }
            }
            catch (e) {
                console.log(e);
                res.status(500).json({
                    status: false,
                    msg: "Internal Servor Error"
                });
            }
        });
    }
    getActiveFundRaise(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = Number(req.params.limit);
                const page = Number(req.params.page);
                const getLimitedData = yield this.fundRaiserRepo.getActiveFundRaiserPost(page, limit);
                if (getLimitedData === null || getLimitedData === void 0 ? void 0 : getLimitedData.length) {
                    res.status(200).json({ status: true, data: getLimitedData });
                }
                else {
                    res.status(400).json({ status: false, msg: "No data found" });
                }
            }
            catch (e) {
                res.status(500).json({ status: false, msg: "Internal Server Error" });
            }
        });
    }
    getSingleProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile_id = req.params.profile_id;
                const profile = yield this.fundRaiserRepo.getRestrictedFundRaisePost(profile_id);
                if (profile) {
                    res.status(200).json({ status: true, data: profile });
                }
                else {
                    res.status(400).json({ status: false, msg: "Profile not found" });
                }
            }
            catch (e) {
                res.status(500).json({ status: false, msg: "Internal Server Error" });
            }
        });
    }
}
exports.default = UserController;
