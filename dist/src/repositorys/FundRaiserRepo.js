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
const UtilEnum_1 = require("../types/Enums/UtilEnum");
const mongoose_1 = __importDefault(require("mongoose"));
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
        this.fundRaiserPaginatedByCategory = this.fundRaiserPaginatedByCategory.bind(this);
        this.closeFundRaiser = this.closeFundRaiser.bind(this);
        this.FundRaiserModel = initFundRaiseModel_1.default;
    }
    closeFundRaiser(fund_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findUpdate = yield this.FundRaiserModel.findOneAndUpdate({ fund_id }, { closed: true, status: DbEnum_1.FundRaiserStatus.CLOSED });
            return !!(findUpdate === null || findUpdate === void 0 ? void 0 : findUpdate.isModified());
        });
    }
    fundRaiserPaginatedByCategory(category, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            // try {
            //     const findProfile = await this.FundRaiserModel.find({ category, status: FundRaiserStatus.APPROVED, closed: false }).skip(skip).limit(limit);
            //     return findProfile
            // } catch (e) {
            //     return [];
            // }
            //dont need this function use getActiveFundRaiserPost
            return [];
        });
    }
    countRecords() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const countFundRaise = yield this.FundRaiserModel.countDocuments({});
                return countFundRaise;
            }
            catch (e) {
                return 0;
            }
        });
    }
    getActiveFundRaiserPost(skip, limit, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limitedData = yield this.FundRaiserModel.aggregate([
                    {
                        $match: Object.assign({ status: DbEnum_1.FundRaiserStatus.APPROVED, closed: false }, query)
                    },
                    {
                        $facet: {
                            paginated: [
                                {
                                    $skip: skip
                                },
                                {
                                    $limit: limit
                                }
                            ],
                            total_records: [
                                {
                                    $count: "total_records"
                                }
                            ]
                        }
                    },
                    {
                        $unwind: "$total_records"
                    },
                    {
                        $project: {
                            paginated: 1,
                            total_records: "$total_records.total_records"
                        }
                    }
                ]);
                const response = {
                    paginated: limitedData[0].paginated,
                    total_records: limitedData[0].total_records
                };
                console.log("Limited data");
                console.log(limitedData);
                return response;
            }
            catch (e) {
                return {
                    paginated: [],
                    total_records: 0
                };
            }
        });
    }
    getAllFundRaiserPost(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const limitedData = yield this.FundRaiserModel.find({}).skip(skip).limit(limit);
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
    getUserPosts(user_id, skip, limit, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const filtter = {
                user_id: new mongoose_1.default.Types.ObjectId(user_id)
            };
            if (status) {
                filtter['status'] = status;
            }
            try {
                const fundRaisePost = yield this.FundRaiserModel.aggregate([
                    {
                        $match: filtter
                    },
                    {
                        $facet: {
                            paginated: [
                                {
                                    $skip: skip
                                },
                                {
                                    $limit: limit
                                }
                            ],
                            total_records: [
                                {
                                    $count: "total_records"
                                }
                            ]
                        }
                    },
                    {
                        $unwind: "$total_records"
                    },
                    {
                        $project: {
                            paginated: 1,
                            total_records: "$total_records.total_records"
                        }
                    }
                ]);
                console.log(fundRaisePost);
                const response = {
                    paginated: fundRaisePost[0].paginated,
                    total_records: fundRaisePost[0].total_records,
                };
                return response;
            }
            catch (e) {
                // console.log(e);
                return {
                    paginated: [],
                    total_records: 0
                };
            }
        });
    }
    getOrganizationPosts(organization_id, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fundRaisePost = yield this.FundRaiserModel.find({ created_by: DbEnum_1.FundRaiserCreatedBy.ORGANIZATION, user_id: organization_id }).skip(skip).limit(limit);
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
                    statusCode: UtilEnum_1.StatusCode.CREATED,
                    data: {
                        id: newFundRaiser.id,
                        fund_id: newFundRaiser.fund_id
                    }
                };
            }
            catch (e) {
                console.log(e);
                return {
                    msg: "Interanl server error",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.SERVER_ERROR,
                };
            }
        });
    }
    updateFundRaiser(fund_id, edit_data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(edit_data);
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
