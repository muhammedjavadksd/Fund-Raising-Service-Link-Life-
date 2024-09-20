"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DbEnum_1 = require("../../types/Enums/DbEnum");
const url_1 = __importDefault(require("url"));
class UtilHelper {
    constractor() {
        this.createFundRaiseID = this.createFundRaiseID.bind(this);
        this.createRandomText = this.createRandomText.bind(this);
        this.generateAnOTP = this.generateAnOTP.bind(this);
    }
    createFundRaiseID(created_by) {
        const createdBY = created_by == DbEnum_1.FundRaiserCreatedBy.USER ? "U" : (created_by == DbEnum_1.FundRaiserCreatedBy.ADMIN ? "A" : "O");
        const fundId = this.createRandomText(5) + "-" + createdBY + "-" + new Date().getUTCMilliseconds();
        return fundId;
    }
    generateAnOTP(length) {
        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomNumber;
    }
    createRandomText(length) {
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    extractImageNameFromPresignedUrl(presigned_url) {
        try {
            const newUrl = url_1.default.parse(presigned_url, true);
            console.log("Presigned url");
            console.log(presigned_url);
            if (newUrl.pathname) {
                const pathName = newUrl.pathname.split("/");
                const path = `${pathName[1]}/${pathName[2]}`;
                return path;
            }
            else {
                return false;
            }
        }
        catch (e) {
            return false;
        }
    }
    generateFundRaiserTitle(profile) {
        return `${profile.full_name}'s Fund Raiser for ${profile.category} in ${profile.district}`;
    }
    formatDateToMonthNameAndDate(date) {
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
    convertFundIdToBeneficiaryId(fund_id) {
        return fund_id.replaceAll("-", "_");
    }
}
exports.default = UtilHelper;
