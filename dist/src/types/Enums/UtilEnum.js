"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentVia = exports.StatusCode = exports.FundRaiserCategory = exports.FundRaiserFileType = exports.JwtType = exports.FundRaiserBankAccountType = exports.JwtTimer = exports.PresignedType = void 0;
var FundRaiserFileType;
(function (FundRaiserFileType) {
    FundRaiserFileType["Document"] = "Document";
    FundRaiserFileType["Pictures"] = "Pictures";
})(FundRaiserFileType || (exports.FundRaiserFileType = FundRaiserFileType = {}));
var PaymentVia;
(function (PaymentVia) {
    PaymentVia["UPI"] = "UPI";
    PaymentVia["PAYTM"] = "QR";
    PaymentVia["Manual"] = "MANUAL";
})(PaymentVia || (exports.PaymentVia = PaymentVia = {}));
var PresignedType;
(function (PresignedType) {
    PresignedType["Document"] = "Document";
    PresignedType["Pictures"] = "Pictures";
})(PresignedType || (exports.PresignedType = PresignedType = {}));
var JwtTimer;
(function (JwtTimer) {
    JwtTimer["_15Min"] = "15m";
    JwtTimer["_7Days"] = "7d";
    JwtTimer["_1Hour"] = "1h";
    JwtTimer["_1Day"] = "24h";
})(JwtTimer || (exports.JwtTimer = JwtTimer = {}));
var JwtType;
(function (JwtType) {
    JwtType["CloseFundRaise"] = "close-fund-raiser";
})(JwtType || (exports.JwtType = JwtType = {}));
var FundRaiserBankAccountType;
(function (FundRaiserBankAccountType) {
    FundRaiserBankAccountType["Savings"] = "saving";
    FundRaiserBankAccountType["Current"] = "current";
})(FundRaiserBankAccountType || (exports.FundRaiserBankAccountType = FundRaiserBankAccountType = {}));
var FundRaiserCategory;
(function (FundRaiserCategory) {
    FundRaiserCategory["Education"] = "Education";
    FundRaiserCategory["MedicalAndHealth"] = "Medical and Health";
    FundRaiserCategory["DisasterRelief"] = "Disaster Relief";
    FundRaiserCategory["NonprofitOrganizations"] = "Nonprofit Organizations";
    FundRaiserCategory["CommunityProjects"] = "Community Projects";
    FundRaiserCategory["SportsAndRecreation"] = "Sports and Recreation";
    FundRaiserCategory["ArtsAndCulture"] = "Arts and Culture";
    FundRaiserCategory["AnimalWelfare"] = "Animal Welfare";
    FundRaiserCategory["EnvironmentalCauses"] = "Environmental Causes";
    FundRaiserCategory["ReligiousInitiatives"] = "Religious Initiatives";
    FundRaiserCategory["SocialJustice"] = "Social Justice";
    FundRaiserCategory["ScienceAndResearch"] = "Science and Research";
    FundRaiserCategory["EntrepreneurshipAndInnovation"] = "Entrepreneurship and Innovation";
    FundRaiserCategory["MemorialsAndFunerals"] = "Memorials and Funerals";
    FundRaiserCategory["PersonalEmergencies"] = "Personal Emergencies";
    FundRaiserCategory["TravelAndAdventure"] = "Travel and Adventure";
    FundRaiserCategory["EventsAndCelebrations"] = "Events and Celebrations";
    FundRaiserCategory["YouthPrograms"] = "Youth Programs";
    FundRaiserCategory["VeteransAndMilitary"] = "Veterans and Military";
    FundRaiserCategory["HungerAndPoverty"] = "Hunger and Poverty";
    FundRaiserCategory["HousingAndHomelessness"] = "Housing and Homelessness";
    FundRaiserCategory["HumanRights"] = "Human Rights";
    FundRaiserCategory["EducationScholarships"] = "Education Scholarships";
    FundRaiserCategory["SeniorCitizens"] = "Senior Citizens";
    FundRaiserCategory["CrisisSupport"] = "Crisis Support";
    FundRaiserCategory["MentalHealth"] = "Mental Health";
    FundRaiserCategory["TechnologyAndGadgets"] = "Technology and Gadgets";
    FundRaiserCategory["CreativeProjects"] = "Creative Projects";
    FundRaiserCategory["LegalDefense"] = "Legal Defense";
    FundRaiserCategory["InternationalAid"] = "International Aid";
})(FundRaiserCategory || (exports.FundRaiserCategory = FundRaiserCategory = {}));
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["OK"] = 200] = "OK";
    StatusCode[StatusCode["CREATED"] = 201] = "CREATED";
    StatusCode[StatusCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    StatusCode[StatusCode["BAD_REQUESR"] = 400] = "BAD_REQUESR";
    StatusCode[StatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    StatusCode[StatusCode["SERVER_ERROR"] = 500] = "SERVER_ERROR";
    StatusCode[StatusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    StatusCode[StatusCode["CONFLICT"] = 409] = "CONFLICT";
})(StatusCode || (exports.StatusCode = StatusCode = {}));
