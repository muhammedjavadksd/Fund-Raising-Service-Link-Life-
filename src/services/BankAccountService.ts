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
}


class BankAccountService implements IBankAccountService {

    bankRepo;

    constructor() {
        this.bankRepo = new BankAccountRepo()
    }

    async addBankAccount(account_number: number, ifsc_code: string, holder_name: string, accountType: BankAccountType, fundId: string): Promise<HelperFuncationResponse> {

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

    deleteAccount(benfId: string): Promise<HelperFuncationResponse> {
        throw new Error("Method not implemented.");
    }

    updateAccount(banfId: string, data: Partial<IBankAccount>): Promise<HelperFuncationResponse> {
        throw new Error("Method not implemented.");
    }
}