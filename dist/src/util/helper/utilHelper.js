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
const DbEnum_1 = require("../../types/Enums/DbEnum");
const url_1 = __importDefault(require("url"));
const axios_1 = __importDefault(require("axios"));
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
    convertFundIdToBeneficiaryId(fund_id, ifsc) {
        const randomText = this.createRandomText(3);
        const randomNumber = this.generateAnOTP(3);
        return fund_id.replaceAll("-", "_").concat(ifsc).concat(randomText).concat(randomNumber.toString());
    }
    bufferFromImage(image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const imageRequest = yield axios_1.default.get(image, { responseType: "arraybuffer" });
                return imageRequest.data;
            }
            catch (e) {
                return null;
            }
        });
    }
}
exports.default = UtilHelper;
