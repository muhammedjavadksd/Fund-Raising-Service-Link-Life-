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
const BankAccountRepo_1 = __importDefault(require("../repositorys/BankAccountRepo"));
const UtilEnum_1 = require("../types/Enums/UtilEnum");
const utilHelper_1 = __importDefault(require("../util/helper/utilHelper"));
class BankAccountService {
    constructor() {
        this.bankRepo = new BankAccountRepo_1.default();
    }
    addBankAccount(account_number, ifsc_code, holder_name, accountType, fundId) {
        return __awaiter(this, void 0, void 0, function* () {
            const utilHelper = new utilHelper_1.default();
            let randomNumber = utilHelper.generateAnOTP(4);
            let randomText = utilHelper.createRandomText(4);
            let benfId = "BB" + randomNumber + randomText;
            let findAccount = yield this.bankRepo.findOne(benfId);
            while (findAccount) {
                randomNumber++;
                benfId = "BB" + randomNumber + randomText;
                findAccount = yield this.bankRepo.findOne(benfId);
            }
            const data = {
                account_number,
                account_type: accountType,
                fund_id: fundId,
                befId: benfId,
                holder_name,
                ifsc_code
            };
            const add = yield this.bankRepo.insertOne(data);
            if (add) {
                return {
                    msg: "Bank account created success",
                    status: true,
                    statusCode: UtilEnum_1.StatusCode.CREATED
                };
            }
            else {
                return {
                    msg: "Bank account creation failed",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.SERVER_ERROR
                };
            }
        });
    }
    deleteAccount(benfId) {
        throw new Error("Method not implemented.");
    }
    updateAccount(banfId, data) {
        throw new Error("Method not implemented.");
    }
}
