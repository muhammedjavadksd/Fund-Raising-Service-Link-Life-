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
const BankAccount_1 = __importDefault(require("../db/model/BankAccount"));
class BankAccountRepo {
    findOne(benfId) {
        return __awaiter(this, void 0, void 0, function* () {
            const findone = yield BankAccount_1.default.findOne({ befId: benfId });
            return findone;
        });
    }
    findAccountByProfile(fund_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findProfile = yield BankAccount_1.default.find({ fund_id });
            return findProfile;
        });
    }
    deleteOne(benId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteOne = yield BankAccount_1.default.deleteOne({ befId: benId });
            return deleteOne.deletedCount > 0;
        });
    }
    updateOne(benfId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const update = yield BankAccount_1.default.updateOne({ befId: benfId }, { $set: Object.assign({}, data) });
            return update.modifiedCount > 0;
        });
    }
    insertOne(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new BankAccount_1.default(data);
            const save = yield instance.save();
            return !!save.id;
        });
    }
}
exports.default = BankAccountRepo;
