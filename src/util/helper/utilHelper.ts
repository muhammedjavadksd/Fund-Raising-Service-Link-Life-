import { FundRaiserCreatedBy } from "../../types/Enums/DbEnum";
import { IUtilHelper } from "../../types/Interface/IHelper";


class UtilHelper implements IUtilHelper {


    constractor() {
        this.createFundRaiseID = this.createFundRaiseID.bind(this)
        this.createRandomText = this.createRandomText.bind(this)
        this.generateAnOTP = this.generateAnOTP.bind(this)
    }

    createFundRaiseID(created_by: FundRaiserCreatedBy): string {
        const createdBY: string = created_by == FundRaiserCreatedBy.USER ? "U" : (created_by == FundRaiserCreatedBy.ADMIN ? "A" : "O");

        const fundId: string = this.createRandomText(5) + "-" + createdBY + "-" + new Date().getUTCMilliseconds()
        return fundId;
    }

    generateAnOTP(length: number): number {
        const min: number = Math.pow(10, length - 1);
        const max: number = Math.pow(10, length) - 1;
        const randomNumber: number = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomNumber;
    }

    createRandomText(length: number): string {
        const characters: string = 'abcdefghijklmnopqrstuvwxyz';

        let result: string = '';
        const charactersLength: number = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

}


export default UtilHelper
