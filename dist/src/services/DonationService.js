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
const axios_1 = __importDefault(require("axios"));
const DonationRepo_1 = __importDefault(require("../repositorys/DonationRepo"));
const FundRaiserRepo_1 = __importDefault(require("../repositorys/FundRaiserRepo"));
const PaymentOrderRepo_1 = __importDefault(require("../repositorys/PaymentOrderRepo"));
const PaymentWebHookRepo_1 = __importDefault(require("../repositorys/PaymentWebHookRepo"));
const UtilEnum_1 = require("../types/Enums/UtilEnum");
const paymentHelper_1 = __importDefault(require("../util/helper/paymentHelper"));
const utilHelper_1 = __importDefault(require("../util/helper/utilHelper"));
class DonationService {
    constructor() {
        this.paymentHelper = new paymentHelper_1.default();
        this.orderRepo = new PaymentOrderRepo_1.default();
        this.fundRepo = new FundRaiserRepo_1.default();
        this.webHookRepo = new PaymentWebHookRepo_1.default();
        this.donationHistoryRepo = new DonationRepo_1.default();
        this.findPrivateProfileHistoryPaginated = this.findPrivateProfileHistoryPaginated.bind(this);
        this.findMyDonationHistory = this.findMyDonationHistory.bind(this);
        this.findDonationByOrderId = this.findDonationByOrderId.bind(this);
    }
    findDonationByOrderId(order_id, profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield this.donationHistoryRepo.findOrder(order_id);
            if (profile) {
                if (profile.profile_id == profile_id) {
                    return {
                        status: true,
                        msg: "Order found",
                        statusCode: UtilEnum_1.StatusCode.OK,
                        data: profile
                    };
                }
                else {
                    return {
                        status: true,
                        msg: "Un authrazied access",
                        statusCode: UtilEnum_1.StatusCode.UNAUTHORIZED,
                        data: profile
                    };
                }
            }
            else {
                return {
                    status: false,
                    msg: "No data found",
                    statusCode: UtilEnum_1.StatusCode.NOT_FOUND
                };
            }
        });
    }
    transferAmountToBenf(amount, fundId, donation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findProfile = yield this.fundRepo.findFundPostByFundId(fundId);
                if (findProfile) {
                    const options = {
                        method: 'POST',
                        url: 'https://sandbox.cashfree.com/payout/transfers',
                        headers: {
                            accept: 'application/json',
                            'x-api-version': '2024-01-01',
                            'content-type': 'application/json',
                            'x-client-id': process.env.CASHFREE_PAYOUT_KEY,
                            'x-client-secret': process.env.CASHFREE_PAYOUT_SECRET
                        },
                        data: {
                            beneficiary_details: {
                                beneficiary_instrument_details: {
                                    bank_account_number: findProfile.withdraw_docs.account_number,
                                    bank_ifsc: findProfile.withdraw_docs.ifsc_code
                                },
                                beneficiary_id: findProfile.benf_id,
                                beneficiary_name: findProfile.withdraw_docs.holder_name
                            },
                            transfer_id: donation_id,
                            transfer_amount: amount,
                            transfer_currency: 'INR',
                            transfer_mode: 'banktransfer'
                        }
                    };
                    const transfer = (yield axios_1.default.request(options)).data;
                    if (transfer && transfer.status && transfer.status == "RECEIVED") {
                        return {
                            status: true,
                            msg: "Payment transfer scheduled",
                            statusCode: UtilEnum_1.StatusCode.OK
                        };
                    }
                    else {
                        return {
                            status: false,
                            msg: "Something went wrong",
                            statusCode: UtilEnum_1.StatusCode.BAD_REQUESR
                        };
                    }
                }
                else {
                    return {
                        status: false,
                        msg: "Something went wrong",
                        statusCode: UtilEnum_1.StatusCode.BAD_REQUESR
                    };
                }
            }
            catch (e) {
                return {
                    status: false,
                    msg: "Something went wrong",
                    statusCode: UtilEnum_1.StatusCode.SERVER_ERROR
                };
            }
        });
    }
    findMyDonationHistory(profile_id, limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const findHistory = yield this.donationHistoryRepo.findUserDonationHistory(profile_id, limit, skip);
            console.log(findHistory);
            if (findHistory.total_records) {
                return {
                    msg: "Histroy found",
                    status: true,
                    statusCode: UtilEnum_1.StatusCode.OK,
                    data: findHistory
                };
            }
            else {
                return {
                    msg: "No data found",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.NOT_FOUND
                };
            }
        });
    }
    findPrivateProfileHistoryPaginated(profile_id, limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const findHistory = yield this.donationHistoryRepo.findPrivateProfilePaginedtHistory(profile_id, limit, skip);
            if (findHistory.total_records) {
                return {
                    msg: "Histroy found",
                    status: true,
                    statusCode: UtilEnum_1.StatusCode.OK,
                    data: findHistory
                };
            }
            else {
                return {
                    msg: "No data found",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.NOT_FOUND
                };
            }
        });
    }
    creatOrder(profile_id, name, phone_number, email_address, amount, fund_id, hide_profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const utilHelper = new utilHelper_1.default();
            let randomNumber = utilHelper.generateAnOTP(4);
            let randomText = utilHelper.createRandomText(4);
            const orderPrefix = "PAY";
            let order_id = orderPrefix + randomNumber + randomText;
            let findOrder = yield this.orderRepo.findOne(order_id);
            while (findOrder) {
                randomNumber++;
                order_id = orderPrefix + randomNumber + randomText;
                findOrder = yield this.orderRepo.findOne(order_id);
            }
            const fundProfile = yield this.fundRepo.findFundPostByFundId(fund_id);
            if (fundProfile) {
                const itemName = `Fund donation for ${fundProfile.full_name} on their ${fundProfile.category}`;
                const createOrder = yield this.paymentHelper.createOrder(order_id, amount, itemName, [{
                        item_description: fundProfile.about,
                        item_details_url: `http://localhost:3000/fund-raising/view/${fund_id}`,
                        item_id: fund_id,
                        item_name: itemName
                    }], profile_id, email_address, phone_number, name);
                const paymentOrder = {
                    amount: amount,
                    date: new Date(),
                    fund_id,
                    order_id,
                    status: false,
                    hide_profile,
                    profile_id,
                    name,
                };
                yield this.orderRepo.insertOne(paymentOrder);
                console.log(createOrder);
                if (createOrder) {
                    return {
                        status: true,
                        msg: "Order created success",
                        statusCode: UtilEnum_1.StatusCode.CREATED,
                        data: {
                            order: createOrder
                        }
                    };
                }
            }
            return {
                status: false,
                msg: "Something went wrong",
                statusCode: UtilEnum_1.StatusCode.BAD_REQUESR,
            };
        });
    }
    verifyPayment(order_id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const verifyPayment = yield this.paymentHelper.verifyPayment(order_id);
            let receipt = '';
            const utilHelper = new utilHelper_1.default();
            if (verifyPayment) {
                const findOrder = yield this.orderRepo.findOne(order_id);
                if (findOrder && !findOrder.status) {
                    const fundRaise = yield this.fundRepo.findFundPostByFundId(findOrder.fund_id);
                    if (fundRaise) {
                        const campignTitle = utilHelper.generateFundRaiserTitle(fundRaise);
                        try {
                            const donatedDate = utilHelper.formatDateToMonthNameAndDate(findOrder.date);
                            const certificateName = yield this.paymentHelper.createReceipt(findOrder.name, campignTitle, findOrder.amount, donatedDate, findOrder.order_id);
                            if (certificateName) {
                                receipt = certificateName;
                            }
                        }
                        catch (e) {
                            console.log("Certification creation failed");
                        }
                        let randomNumber = utilHelper.generateAnOTP(4);
                        let randomText = utilHelper.createRandomText(4);
                        let donationId = randomText + randomNumber;
                        let findDonation = yield this.donationHistoryRepo.findOneDonation(donationId);
                        while (findDonation) {
                            randomNumber++;
                            donationId = randomText + randomNumber;
                            findDonation = yield this.donationHistoryRepo.findOneDonation(donationId);
                        }
                        let isSettled = false;
                        const transferAmount = yield this.transferAmountToBenf((_b = (_a = verifyPayment === null || verifyPayment === void 0 ? void 0 : verifyPayment.data) === null || _a === void 0 ? void 0 : _a.order) === null || _b === void 0 ? void 0 : _b.order_amount, findOrder.fund_id, donationId);
                        if (transferAmount.status) {
                            isSettled = true;
                        }
                        const donationHistory = {
                            order_id,
                            is_settled: isSettled,
                            amount: (_d = (_c = verifyPayment === null || verifyPayment === void 0 ? void 0 : verifyPayment.data) === null || _c === void 0 ? void 0 : _c.order) === null || _d === void 0 ? void 0 : _d.order_amount,
                            date: new Date(),
                            donation_id: donationId.toUpperCase(),
                            fund_id: findOrder === null || findOrder === void 0 ? void 0 : findOrder.fund_id,
                            hide_profile: findOrder.hide_profile,
                            profile_id: findOrder.profile_id,
                            receipt,
                            name: findOrder.name
                        };
                        console.log("Donation history");
                        console.log(donationHistory);
                        fundRaise.collected += (_f = (_e = verifyPayment === null || verifyPayment === void 0 ? void 0 : verifyPayment.data) === null || _e === void 0 ? void 0 : _e.order) === null || _f === void 0 ? void 0 : _f.order_amount;
                        yield this.fundRepo.updateFundRaiserByModel(fundRaise);
                        yield this.orderRepo.updateStatus(order_id, true);
                        yield this.webHookRepo.updateWebhookStatus(order_id, true);
                        const insertHistory = yield this.donationHistoryRepo.insertDonationHistory(donationHistory);
                        console.log(insertHistory);
                        return {
                            status: true,
                            msg: "Payment success",
                            statusCode: UtilEnum_1.StatusCode.OK,
                        };
                    }
                    else {
                        return {
                            status: false,
                            msg: "Order not found",
                            statusCode: UtilEnum_1.StatusCode.NOT_FOUND,
                        };
                    }
                }
                else {
                    return {
                        status: false,
                        msg: "Order not found",
                        statusCode: UtilEnum_1.StatusCode.NOT_FOUND,
                    };
                }
            }
            return {
                status: false,
                msg: "Payment failed",
                statusCode: UtilEnum_1.StatusCode.BAD_REQUESR,
            };
        });
    }
}
exports.default = DonationService;
