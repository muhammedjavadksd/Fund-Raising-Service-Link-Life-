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
const FundRaiserRepo_1 = __importDefault(require("../repositorys/FundRaiserRepo"));
const UtilEnum_1 = require("../types/Enums/UtilEnum");
const utilHelper_1 = __importDefault(require("../util/helper/utilHelper"));
const FundRaiserService_1 = __importDefault(require("./FundRaiserService"));
class BankAccountService {
    constructor() {
        this.addBankAccount = this.addBankAccount.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
        this.updateAccount = this.updateAccount.bind(this);
        this.getAllBankAccount = this.getAllBankAccount.bind(this);
        this.getActiveBankAccount = this.getActiveBankAccount.bind(this);
        this.activeBankAccount = this.activeBankAccount.bind(this);
        this.bankRepo = new BankAccountRepo_1.default();
        this.fundRepo = new FundRaiserRepo_1.default();
    }
    activeBankAccount(fundId, benfId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const findFund = yield this.fundRepo.findFundPostByFundId(fundId);
            if (findFund) {
                const currentBenf = (_a = findFund.withdraw_docs) === null || _a === void 0 ? void 0 : _a.benf_id;
                if (currentBenf == benfId) {
                    return {
                        msg: "This account is already prime account",
                        status: false,
                        statusCode: UtilEnum_1.StatusCode.BAD_REQUESR
                    };
                }
                else {
                    const findBenf = yield this.bankRepo.findOne(benfId);
                    if (findBenf) {
                        if (findBenf.fund_id == fundId) {
                            const editData = {
                                withdraw_docs: {
                                    benf_id: benfId
                                }
                            };
                            const update = yield this.fundRepo.updateFundRaiser(fundId, editData);
                            if (update) {
                                return {
                                    status: true,
                                    msg: "Account updated",
                                    statusCode: UtilEnum_1.StatusCode.OK
                                };
                            }
                        }
                    }
                    return {
                        status: false,
                        msg: "Invalid bank account",
                        statusCode: UtilEnum_1.StatusCode.NOT_FOUND
                    };
                }
            }
            else {
                return {
                    status: false,
                    msg: "Campign not found",
                    statusCode: UtilEnum_1.StatusCode.NOT_FOUND
                };
            }
        });
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
    getAllBankAccount(fundId, page, limit, isActive) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const findAllAccount = !isActive ? yield this.bankRepo.findPaginatedAccountsByProfile(fundId, skip, limit) : yield this.bankRepo.findActivePaginatedAccountsByProfile(fundId, skip, limit);
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
            var _a;
            const findExist = yield this.bankRepo.findLiveAccountByNumber(account_number);
            if (findExist) {
                return {
                    msg: "This bank account already using by other fund raiser profile",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.BAD_REQUESR
                };
            }
            const findProfile = yield this.fundRepo.findFundPostByFundId(fundId);
            const fundService = new FundRaiserService_1.default();
            if (findProfile) {
                const addBeneficiary = yield fundService.addBeneficiary(fundId, findProfile.full_name, findProfile.email_id, findProfile.phone_number.toString(), account_number.toString(), ifsc_code, findProfile.full_address);
                console.log("Add benificiary details");
                console.log(addBeneficiary);
                if (addBeneficiary.status) {
                    const utilHelper = new utilHelper_1.default();
                    const benfId = utilHelper.convertFundIdToBeneficiaryId(fundId, ifsc_code);
                    const data = {
                        is_active: true,
                        is_closed: false,
                        account_number,
                        account_type: accountType,
                        fund_id: fundId,
                        befId: benfId,
                        holder_name,
                        ifsc_code
                    };
                    console.log("The profile is");
                    console.log(findProfile);
                    if (!((_a = findProfile.withdraw_docs) === null || _a === void 0 ? void 0 : _a.benf_id)) {
                        console.log("First time bank");
                        findProfile.withdraw_docs.benf_id = benfId;
                        const updateFund = yield this.fundRepo.updateFundRaiserByModel(findProfile);
                        console.log(updateFund);
                    }
                    const add = yield this.bankRepo.insertOne(data);
                    console.log("Adding cause error");
                    console.log(add);
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
                }
                else {
                    return {
                        msg: addBeneficiary.msg,
                        status: false,
                        statusCode: UtilEnum_1.StatusCode.BAD_REQUESR
                    };
                }
            }
            else {
                return {
                    status: false,
                    msg: "We couldn't find the profile",
                    statusCode: UtilEnum_1.StatusCode.BAD_REQUESR
                };
            }
        });
    }
    deleteAccount(benfId, fund_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findFund = yield this.fundRepo.findFundPostByFundId(fund_id);
            if (findFund) {
                if (findFund.withdraw_docs.benf_id == benfId) {
                    return {
                        status: false,
                        msg: "This account can't delete since its active one",
                        statusCode: UtilEnum_1.StatusCode.BAD_REQUESR
                    };
                }
                else {
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
                }
            }
            else {
                return {
                    msg: "Profile not found",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.NOT_FOUND
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
