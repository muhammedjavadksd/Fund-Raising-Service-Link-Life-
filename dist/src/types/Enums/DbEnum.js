"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankAccountType = exports.FundRaiserStatus = exports.FundRaiserCreatedBy = void 0;
var FundRaiserCreatedBy;
(function (FundRaiserCreatedBy) {
    FundRaiserCreatedBy["ADMIN"] = "ADMIN";
    FundRaiserCreatedBy["USER"] = "USER";
})(FundRaiserCreatedBy || (exports.FundRaiserCreatedBy = FundRaiserCreatedBy = {}));
var FundRaiserStatus;
(function (FundRaiserStatus) {
    FundRaiserStatus["CREATED"] = "CREATED";
    FundRaiserStatus["INITIATED"] = "INITIATED";
    FundRaiserStatus["APPROVED"] = "APPROVED";
    FundRaiserStatus["HOLD"] = "HOLD";
    FundRaiserStatus["REJECTED"] = "REJECTED";
    FundRaiserStatus["CLOSED"] = "CLOSED";
})(FundRaiserStatus || (exports.FundRaiserStatus = FundRaiserStatus = {}));
var BankAccountType;
(function (BankAccountType) {
    BankAccountType["Saving"] = "saving";
    BankAccountType["Current"] = "current";
})(BankAccountType || (exports.BankAccountType = BankAccountType = {}));
