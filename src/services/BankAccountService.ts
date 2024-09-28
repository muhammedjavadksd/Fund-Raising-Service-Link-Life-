import BankAccountRepo from "../repositorys/BankAccountRepo";
import { BankAccountType } from "../types/Enums/DbEnum";
import { StatusCode } from "../types/Enums/UtilEnum";
import { IBankAccount } from "../types/Interface/IDBmodel";
import { HelperFuncationResponse } from "../types/Interface/Util";
import UtilHelper from "../util/helper/utilHelper";


interface IBankAccountService {
    addBankAccount(account_number: number, ifsc_code: string, holder_name: string, accountType: BankAccountType, fundId: string): Promise<HelperFuncationResponse>
    deleteAccount(benfId: string): Promise<HelperFuncationResponse>
    updateAccount(banfId: string, data: Partial<IBankAccount>): Promise<HelperFuncationResponse>
    getAllBankAccount(fundId: string, page: number, limit: number): Promise<HelperFuncationResponse>
}


class BankAccountService implements IBankAccountService {

    bankRepo;

    constructor() {
        this.addBankAccount = this.addBankAccount.bind(this)
        this.deleteAccount = this.deleteAccount.bind(this);
        this.updateAccount = this.updateAccount.bind(this)
        this.bankRepo = new BankAccountRepo()
    }


    async getAllBankAccount(fundId: string, page: number, limit: number): Promise<HelperFuncationResponse> {

        const skip: number = (page - 1) * limit;
        const findAllAccount = await this.bankRepo.findPaginatedAccountsByProfile(fundId, skip, limit);
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

        const findExist = await this.bankRepo.findByAccountNumber(account_number);
        if (findExist) {
            return {
                msg: "This bank account already using by other fund raiser profile",
                status: false,
                statusCode: StatusCode.BAD_REQUESR
            }
        }

        const utilHelper = new UtilHelper();

        let randomNumber: number = utilHelper.generateAnOTP(4)
        let randomText: string = utilHelper.createRandomText(4)
        let benfId = "BB" + randomNumber + randomText;
        let findAccount = await this.bankRepo.findOne(benfId);
        while (findAccount) {
            randomNumber++
            benfId = "BB" + randomNumber + randomText;
            findAccount = await this.bankRepo.findOne(benfId);
        }

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
                statusCode: StatusCode.CREATED
            }
        } else {
            return {
                msg: "Bank account creation failed",
                status: false,
                statusCode: StatusCode.SERVER_ERROR
            }
        }
    }

    async deleteAccount(benfId: string): Promise<HelperFuncationResponse> {

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