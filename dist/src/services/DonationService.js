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
                    profile_id
                };
                yield this.orderRepo.insertOne(paymentOrder);
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
            var _a, _b;
            const verifyPayment = yield this.paymentHelper.verifyPayment(order_id);
            console.log("VR", verifyPayment);
            console.log("order_id", order_id);
            if (verifyPayment) {
                const findOrder = yield this.orderRepo.findOne(order_id);
                const receipt = "re";
                console.log("O", findOrder);
                if (findOrder && !findOrder.status) {
                    const utilHelper = new utilHelper_1.default();
                    let randomNumber = utilHelper.generateAnOTP(4);
                    let randomText = utilHelper.createRandomText(4);
                    let donationId = randomText + randomNumber;
                    let findDonation = yield this.donationHistoryRepo.findOneDonation(donationId);
                    while (findDonation) {
                        randomNumber++;
                        donationId = randomText + randomNumber;
                        findDonation = yield this.donationHistoryRepo.findOneDonation(donationId);
                    }
                    const donationHistory = {
                        amount: (_b = (_a = verifyPayment === null || verifyPayment === void 0 ? void 0 : verifyPayment.data) === null || _a === void 0 ? void 0 : _a.order) === null || _b === void 0 ? void 0 : _b.order_amount,
                        date: new Date(),
                        donation_id: donationId,
                        fund_id: findOrder === null || findOrder === void 0 ? void 0 : findOrder.fund_id,
                        hide_profile: findOrder.hide_profile,
                        profile_id: findOrder.profile_id,
                        receipt,
                    };
                    yield this.orderRepo.updateStatus(order_id, true);
                    yield this.webHookRepo.updateWebhookStatus(order_id, true);
                    yield this.donationHistoryRepo.insertDonationHistory(donationHistory);
                    return {
                        status: true,
                        msg: "Payment success",
                        statusCode: UtilEnum_1.StatusCode.OK,
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
