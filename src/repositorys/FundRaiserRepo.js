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
const initFundRaiseModel_1 = __importDefault(require("../db/model/initFundRaiseModel"));
const DbEnum_1 = require("../types/Enums/DbEnum");
class FundRaiserRepo {
    constructor() {
        this.getActiveFundRaiserPost = this.getActiveFundRaiserPost.bind(this);
        this.getAllFundRaiserPost = this.getAllFundRaiserPost.bind(this);
        this.getRestrictedFundRaisePost = this.getRestrictedFundRaisePost.bind(this);
        this.getUserPosts = this.getUserPosts.bind(this);
        this.getOrganizationPosts = this.getOrganizationPosts.bind(this);
        this.createFundRaiserPost = this.createFundRaiserPost.bind(this);
        this.updateFundRaiser = this.updateFundRaiser.bind(this);
        this.updateFundRaiserByModel = this.updateFundRaiserByModel.bind(this);
        this.findFundPostByFundId = this.findFundPostByFundId.bind(this);
        this.getSingleFundRaiseOfUser = this.getSingleFundRaiseOfUser.bind(this);
        this.FundRaiserModel = initFundRaiseModel_1.default;
    }
    getActiveFundRaiserPost(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let skip = (page - 1) * limit;
                let limitedData = yield this.FundRaiserModel.find({ status: DbEnum_1.FundRaiserStatus.APPROVED, closed: false }).skip(skip).limit(limit);
                return limitedData;
            }
            catch (e) {
                return [];
            }
        });
    }
    getAllFundRaiserPost(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let skip = (page - 1) * limit;
                let limitedData = yield this.FundRaiserModel.find({}).skip(skip).limit(limit);
                return limitedData;
            }
            catch (e) {
                return [];
            }
        });
    }
    getRestrictedFundRaisePost(fund_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield this.FundRaiserModel.findOne({ fund_id, status: DbEnum_1.FundRaiserStatus.APPROVED, closed: false });
                return profile;
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
    }
    getUserPosts(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fundRaisePost = yield this.FundRaiserModel.find({ created_by: DbEnum_1.FundRaiserCreatedBy.USER, user_id });
                return fundRaisePost;
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
    }
    getOrganizationPosts(organization_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fundRaisePost = yield this.FundRaiserModel.find({ created_by: DbEnum_1.FundRaiserCreatedBy.ORGANIZATION, user_id: organization_id });
                return fundRaisePost;
            }
            catch (e) {
                console.log(e);
                return [];
            }
        });
    }
    createFundRaiserPost(initialData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newFundRaiser = new this.FundRaiserModel(initialData);
                yield newFundRaiser.save();
                return {
                    msg: "Fund raise created success",
                    status: true,
                    statusCode: 201,
                    data: {
                        id: newFundRaiser.id
                    }
                };
            }
            catch (e) {
                console.log(e);
                return {
                    msg: "Interanl server error",
                    status: false,
                    statusCode: 500,
                };
            }
        });
    }
    updateFundRaiser(fund_id, edit_data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.FundRaiserModel.updateOne({ fund_id }, { $set: edit_data });
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    updateFundRaiserByModel(model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield model.save();
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    findFundPostByFundId(fund_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fund_post = this.FundRaiserModel.findOne({ fund_id });
                return fund_post;
            }
            catch (e) {
                return null;
            }
        });
    }
    getSingleFundRaiseOfUser(user_id, fund_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findFundRaise = yield this.FundRaiserModel.findOne({ user_id, fund_id });
                return findFundRaise;
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
    }
}
exports.default = FundRaiserRepo;
