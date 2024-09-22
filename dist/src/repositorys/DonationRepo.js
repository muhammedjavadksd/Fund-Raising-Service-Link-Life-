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
const DonationHistory_1 = __importDefault(require("../db/model/DonationHistory"));
class DonationRepo {
    getStatitics() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = yield DonationHistory_1.default.aggregate([
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: "$amount" }
                    }
                }
            ]);
            return {
                total_donation: ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.totalAmount) || 0
            };
        });
    }
    findOrder(order_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield DonationHistory_1.default.aggregate([
                    {
                        $match: {
                            order_id
                        }
                    },
                    {
                        $lookup: {
                            from: "init_fund_raising",
                            as: "profile",
                            foreignField: "fund_id",
                            localField: "fund_id"
                        }
                    },
                    {
                        $unwind: "$profile"
                    }
                ]);
                console.log("Payment");
                console.log(payment);
                return payment[0];
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
    }
    findUserDonationHistory(profile_id, limit, skip) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const find = yield DonationHistory_1.default.aggregate([
                    {
                        $match: {
                            profile_id,
                        }
                    },
                    {
                        $facet: {
                            paginated: [
                                {
                                    $skip: skip
                                },
                                {
                                    $limit: limit
                                },
                                {
                                    $lookup: {
                                        from: "init_fund_raising",
                                        as: "fund_profile",
                                        foreignField: "fund_id",
                                        localField: "fund_id"
                                    }
                                },
                                {
                                    $unwind: "$fund_profile"
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
                        $sort: {
                            date: -1
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
                    paginated: find[0].paginated,
                    total_records: find[0].total_records
                };
                return response;
            }
            catch (e) {
                return {
                    total_records: 0,
                    paginated: []
                };
            }
        });
    }
    findPrivateProfilePaginedtHistory(profile_id, limit, skip) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const find = yield DonationHistory_1.default.aggregate([
                    {
                        $match: {
                            fund_id: profile_id,
                            hide_profile: false
                        }
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
                        $sort: {
                            date: -1
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
                    paginated: find[0].paginated,
                    total_records: find[0].total_records
                };
                return response;
            }
            catch (e) {
                return {
                    total_records: 0,
                    paginated: []
                };
            }
        });
    }
    findProfilePaginedtHistory(profile_id, limit, skip) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const find = yield DonationHistory_1.default.aggregate([
                    {
                        $match: {
                            fund_id: profile_id,
                        }
                    },
                    {
                        $skip: skip
                    },
                    {
                        $limit: limit
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
                        $sort: {
                            date: -1
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
                    paginated: find[0].paginated,
                    total_records: find[0].total_records
                };
                return response;
            }
            catch (e) {
                return {
                    total_records: 0,
                    paginated: []
                };
            }
        });
    }
    findManyUserDonation(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findMany = yield DonationHistory_1.default.find({ profile_id: user_id });
            return findMany;
        });
    }
    findManyFundRaiserDonation(fund_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findMany = yield DonationHistory_1.default.find({ fund_id });
            return findMany;
        });
    }
    findManyFundRaiserDonationByUser(fund_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findMany = yield DonationHistory_1.default.find({ fund_id, profile_id: user_id });
            return findMany;
        });
    }
    insertDonationHistory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new DonationHistory_1.default(data);
            const save = yield instance.save();
            return save === null || save === void 0 ? void 0 : save.id;
        });
    }
    findOneDonation(donation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOne = yield DonationHistory_1.default.findOne({ donation_id });
            return findOne;
        });
    }
}
exports.default = DonationRepo;
