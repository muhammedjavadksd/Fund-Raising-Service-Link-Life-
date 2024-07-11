"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundRaiserStatus = exports.FundRaiserCreatedBy = void 0;
var FundRaiserCreatedBy;
(function (FundRaiserCreatedBy) {
    FundRaiserCreatedBy[FundRaiserCreatedBy["ADMIN"] = 0] = "ADMIN";
    FundRaiserCreatedBy[FundRaiserCreatedBy["ORGANIZATION"] = 1] = "ORGANIZATION";
    FundRaiserCreatedBy[FundRaiserCreatedBy["USER"] = 2] = "USER";
})(FundRaiserCreatedBy || (exports.FundRaiserCreatedBy = FundRaiserCreatedBy = {}));
var FundRaiserStatus;
(function (FundRaiserStatus) {
    FundRaiserStatus[FundRaiserStatus["INITIATED"] = 0] = "INITIATED";
    FundRaiserStatus[FundRaiserStatus["APPROVED"] = 1] = "APPROVED";
    FundRaiserStatus[FundRaiserStatus["HOLD"] = 2] = "HOLD";
    FundRaiserStatus[FundRaiserStatus["REJECTED"] = 3] = "REJECTED";
    FundRaiserStatus[FundRaiserStatus["CLOSED"] = 4] = "CLOSED";
})(FundRaiserStatus || (exports.FundRaiserStatus = FundRaiserStatus = {}));
