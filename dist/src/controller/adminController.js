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
exports.AdminController = void 0;
const DbEnum_1 = require("../types/Enums/DbEnum");
const FundRaiserRepo_1 = __importDefault(require("../repositorys/FundRaiserRepo"));
const FundRaiserService_1 = __importDefault(require("../services/FundRaiserService"));
const utilHelper_1 = __importDefault(require("../util/helper/utilHelper"));
const UtilEnum_1 = require("../types/Enums/UtilEnum");
class AdminController {
    constructor() {
        this.getAllFundRaise = this.getAllFundRaise.bind(this);
        this.getSingleProfile = this.getSingleProfile.bind(this);
        this.editFundRaiser = this.editFundRaiser.bind(this);
        this.addFundRaiser = this.addFundRaiser.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
        this.closeFundRaiser = this.closeFundRaiser.bind(this);
        this.fundRaiserRepo = new FundRaiserRepo_1.default();
        this.fundRaiserService = new FundRaiserService_1.default();
    }
    getAllFundRaise(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Reached here");
            try {
                const limit = Number(req.params.limit);
                const page = Number(req.params.page);
                const fundRaisersPost = yield this.fundRaiserRepo.getAllFundRaiserPost(page, limit);
                const countDocuments = yield this.fundRaiserRepo.countRecords();
                if (fundRaisersPost === null || fundRaisersPost === void 0 ? void 0 : fundRaisersPost.length) {
                    res.status(200).json({
                        status: true,
                        data: {
                            profiles: fundRaisersPost,
                            pagination: {
                                total_records: countDocuments,
                                current_page: page,
                                total_pages: Math.ceil(countDocuments / limit)
                            }
                        }
                    });
                }
                else {
                    res.status(204).json({ status: false, msg: "No data found" });
                }
            }
            catch (e) {
                res.status(500).json({ status: false, msg: "Internal Server Error" });
            }
        });
    }
    getSingleProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("REACHED HERE");
            try {
                const profile_id = req.params.profile_id;
                const profile = yield this.fundRaiserRepo.findFundPostByFundId(profile_id);
                console.log("Profile");
                console.log(profile);
                if (profile) {
                    res.status(UtilEnum_1.StatusCode.OK).json({ status: true, data: profile });
                }
                else {
                    res.status(UtilEnum_1.StatusCode.NOT_FOUND).json({ status: false, msg: "Profile not found" });
                }
            }
            catch (e) {
                res.status(UtilEnum_1.StatusCode.SERVER_ERROR).json({ status: false, msg: "Internal Server Error" });
            }
        });
    }
    editFundRaiser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fund_id = req.params.edit_id;
                const edit_data = req.body.edit_data;
                const updateFundRaiser = yield this.fundRaiserService.editFundRaiser(fund_id, edit_data);
                res.status(updateFundRaiser.statusCode).json({
                    status: updateFundRaiser.status,
                    msg: updateFundRaiser.msg
                });
            }
            catch (e) {
                console.log(e);
                res.status(500).json({
                    status: false,
                    msg: "Something went wrong"
                });
            }
        });
    }
    addFundRaiser(req, res) {
        try {
            const amount = req.body.amount;
            const category = req.body.category;
            const sub_category = req.body.sub_category;
            const phone_number = req.body.phone_number;
            const email_id = req.body.email_id;
            const age = req.body.age;
            const about = req.body.about;
            const description = req.body.description;
            const benificiary_relation = req.body.benificiary_relation;
            const full_name = req.body.full_name;
            const city = req.body.city;
            const district = req.body.district;
            const full_address = req.body.full_address;
            const pincode = req.body.pin_code;
            const state = req.body.state;
            const documents = req.body.documents;
            const pictures = req.body.pictures;
            console.log(req.body);
            console.log("body");
            console.log("Reached here");
            console.log(documents);
            console.log(pictures);
            const utilHelper = new utilHelper_1.default();
            const fundID = utilHelper.createFundRaiseID(DbEnum_1.FundRaiserCreatedBy.ADMIN).toUpperCase();
            const createdDate = new Date();
            const fundRaiserData = {
                withdraw_docs: {
                    accont_type: UtilEnum_1.FundRaiserBankAccountType.Savings,
                    account_number: '',
                    holder_name: "",
                    ifsc_code: ""
                },
                "fund_id": fundID,
                "amount": amount,
                "category": category,
                "sub_category": sub_category,
                "phone_number": phone_number,
                "email_id": email_id,
                "description": description,
                "created_date": createdDate,
                "created_by": DbEnum_1.FundRaiserCreatedBy.ADMIN,
                "user_id": "667868f8e5922a99a6e87d95",
                "closed": false,
                "status": DbEnum_1.FundRaiserStatus.INITIATED,
                "about": about,
                "age": age,
                "benificiary_relation": benificiary_relation,
                "full_name": full_name,
                "city": city,
                "district": district,
                "full_address": full_address,
                "pincode": pincode,
                "state": state
            };
            console.log("Thsi data will svae");
            console.log(fundRaiserData);
            this.fundRaiserService.createFundRaisePost(fundRaiserData).then((data) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                let picturesUrl = (_b = (_a = data.data) === null || _a === void 0 ? void 0 : _a.upload_images) === null || _b === void 0 ? void 0 : _b.pictures.slice(0, pictures);
                let documentsUrl = (_d = (_c = data.data) === null || _c === void 0 ? void 0 : _c.upload_images) === null || _d === void 0 ? void 0 : _d.pictures.slice(0, documents);
                yield this.fundRaiserService.uploadImage(picturesUrl, fundID, UtilEnum_1.FundRaiserFileType.Pictures);
                yield this.fundRaiserService.uploadImage(documentsUrl, fundID, UtilEnum_1.FundRaiserFileType.Document);
                res.status(data.statusCode).json({ status: true, msg: data.msg, data: data.data });
            })).catch((err) => {
                res.status(500).json({ status: false, msg: "Interanl server error", });
            });
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ status: false, msg: "Interanl server error", });
        }
    }
    updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fund_id = req.params.edit_id;
                const newStatus = req.body.status;
                const updateStatus = yield this.fundRaiserService.updateStatus(fund_id, newStatus);
                res.status(updateStatus.statusCode).json({ status: updateStatus.status, msg: updateStatus.msg });
            }
            catch (e) {
                res.status(500).json({ status: false, msg: "Internal server error" });
            }
        });
    }
    closeFundRaiser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fund_id = req.params.edit_id;
                const closeFundRaiser = yield this.fundRaiserService.closeFundRaiser(fund_id);
                res.status(closeFundRaiser.statusCode).json({ status: closeFundRaiser.status, msg: closeFundRaiser.msg });
            }
            catch (e) {
                res.status(500).json({ status: false, msg: "Internal server error" });
            }
        });
    }
}
exports.AdminController = AdminController;
