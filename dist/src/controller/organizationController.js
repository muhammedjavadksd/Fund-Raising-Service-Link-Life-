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
const utilHelper_1 = __importDefault(require("../util/helper/utilHelper"));
const FundRaiserRepo_1 = __importDefault(require("../repositorys/FundRaiserRepo"));
class OrganizationController {
    constructor() {
        this.fundRaiserService = new FundRaiserService_1.default();
        this.fundRaiserRepo = new FundRaiserRepo_1.default();
    }
    getAllFundRaise(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const organization_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.organization_id;
            const limit = +req.params.limit;
            const skip = +req.params.skip;
            const findAllPost = yield this.fundRaiserService.getOwnerFundRaise(organization_id, DbEnum_1.FundRaiserCreatedBy.ORGANIZATION, limit, skip);
            res.status(findAllPost.statusCode).json({ status: findAllPost.status, msg: findAllPost.msg, data: findAllPost.data });
        });
    }
    getSingleProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const profile_id = req.params.profile_id;
            const organization_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.organization_id;
            const findProfile = yield this.fundRaiserService.getOwnerSingleProfile(profile_id, DbEnum_1.FundRaiserCreatedBy.ORGANIZATION, organization_id);
            res.status(findProfile.statusCode).json({ status: findProfile.status, msg: findProfile.msg, data: findProfile.data });
        });
    }
    editFundRaiser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const edit_id = req.params.edit_id;
            const edit_data = req.body.edit_data;
            const editFundRaiser = yield this.fundRaiserService.editFundRaiser(edit_id, edit_data);
            res.status(editFundRaiser.statusCode).json({ status: editFundRaiser.status, msg: editFundRaiser.msg });
        });
    }
    addFundRaiser(req, res) {
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
        const fundID = utilHelper.createFundRaiseID(DbEnum_1.FundRaiserCreatedBy.ORGANIZATION).toUpperCase();
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
        this.fundRaiserRepo.createFundRaiserPost(fundRaiserData).then((data) => {
            res.status(data.statusCode).json({ status: true, msg: data.msg, data: data.data });
        }).catch((err) => {
            res.status(500).json({ status: false, msg: "Interanl server error", });
        });
    }
    updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fund_id = req.params.edit_id;
            const newStatus = req.body.status;
            const updateStatus = yield this.fundRaiserService.updateStatus(fund_id, newStatus);
            res.status(updateStatus.statusCode).json({ status: updateStatus.status, msg: updateStatus.msg });
        });
    }
    closeFundRaiser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fund_id = req.params.edit_id;
            const closeFundRaiser = yield this.fundRaiserService.closeFundRaiser(fund_id);
            res.status(closeFundRaiser.statusCode).json({ status: closeFundRaiser.status, msg: closeFundRaiser.msg });
        });
    }
}
exports.default = OrganizationController;
