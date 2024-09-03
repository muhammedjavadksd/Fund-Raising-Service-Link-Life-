"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundRaiserStatus = exports.FundRaiserCreatedBy = void 0;
var FundRaiserCreatedBy;
(function (FundRaiserCreatedBy) {
    FundRaiserCreatedBy["ADMIN"] = "ADMIN";
    FundRaiserCreatedBy["ORGANIZATION"] = "ORGANIZATION";
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
