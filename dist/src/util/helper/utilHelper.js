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
        const newUrl = url_1.default.parse(presigned_url, true);
        const urlPath = newUrl.pathname;
        const splitPath = urlPath === null || urlPath === void 0 ? void 0 : urlPath.split("/");
        if (splitPath && (splitPath === null || splitPath === void 0 ? void 0 : splitPath.length) >= 2) {
            const imageName = splitPath[2];
            return imageName;
        }
        return false;
    }
}
exports.default = UtilHelper;
