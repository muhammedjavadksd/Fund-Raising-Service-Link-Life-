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
const paymentWebHook_1 = __importDefault(require("../db/model/paymentWebHook"));
class PaymentWebHookRepo {
    findOnePaymentRepo(order_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const find = yield paymentWebHook_1.default.findOne({ "data.order.order_id": order_id });
            return find;
        });
    }
    findUnCheckedWebHook() {
        return __awaiter(this, void 0, void 0, function* () {
            const find = yield paymentWebHook_1.default.find({ is_checked: false });
            return find;
        });
    }
    insertPaymentRepo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new paymentWebHook_1.default(data);
            const save = yield instance.save();
            return save === null || save === void 0 ? void 0 : save._id;
        });
    }
    updateWebhookStatus(order_id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const find = yield paymentWebHook_1.default.findOneAndUpdate({ "data.order.order_id": order_id, is_checked: status });
            return !!(find === null || find === void 0 ? void 0 : find.isModified());
        });
    }
}
exports.default = PaymentWebHookRepo;
