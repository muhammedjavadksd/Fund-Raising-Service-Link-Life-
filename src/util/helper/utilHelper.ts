import { FundRaiserCreatedBy } from "../../types/Enums/DbEnum";
import { IFundRaise } from "../../types/Interface/IDBmodel";
import { IUtilHelper } from "../../types/Interface/IHelper";
import url from 'url'


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

    extractImageNameFromPresignedUrl(presigned_url: string): string | false {
        try {
            const newUrl = url.parse(presigned_url, true)
            console.log("Presigned url");
            console.log(presigned_url);

            if (newUrl.pathname) {
                const pathName = newUrl.pathname.split("/")
                const path = `${pathName[1]}/${pathName[2]}`
                return path
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    }

    generateFundRaiserTitle(profile: IFundRaise): string {
        return `${profile.full_name}'s Fund Raiser for ${profile.category} in ${profile.district}`
    }

    formatDateToMonthNameAndDate(date: Date): string {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const d = new Date(date);
        const monthName = months[d.getMonth()];
        const day = d.getDate();
        const year = d.getFullYear();
        return `${monthName} ${day} ${year} `;
    }


    convertFundIdToBeneficiaryId(fund_id: string) {
        return fund_id.replaceAll("-", "_")
    }
}


export default UtilHelper
