import BankAccountRepo from "../repositorys/BankAccountRepo";
import FundRaiserRepo from "../repositorys/FundRaiserRepo";
import { BankAccountType } from "../types/Enums/DbEnum";
import { StatusCode } from "../types/Enums/UtilEnum";
import { IBankAccount } from "../types/Interface/IDBmodel";
import { HelperFuncationResponse } from "../types/Interface/Util";
import UtilHelper from "../util/helper/utilHelper";
import FundRaiserService from "./FundRaiserService";


interface IBankAccountService {
    addBankAccount(account_number: number, ifsc_code: string, holder_name: string, accountType: BankAccountType, fundId: string): Promise<HelperFuncationResponse>
    deleteAccount(benfId: string, fund_id: string): Promise<HelperFuncationResponse>
    updateAccount(banfId: string, data: Partial<IBankAccount>): Promise<HelperFuncationResponse>
    getAllBankAccount(fundId: string, page: number, limit: number): Promise<HelperFuncationResponse>
    getActiveBankAccount(fundId: string, page: number, limit: number): Promise<HelperFuncationResponse>
}


class BankAccountService implements IBankAccountService {

    bankRepo;
    fundRepo;

    constructor() {
        this.addBankAccount = this.addBankAccount.bind(this)
        this.deleteAccount = this.deleteAccount.bind(this);
        this.updateAccount = this.updateAccount.bind(this)
        this.getAllBankAccount = this.getAllBankAccount.bind(this)
        this.getActiveBankAccount = this.getActiveBankAccount.bind(this);
        this.bankRepo = new BankAccountRepo()
        this.fundRepo = new FundRaiserRepo()
    }

    async getActiveBankAccount(fundId: string, page: number, limit: number): Promise<HelperFuncationResponse> {
        const skip: number = (page - 1) * limit;
        const findAllAccount = await this.bankRepo.findActivePaginatedAccountsByProfile(fundId, skip, limit);
        if (findAllAccount.paginated.length) {
            return {
                msg: "Bank account's fetch",
                status: true,
                statusCode: StatusCode.OK,
                data: findAllAccount
            }
        } else {
            return {
                msg: "No data found",
                status: false,
                statusCode: StatusCode.NOT_FOUND
            }
        }
    }


    async getAllBankAccount(fundId: string, page: number, limit: number): Promise<HelperFuncationResponse> {

        const skip: number = (page - 1) * limit;
        const findAllAccount = await this.bankRepo.findPaginatedAccountsByProfile(fundId, skip, limit);
        console.log("Finding all bank account");

        console.log(findAllAccount);

        if (findAllAccount.paginated.length) {
            return {
                msg: "Bank account's fetch",
                status: true,
                statusCode: StatusCode.OK,
                data: findAllAccount
            }
        } else {
            return {
                msg: "No data found",
                status: false,
                statusCode: StatusCode.NOT_FOUND
            }
        }
    }

    async addBankAccount(account_number: number, ifsc_code: string, holder_name: string, accountType: BankAccountType, fundId: string): Promise<HelperFuncationResponse> {

        const findExist = await this.bankRepo.findLiveAccountByNumber(account_number);
        if (findExist) {
            return {
                msg: "This bank account already using by other fund raiser profile",
                status: false,
                statusCode: StatusCode.BAD_REQUESR
            }
        }

        const findProfile = await this.fundRepo.findFundPostByFundId(fundId);
        const fundService = new FundRaiserService();
        if (findProfile) {
            const addBeneficiary = await fundService.addBeneficiary(fundId, findProfile.full_name, findProfile.email_id, findProfile.phone_number.toString(), account_number.toString(), ifsc_code, findProfile.full_address);
            if (addBeneficiary.status) {
                const utilHelper = new UtilHelper();
                const benfId = utilHelper.convertFundIdToBeneficiaryId(fundId);

                const data: IBankAccount = {
                    is_active: false,
                    is_closed: false,
                    account_number,
                    account_type: accountType,
                    fund_id: fundId,
                    befId: benfId,
                    holder_name,
                    ifsc_code
                }

                const add = await this.bankRepo.insertOne(data);
                if (add) {
                    return {
                        msg: "Bank account created success",
                        status: true,
                        statusCode: StatusCode.CREATED,
                        data: {
                            bank_id: benfId
                        }
                    }
                } else {
                    return {
                        msg: "Bank account creation failed",
                        status: false,
                        statusCode: StatusCode.SERVER_ERROR
                    }
                }
            } else {
                return {
                    msg: addBeneficiary.msg,
                    status: false,
                    statusCode: StatusCode.BAD_REQUESR
                }
            }

        } else {
            return {
                status: false,
                msg: "We couldn't find the profile",
                statusCode: StatusCode.BAD_REQUESR
            }
        }
    }

    async deleteAccount(benfId: string, fund_id: string): Promise<HelperFuncationResponse> {
        const findFund = await this.fundRepo.findFundPostByFundId(fund_id);
        if (findFund) {
            if (findFund.withdraw_docs.benf_id == benfId) {
                return {
                    status: false,
                    msg: "This account can't delete since its active one",
                    statusCode: StatusCode.BAD_REQUESR
                }
            } else {
                const deletAccount = await this.bankRepo.deleteOne(benfId);
                if (deletAccount) {
                    return {
                        msg: "Bank account deleted",
                        status: true,
                        statusCode: StatusCode.OK
                    }
                } else {
                    return {
                        msg: "Bank account delete failed",
                        status: false,
                        statusCode: StatusCode.BAD_REQUESR
                    }
                }
            }
        } else {
            return {
                msg: "Profile not found",
                status: false,
                statusCode: StatusCode.NOT_FOUND
            }
        }
    }

    async updateAccount(banfId: string, data: Partial<IBankAccount>): Promise<HelperFuncationResponse> {

        const update = await this.bankRepo.updateOne(banfId, data);
        if (update) {
            return {
                status: true,
                msg: "Updated success",
                statusCode: StatusCode.OK
            }
        } else {
            return {
                status: false,
                msg: "Updated failed",
                statusCode: StatusCode.BAD_REQUESR
            }
        }
    }
}

export default BankAccountService;