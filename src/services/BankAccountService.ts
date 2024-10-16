import BankAccountRepo from "../repositorys/BankAccountRepo";
import FundRaiserRepo from "../repositorys/FundRaiserRepo";
import { BankAccountType } from "../types/Enums/DbEnum";
import { StatusCode } from "../types/Enums/UtilEnum";
import { IBankAccount, IEditableFundRaiser } from "../types/Interface/IDBmodel";
import { HelperFuncationResponse } from "../types/Interface/Util";
import UtilHelper from "../util/helper/utilHelper";
import FundRaiserService from "./FundRaiserService";

interface IBankAccountService {
    addBankAccount(account_number: number, ifsc_code: string, holder_name: string, accountType: BankAccountType, fundId: string): Promise<HelperFuncationResponse>
    deleteAccount(benfId: string, fund_id: string): Promise<HelperFuncationResponse>
    updateAccount(banfId: string, data: Partial<IBankAccount>): Promise<HelperFuncationResponse>
    getAllBankAccount(fundId: string, page: number, limit: number, isActive: boolean): Promise<HelperFuncationResponse>
    getActiveBankAccount(fundId: string, page: number, limit: number): Promise<HelperFuncationResponse>
    activeBankAccount(fundId: string, benfId: string): Promise<HelperFuncationResponse>
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
        this.activeBankAccount = this.activeBankAccount.bind(this);
        this.bankRepo = new BankAccountRepo()
        this.fundRepo = new FundRaiserRepo()
    }

    async activeBankAccount(fundId: string, benfId: string): Promise<HelperFuncationResponse> {

        const findFund = await this.fundRepo.findFundPostByFundId(fundId);
        if (findFund) {
            const currentBenf = findFund.withdraw_docs?.benf_id;
            if (currentBenf == benfId) {
                return {
                    msg: "This account is already prime account",
                    status: false,
                    statusCode: StatusCode.BAD_REQUESR
                }
            } else {
                const findBenf = await this.bankRepo.findOne(benfId);
                if (findBenf) {
                    if (findBenf.fund_id == fundId) {
                        const editData: IEditableFundRaiser = {
                            withdraw_docs: {
                                benf_id: benfId
                            }
                        }

                        const update = await this.fundRepo.updateFundRaiser(fundId, editData);
                        if (update) {
                            return {
                                status: true,
                                msg: "Account updated",
                                statusCode: StatusCode.OK
                            }
                        }
                    }
                }
                return {
                    status: false,
                    msg: "Invalid bank account",
                    statusCode: StatusCode.NOT_FOUND
                }
            }
        } else {
            return {
                status: false,
                msg: "Campign not found",
                statusCode: StatusCode.NOT_FOUND
            }
        }
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


    async getAllBankAccount(fundId: string, page: number, limit: number, isActive: boolean): Promise<HelperFuncationResponse> {

        const skip: number = (page - 1) * limit;
        const findAllAccount = !isActive ? await this.bankRepo.findPaginatedAccountsByProfile(fundId, skip, limit) : await this.bankRepo.findActivePaginatedAccountsByProfile(fundId, skip, limit);
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
            const utilHelper = new UtilHelper();

            const benfId = utilHelper.convertFundIdToBeneficiaryId(fundId, ifsc_code);
            const addBeneficiary = await fundService.addBeneficiary(benfId, fundId, holder_name, findProfile.email_id, findProfile.phone_number.toString(), account_number.toString(), ifsc_code, findProfile.full_address);
            console.log("Add benificiary details");
            console.log(addBeneficiary);


            if (addBeneficiary.status) {

                const data: IBankAccount = {
                    is_active: true,
                    is_closed: false,
                    account_number,
                    account_type: accountType,
                    fund_id: fundId,
                    befId: benfId,
                    holder_name,
                    ifsc_code
                }

                console.log("The profile is");
                console.log(findProfile);


                if (!findProfile.withdraw_docs?.benf_id) {
                    console.log("First time bank");
                    // findProfile.withdraw_docs.benf_id = benfId;
                    await this.fundRepo.updateFundRaiser(fundId, {
                        withdraw_docs: {
                            benf_id: benfId
                        }
                    })
                    // const updateFund = await this.fundRepo.updateFundRaiserByModel(findProfile)
                    // console.log(updateFund);
                }

                const add = await this.bankRepo.insertOne(data);

                console.log("Adding cause error");
                console.log(add);

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