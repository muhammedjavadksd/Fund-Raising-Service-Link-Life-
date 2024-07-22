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
                            total_records: countDocuments,
                            current_page: page,
                            total_pages: Math.ceil(countDocuments / limit)
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
            try {
                const profile_id = req.params.profile_id;
                const profile = yield this.fundRaiserRepo.findFundPostByFundId(profile_id);
                if (profile) {
                    res.status(200).json({ status: true, data: profile });
                }
                else {
                    res.status(204).json({ status: false, msg: "Profile not found" });
                }
            }
            catch (e) {
                res.status(500).json({ status: false, msg: "Internal Server Error" });
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
            const benificiary_relation = req.body.benificiary_relation;
            const full_name = req.body.full_name;
            const city = req.body.city;
            const district = req.body.district;
            const full_address = req.body.full_address;
            const pincode = req.body.pin_code;
            const state = req.body.state;
            const utilHelper = new utilHelper_1.default();
            const fundID = utilHelper.createFundRaiseID(DbEnum_1.FundRaiserCreatedBy.ADMIN).toUpperCase();
            const createdDate = new Date();
            const fundRaiserData = {
                "fund_id": fundID,
                "amount": amount,
                "category": category,
                "sub_category": sub_category,
                "phone_number": phone_number,
                "email_id": email_id,
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
            // console.log(this);
            this.fundRaiserRepo.createFundRaiserPost(fundRaiserData).then((data) => {
                res.status(data.statusCode).json({ status: true, msg: data.msg, data: data.data });
            }).catch((err) => {
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
