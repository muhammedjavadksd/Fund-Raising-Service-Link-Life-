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
const FundRaiserRepo_1 = __importDefault(require("../repositorys/FundRaiserRepo"));
const UtilEnum_1 = require("../types/Enums/UtilEnum");
const s3Bucket_1 = __importDefault(require("../util/helper/s3Bucket"));
const ConstData_1 = require("../types/Enums/ConstData");
const utilHelper_1 = __importDefault(require("../util/helper/utilHelper"));
const tokenHelper_1 = __importDefault(require("../util/helper/tokenHelper"));
const provider_1 = __importDefault(require("../communication/provider"));
class FundRaiserService {
    constructor() {
        this.deleteImage = this.deleteImage.bind(this);
        this.createFundRaisePost = this.createFundRaisePost.bind(this);
        this.getOwnerFundRaise = this.getOwnerFundRaise.bind(this);
        this.closeFundRaiser = this.closeFundRaiser.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
        this.editFundRaiser = this.editFundRaiser.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.paginatedFundRaiserByCategory = this.paginatedFundRaiserByCategory.bind(this);
        this.closeFundRaiserVerification = this.closeFundRaiserVerification.bind(this);
        this.FundRaiserRepo = new FundRaiserRepo_1.default();
        this.fundRaiserPictureBucket = new s3Bucket_1.default(ConstData_1.BucketsOnS3.FundRaiserPicture);
        this.fundRaiserDocumentBucket = new s3Bucket_1.default(ConstData_1.BucketsOnS3.FundRaiserDocument);
    }
    closeFundRaiserVerification(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenHelper = new tokenHelper_1.default();
            const verifyToken = yield tokenHelper.checkTokenValidity(token);
            if (verifyToken && typeof verifyToken == "object") {
                const fund_id = verifyToken === null || verifyToken === void 0 ? void 0 : verifyToken.fund_id;
                const type = verifyToken === null || verifyToken === void 0 ? void 0 : verifyToken.type;
                if (fund_id && type == UtilEnum_1.JwtType.CloseFundRaise) {
                    console.log(fund_id);
                    yield this.FundRaiserRepo.closeFundRaiser(fund_id);
                    return {
                        status: true,
                        msg: "Fund raising closed",
                        statusCode: UtilEnum_1.StatusCode.OK
                    };
                }
            }
            return {
                status: false,
                msg: "Fund raising failed",
                statusCode: UtilEnum_1.StatusCode.BAD_REQUESR
            };
        });
    }
    paginatedFundRaiserByCategory(category, limit, skip, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchQuery = Object.assign(Object.assign(Object.assign(Object.assign({}, (filter.sub_category ? { sub_category: filter.sub_category } : {})), (filter.state ? { state: filter.state } : {})), (filter.min ? { amount: { $gte: +filter.min } } : {})), (filter.max ? { amount: { $lte: +filter.max } } : {}));
            if (category != "all") {
                matchQuery['category'] = category;
            }
            const date = new Date();
            if (filter.urgency) {
                matchQuery['deadline'] = {
                    $lte: new Date(date.setDate(date.getDate() + 10))
                };
            }
            console.log("Match query");
            console.log(matchQuery);
            const findProfile = yield this.FundRaiserRepo.getActiveFundRaiserPost(skip, limit, matchQuery);
            // findProfile.paginated.filter()
            if (findProfile.total_records) {
                return {
                    status: true,
                    msg: "Profile found",
                    statusCode: UtilEnum_1.StatusCode.OK,
                    data: {
                        profile: findProfile
                    }
                };
            }
            else {
                return {
                    status: false,
                    msg: "No profile found",
                    statusCode: UtilEnum_1.StatusCode.BAD_REQUESR,
                };
            }
        });
    }
    getOwnerSingleProfile(profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let fundraiser_data = yield this.FundRaiserRepo.findFundPostByFundId(profile_id);
            if (!fundraiser_data) {
                return {
                    msg: "No profile found",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.NOT_FOUND,
                };
            }
            if (fundraiser_data.user_id == profile_id) {
                return {
                    msg: "Data fetched success",
                    status: true,
                    statusCode: UtilEnum_1.StatusCode.OK,
                    data: fundraiser_data
                };
            }
            else {
                return {
                    msg: "Unauthorized access",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.UNAUTHORIZED,
                };
            }
        });
    }
    deleteImage(fund_id, type, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findData = yield this.FundRaiserRepo.findFundPostByFundId(fund_id); // await InitFundRaisingModel.findOne({ fund_id: fund_id });
                if (findData) {
                    const field = (type == UtilEnum_1.FundRaiserFileType.Document) ? "documents" : "picture";
                    const filterImage = findData[field].filter((each) => each != image);
                    findData[field] = [...filterImage];
                    yield this.FundRaiserRepo.updateFundRaiserByModel(findData);
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    createFundRaisePost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            console.log(data);
            try {
                const createFundRaise = yield this.FundRaiserRepo.createFundRaiserPost(data); //this.createFundRaisePost(data);
                console.log(createFundRaise);
                console.log("this");
                const picturesPreisgnedUrl = [];
                const DocumentsPreisgnedUrl = [];
                const utlHelper = new utilHelper_1.default();
                for (let index = 0; index < ConstData_1.const_data.FUND_RAISER_DOCUMENTS_LENGTH; index++) {
                    const randomImageName = `${utlHelper.createRandomText(5)}${new Date().getMilliseconds()}.jpeg`;
                    const picPresignedUrl = yield this.fundRaiserPictureBucket.generatePresignedUrl(`pics_${randomImageName}`);
                    const docsPresignedUrl = yield this.fundRaiserDocumentBucket.generatePresignedUrl(`docs_${randomImageName}`);
                    picturesPreisgnedUrl.push(picPresignedUrl);
                    DocumentsPreisgnedUrl.push(docsPresignedUrl);
                }
                return {
                    status: createFundRaise.status,
                    msg: createFundRaise.msg,
                    data: {
                        id: (_a = createFundRaise.data) === null || _a === void 0 ? void 0 : _a.id,
                        fund_id: (_b = createFundRaise.data) === null || _b === void 0 ? void 0 : _b.fund_id,
                        upload_images: {
                            pictures: picturesPreisgnedUrl,
                            documents: DocumentsPreisgnedUrl
                        }
                    },
                    statusCode: createFundRaise.statusCode
                };
            }
            catch (e) {
                return {
                    status: false,
                    msg: "Internal server error",
                    statusCode: UtilEnum_1.StatusCode.SERVER_ERROR
                };
            }
        });
    }
    getOwnerFundRaise(user_id, limit, skip, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let fundraiser_data = yield this.FundRaiserRepo.getUserPosts(user_id, skip, limit, status);
                if (fundraiser_data.total_records) {
                    return {
                        msg: "Data fetched success",
                        status: true,
                        statusCode: UtilEnum_1.StatusCode.OK,
                        data: fundraiser_data
                    };
                }
                else {
                    return {
                        msg: "No data found",
                        status: false,
                        statusCode: UtilEnum_1.StatusCode.NOT_FOUND
                    };
                }
            }
            catch (e) {
                console.log(e);
                return {
                    msg: "Internal server error",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.SERVER_ERROR
                };
            }
        });
    }
    closeFundRaiser(fund_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentFund = yield this.FundRaiserRepo.findFundPostByFundId(fund_id);
                if (currentFund) {
                    if (currentFund.closed) {
                        return {
                            status: false,
                            msg: "This fund raiser is already closed",
                            statusCode: UtilEnum_1.StatusCode.BAD_REQUESR,
                        };
                    }
                    else {
                        const tokenHelper = new tokenHelper_1.default();
                        const communication = new provider_1.default(process.env.FUND_RAISER_CLOSE_NOTIFICATION || "");
                        yield communication._init__();
                        const createToken = {
                            fund_id,
                            type: UtilEnum_1.JwtType.CloseFundRaise
                        };
                        const token = yield tokenHelper.createJWTToken(createToken, UtilEnum_1.JwtTimer._15Min);
                        communication.transferData({
                            token,
                            email_id: currentFund.email_id,
                            full_name: currentFund.full_name,
                            collected_amount: currentFund.collected
                        });
                        if (token) {
                            currentFund.close_token = token;
                            // currentFund.closed = true;
                            yield this.FundRaiserRepo.updateFundRaiserByModel(currentFund);
                            return {
                                msg: "A verification email has been sent to the registered email address.",
                                status: true,
                                statusCode: UtilEnum_1.StatusCode.OK
                            };
                        }
                        else {
                            return {
                                msg: "Something went wrong",
                                status: false,
                                statusCode: UtilEnum_1.StatusCode.BAD_REQUESR
                            };
                        }
                    }
                }
                else {
                    return {
                        msg: "Fund raiser is not available",
                        status: false,
                        statusCode: UtilEnum_1.StatusCode.BAD_REQUESR
                    };
                }
            }
            catch (e) {
                return {
                    msg: "Internal server error",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.SERVER_ERROR
                };
            }
        });
    }
    updateStatus(fund_id, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentFund = yield this.FundRaiserRepo.findFundPostByFundId(fund_id);
                if (currentFund) {
                    const currentStatus = currentFund.status;
                    if (currentStatus == newStatus) {
                        return {
                            msg: "Current status is already that you have requested",
                            status: false,
                            statusCode: UtilEnum_1.StatusCode.UNAUTHORIZED
                        };
                    }
                    else {
                        currentFund.status = newStatus;
                        yield this.FundRaiserRepo.updateFundRaiserByModel(currentFund);
                        return {
                            status: true,
                            msg: "Status has been updated",
                            statusCode: UtilEnum_1.StatusCode.OK
                        };
                    }
                }
                else {
                    return {
                        status: false,
                        msg: "Fund raiser is not available",
                        statusCode: UtilEnum_1.StatusCode.BAD_REQUESR
                    };
                }
            }
            catch (e) {
                return {
                    status: false,
                    msg: "Interanl server error",
                    statusCode: UtilEnum_1.StatusCode.SERVER_ERROR
                };
            }
        });
    }
    editFundRaiser(fund_id, edit_data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateFundRaiserData = yield this.FundRaiserRepo.updateFundRaiser(fund_id, edit_data);
                if (updateFundRaiserData) {
                    return {
                        msg: "Fund raiser updated success",
                        status: true,
                        statusCode: UtilEnum_1.StatusCode.OK,
                    };
                }
                else {
                    return {
                        msg: "Fund raiser updation failed",
                        status: false,
                        statusCode: UtilEnum_1.StatusCode.BAD_REQUESR,
                    };
                }
            }
            catch (e) {
                return {
                    msg: "Internal server error",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.SERVER_ERROR,
                };
            }
        });
    }
    uploadImage(images, fundRaiserID, document_type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newImages = [];
                const field = document_type == UtilEnum_1.FundRaiserFileType.Document ? "documents" : "picture";
                console.log("Field type :" + document_type);
                const imageLength = images.length;
                const utilHelper = new utilHelper_1.default();
                for (let fileIndex = 0; fileIndex < imageLength; fileIndex++) {
                    // axios.put(images[fileIndex])
                    const imageName = `${document_type == UtilEnum_1.FundRaiserFileType.Document ? ConstData_1.BucketsOnS3.FundRaiserDocument : ConstData_1.BucketsOnS3.FundRaiserPicture}/${utilHelper.extractImageNameFromPresignedUrl(images[fileIndex])}`;
                    if (imageName) {
                        newImages.push(imageName.toString());
                    }
                }
                const initFundRaise = yield this.FundRaiserRepo.findFundPostByFundId(fundRaiserID);
                ;
                if (initFundRaise) {
                    const replaceImage = initFundRaise[field]; //initFundRaise[field] as string[]
                    initFundRaise[field] = [...replaceImage, ...newImages];
                    yield this.FundRaiserRepo.updateFundRaiserByModel(initFundRaise);
                    return {
                        msg: "Image uploaded success",
                        status: true,
                        statusCode: UtilEnum_1.StatusCode.CREATED,
                        data: {
                            picture: initFundRaise.picture,
                            documents: initFundRaise.documents
                        }
                    };
                }
                else {
                    return {
                        msg: "Fund id couldn't found",
                        status: false,
                        statusCode: UtilEnum_1.StatusCode.BAD_REQUESR,
                    };
                }
            }
            catch (e) {
                console.log(e);
                return {
                    msg: "Internal server error",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.SERVER_ERROR,
                };
            }
        });
    }
}
exports.default = FundRaiserService;
