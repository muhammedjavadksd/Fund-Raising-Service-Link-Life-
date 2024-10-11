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
        this.createFundRaiserPost = this.createFundRaiserPost.bind(this);
        this.updateFundRaiser = this.updateFundRaiser.bind(this);
        this.findFundPostByFundId = this.findFundPostByFundId.bind(this);
        this.getSingleFundRaiseOfUser = this.getSingleFundRaiseOfUser.bind(this);
        this.closeFundRaiser = this.closeFundRaiser.bind(this);
        this.deleteOneDocument = this.deleteOneDocument.bind(this);
        this.deleteOnePicture = this.deleteOnePicture.bind(this);
        this.FundRaiserModel = initFundRaiseModel_1.default;
    }
    deleteOneDocument(fundId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteDoc = yield this.FundRaiserModel.updateOne({ fund_id: fundId }, { $pull: { documents: image } });
            return deleteDoc.modifiedCount > 0;
        });
    }
    deleteOnePicture(fundId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteDoc = yield this.FundRaiserModel.updateOne({ fund_id: fundId }, { $pull: { picture: image } });
            return deleteDoc.modifiedCount > 0;
        });
    }
    getStatitics() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const result = yield this.FundRaiserModel.aggregate([
                {
                    $facet: {
                        totalFundRaise: [{ $count: "count" }],
                        activeFundRaise: [
                            { $match: { is_closed: false, status: DbEnum_1.FundRaiserStatus.APPROVED } },
                            { $count: "count" }
                        ],
                        closedFundRaise: [
                            { $match: { is_closed: false, status: DbEnum_1.FundRaiserStatus.CLOSED } },
                            { $count: "count" }
                        ],
                        pendingFundRaiser: [
                            { $match: { is_closed: false, status: { $in: [DbEnum_1.FundRaiserStatus.INITIATED, DbEnum_1.FundRaiserStatus.CREATED] } } },
                            { $count: "count" }
                        ]
                    }
                }
            ]);
            const totalFundRaise = ((_a = result[0].totalFundRaise[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
            const activeFundRaise = ((_b = result[0].activeFundRaise[0]) === null || _b === void 0 ? void 0 : _b.count) || 0;
            const closedFundRaise = ((_c = result[0].closedFundRaise[0]) === null || _c === void 0 ? void 0 : _c.count) || 0;
            const pendingFundRaiser = ((_d = result[0].pendingFundRaiser[0]) === null || _d === void 0 ? void 0 : _d.count) || 0;
            return {
                total_fund_raiser: totalFundRaise,
                activeFundRaise,
                closedFundRaise,
                pendingFundRaiser
            };
        });
    }
    closeFundRaiser(fund_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findUpdate = yield this.FundRaiserModel.updateOne({ fund_id }, { $set: { closed: true, status: DbEnum_1.FundRaiserStatus.CLOSED } });
            return findUpdate.modifiedCount > 0;
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
    getAllFundRaiserPost(page, limit, status, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const match = filter;
                if (status) {
                    match['status'] = status;
                }
                console.log(match);
                const fundRaisePost = yield this.FundRaiserModel.aggregate([
                    {
                        $match: match
                    },
                    {
                        $facet: {
                            paginated: [
                                {
                                    $sort: {
                                        _id: -1
                                    }
                                },
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
                console.log(match);
                const response = {
                    paginated: fundRaisePost[0].paginated,
                    total_records: fundRaisePost[0].total_records,
                };
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
                                    $sort: {
                                        _id: -1
                                    }
                                },
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
    findFundPostByFundId(fund_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fund_post = yield this.FundRaiserModel.aggregate([
                    {
                        $match: {
                            fund_id
                        }
                    },
                    {
                        $lookup: {
                            from: "bank-accounts",
                            localField: "withdraw_docs.benf_id",
                            foreignField: "befId",
                            as: "bank_account"
                        }
                    },
                    {
                        $unwind: {
                            path: "$bank_account",
                            preserveNullAndEmptyArrays: true,
                        }
                    }
                ]);
                console.log(fund_post);
                return fund_post[0];
            }
            catch (e) {
                console.log(e);
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
