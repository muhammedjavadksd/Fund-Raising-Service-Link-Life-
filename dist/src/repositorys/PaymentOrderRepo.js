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
const PaymentOrder_1 = __importDefault(require("../db/model/PaymentOrder"));
class PaymentOrderRepo {
    insertOne(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new PaymentOrder_1.default(data);
            const save = yield instance.save();
            return save === null || save === void 0 ? void 0 : save.id;
        });
    }
    findOne(order_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const find = yield PaymentOrder_1.default.findOne({ order_id });
            return find;
        });
    }
    updateStatus(order_id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateStatus = yield PaymentOrder_1.default.updateOne({ order_id }, { $set: { status } });
            return updateStatus.modifiedCount > 0;
        });
    }
}
exports.default = PaymentOrderRepo;
