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
exports.AdminController = void 0;
const DbEnum_1 = require("../types/Enums/DbEnum");
const FundRaiserRepo_1 = __importDefault(require("../repositorys/FundRaiserRepo"));
const FundRaiserService_1 = __importDefault(require("../services/FundRaiserService"));
const utilHelper_1 = __importDefault(require("../util/helper/utilHelper"));
const UtilEnum_1 = require("../types/Enums/UtilEnum");
const DonationService_1 = __importDefault(require("../services/DonationService"));
class AdminController {
    constructor() {
        this.getAllFundRaise = this.getAllFundRaise.bind(this);
        this.getSingleProfile = this.getSingleProfile.bind(this);
        this.editFundRaiser = this.editFundRaiser.bind(this);
        this.addFundRaiser = this.addFundRaiser.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
        this.closeFundRaiser = this.closeFundRaiser.bind(this);
        this.getStatitics = this.getStatitics.bind(this);
        this.presignedUrl = this.presignedUrl.bind(this);
        this.uploadImages = this.uploadImages.bind(this);
        this.deleteFundRaiserImage = this.deleteFundRaiserImage.bind(this);
        this.fundRaiserRepo = new FundRaiserRepo_1.default();
        this.fundRaiserService = new FundRaiserService_1.default();
        this.donationService = new DonationService_1.default();
    }
    deleteFundRaiserImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const fundId = req.params.fund_id;
            const type = req.params.type;
            const image = ((_a = req.query.image) === null || _a === void 0 ? void 0 : _a.toString()) || '';
            const deleteImage = yield this.fundRaiserService.deleteFundRaiserImage(fundId, image, type);
            res.status(deleteImage.statusCode).json({ status: deleteImage.status, msg: deleteImage.msg, data: deleteImage.data });
        });
    }
    getStatitics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const findStatitics = yield this.donationService.getStatitics();
            res.status(findStatitics.statusCode).json({ status: findStatitics.status, msg: findStatitics.msg, data: findStatitics.data });
        });
    }
    viewDonationHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile_id = req.params.profile_id;
            const page = +req.params.page;
            const limit = +req.params.limit;
            const donationHistory = yield this.donationService.findPrivateProfileHistoryPaginated(profile_id, limit, page);
            res.status(donationHistory.statusCode).json({ status: donationHistory.status, msg: donationHistory.msg, data: donationHistory.data });
        });
    }
    presignedUrl(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const type = req.query.type;
            const presignedUrl = yield this.fundRaiserService.createPresignedUrl(type);
            res.status(presignedUrl.statusCode).json({ status: presignedUrl.status, msg: presignedUrl.msg, data: presignedUrl.data });
        });
    }
    uploadImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = req.body.image;
            const fund_id = req.params.edit_id;
            const type = req.body.type;
            console.log("The images");
            console.log(image);
            const uploadImage = yield this.fundRaiserService.uploadImage(image, fund_id, type);
            res.status(uploadImage.statusCode).json({ status: uploadImage.status, msg: uploadImage.msg, data: uploadImage.data });
        });
    }
    getAllFundRaise(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Reached here");
            try {
                const limit = Number(req.params.limit);
                const page = Number(req.params.page);
                const status = req.params.status;
                let filter = {};
                if (req.query.sub_category) {
                    filter['sub_category'] = req.query.sub_category;
                }
                if (req.query.category) {
                    filter['category'] = req.query.category;
                }
                if (req.query.urgency && req.query.urgency == "urgent") {
                    const date = new Date();
                    filter['deadline'] = {
                        $lte: new Date(date.setDate(date.getDate() + 10))
                    };
                }
                if (req.query.state) {
                    filter['state'] = req.query.state;
                }
                if (req.query.min || req.query.max) {
                    filter['amount'] = {};
                    if (req.query.min) {
                        filter['amount'].$gte = +req.query.min;
                    }
                    if (req.query.max) {
                        filter['amount'].$lte = +req.query.max;
                    }
                }
                const fundRaisersPost = yield this.fundRaiserRepo.getAllFundRaiserPost(page, limit, status, filter);
                if (fundRaisersPost === null || fundRaisersPost === void 0 ? void 0 : fundRaisersPost.paginated.length) {
                    res.status(UtilEnum_1.StatusCode.OK).json({
                        status: true,
                        data: fundRaisersPost
                    });
                }
                else {
                    res.status(UtilEnum_1.StatusCode.NOT_FOUND).json({ status: false, msg: "No data found" });
                }
            }
            catch (e) {
                res.status(UtilEnum_1.StatusCode.SERVER_ERROR).json({ status: false, msg: "Internal Server Error" });
            }
        });
    }
    getSingleProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile_id = req.params.profile_id;
                const profile = yield this.fundRaiserRepo.findFundPostByFundId(profile_id);
                if (profile) {
                    res.status(UtilEnum_1.StatusCode.OK).json({ status: true, msg: "Profile found", data: profile });
                }
                else {
                    res.status(UtilEnum_1.StatusCode.NOT_FOUND).json({ status: false, msg: "Profile not found" });
                }
            }
            catch (e) {
                res.status(UtilEnum_1.StatusCode.SERVER_ERROR).json({ status: false, msg: "Internal Server Error" });
            }
        });
    }
    editFundRaiser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fund_id = req.params.edit_id;
                const edit_data = req.body.edit_data;
                const editData = {};
                const fieldsToUpdate = [
                    'benf_id',
                    'amount',
                    'category',
                    'sub_category',
                    'about',
                    'age',
                    'benificiary_relation',
                    'full_name',
                    'city',
                    'district',
                    'full_address',
                    'pincode',
                    'state',
                    'deadline',
                    'description',
                    'withdraw_docs'
                ];
                fieldsToUpdate.forEach((field) => {
                    if (req.body[field] !== undefined) {
                        editData[field] = req.body[field];
                    }
                });
                const updateFundRaiser = yield this.fundRaiserService.editFundRaiser(fund_id, edit_data);
                console.log("This worked");
                res.status(updateFundRaiser.statusCode).json({
                    status: updateFundRaiser.status,
                    msg: updateFundRaiser.msg
                });
            }
            catch (e) {
                console.log(e);
                res.status(500).json({
                    status: false,
                    msg: "Something went wrong"
                });
            }
        });
    }
    addFundRaiser(req, res) {
        var _a;
        try {
            const amount = req.body.amount;
            const category = req.body.category;
            const sub_category = req.body.sub_category;
            const phone_number = req.body.phone_number;
            const email_id = req.body.email_id;
            const about = req.body.about;
            const benificiary_relation = req.body.benificiary_relation;
            const city = req.body.city;
            const deadline = req.body.deadline;
            const description = req.body.description;
            const district = req.body.district;
            const fullAddress = req.body.fullAddress;
            const pinCode = req.body.pinCode;
            const raiser_age = req.body.raiser_age;
            const raiser_name = req.body.raiser_name;
            const state = req.body.state;
            console.log("User ID");
            console.log((_a = req.context) === null || _a === void 0 ? void 0 : _a.user_id);
            const utilHelper = new utilHelper_1.default();
            const fundID = utilHelper.createFundRaiseID(DbEnum_1.FundRaiserCreatedBy.ADMIN).toUpperCase();
            const createdDate = new Date();
            const fundRaiserData = {
                created_by: DbEnum_1.FundRaiserCreatedBy.ADMIN,
                created_date: createdDate,
                about,
                amount,
                benificiary_relation,
                category,
                city,
                deadline,
                description,
                district,
                email_id,
                full_address: fullAddress,
                fund_id: fundID,
                phone_number: phone_number.toString(),
                pincode: pinCode,
                age: raiser_age,
                full_name: raiser_name,
                state,
                status: DbEnum_1.FundRaiserStatus.INITIATED,
                sub_category
            };
            this.fundRaiserService.createFundRaisePost(fundRaiserData).then((data) => __awaiter(this, void 0, void 0, function* () {
                res.status(data.statusCode).json({ status: true, msg: data.msg, data: data.data });
            })).catch((err) => {
                res.status(500).json({ status: false, msg: "Interanl server error", });
            });
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ status: false, msg: "Interanl server error", });
        }
    }
    updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fund_id = req.params.edit_id;
                const newStatus = req.body.status;
                const updateStatus = yield this.fundRaiserService.updateStatus(fund_id, newStatus);
                res.status(updateStatus.statusCode).json({ status: updateStatus.status, msg: updateStatus.msg });
            }
            catch (e) {
                res.status(500).json({ status: false, msg: "Internal server error" });
            }
        });
    }
    closeFundRaiser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fund_id = req.params.edit_id;
                const closeFundRaiser = yield this.fundRaiserService.closeFundRaiser(fund_id, false);
                res.status(closeFundRaiser.statusCode).json({ status: closeFundRaiser.status, msg: closeFundRaiser.msg });
            }
            catch (e) {
                res.status(500).json({ status: false, msg: "Internal server error" });
            }
        });
    }
}
exports.AdminController = AdminController;
