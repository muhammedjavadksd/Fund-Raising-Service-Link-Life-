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
        this.addBankAccount = this.addBankAccount.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
        this.updateAccount = this.updateAccount.bind(this);
        this.getAllBankAccount = this.getAllBankAccount.bind(this);
        this.getActiveBankAccount = this.getActiveBankAccount.bind(this);
        this.bankRepo = new BankAccountRepo_1.default();
    }
    getActiveBankAccount(fundId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const findAllAccount = yield this.bankRepo.findActivePaginatedAccountsByProfile(fundId, skip, limit);
            if (findAllAccount.paginated.length) {
                return {
                    msg: "Bank account's fetch",
                    status: true,
                    statusCode: UtilEnum_1.StatusCode.OK,
                    data: findAllAccount
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
    getAllBankAccount(fundId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const findAllAccount = yield this.bankRepo.findPaginatedAccountsByProfile(fundId, skip, limit);
            console.log("Finding all bank account");
            console.log(findAllAccount);
            if (findAllAccount.paginated.length) {
                return {
                    msg: "Bank account's fetch",
                    status: true,
                    statusCode: UtilEnum_1.StatusCode.OK,
                    data: findAllAccount
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
    addBankAccount(account_number, ifsc_code, holder_name, accountType, fundId) {
        return __awaiter(this, void 0, void 0, function* () {
            const findExist = yield this.bankRepo.findLiveAccountByNumber(account_number);
            if (findExist) {
                return {
                    msg: "This bank account already using by other fund raiser profile",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.BAD_REQUESR
                };
            }
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
                is_active: false,
                is_closed: false,
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
                    statusCode: UtilEnum_1.StatusCode.CREATED,
                    data: {
                        bank_id: benfId
                    }
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
        return __awaiter(this, void 0, void 0, function* () {
            const deletAccount = yield this.bankRepo.deleteOne(benfId);
            if (deletAccount) {
                return {
                    msg: "Bank account deleted",
                    status: true,
                    statusCode: UtilEnum_1.StatusCode.OK
                };
            }
            else {
                return {
                    msg: "Bank account delete failed",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.BAD_REQUESR
                };
            }
        });
    }
    updateAccount(banfId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const update = yield this.bankRepo.updateOne(banfId, data);
            if (update) {
                return {
                    status: true,
                    msg: "Updated success",
                    statusCode: UtilEnum_1.StatusCode.OK
                };
            }
            else {
                return {
                    status: false,
                    msg: "Updated failed",
                    statusCode: UtilEnum_1.StatusCode.BAD_REQUESR
                };
            }
        });
    }
}
exports.default = BankAccountService;
