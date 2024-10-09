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
const axios_1 = __importDefault(require("axios"));
const tokenHelper_1 = __importDefault(require("../util/helper/tokenHelper"));
const provider_1 = __importDefault(require("../communication/provider"));
const dotenv_1 = require("dotenv");
const cashfreedocs_new_1 = __importDefault(require("../apis/cashfreedocs-new"));
const BankAccountRepo_1 = __importDefault(require("../repositorys/BankAccountRepo"));
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
        this.createPresignedUrl = this.createPresignedUrl.bind(this);
        this.deleteFundRaiserImage = this.deleteFundRaiserImage.bind(this);
        this.removeBeneficiary = this.removeBeneficiary.bind(this);
        (0, dotenv_1.config)();
        this.FundRaiserRepo = new FundRaiserRepo_1.default();
        console.log("Main bucket  name");
        console.log(process.env.FUND_RAISER_BUCKET);
        this.bankRepo = new BankAccountRepo_1.default();
        this.fundRaiserPictureBucket = new s3Bucket_1.default(process.env.FUND_RAISER_BUCKET || "", ConstData_1.S3Folder.FundRaiserPicture);
        this.fundRaiserDocumentBucket = new s3Bucket_1.default(process.env.FUND_RAISER_BUCKET || "", ConstData_1.S3Folder.FundRaiserDocument);
    }
    deleteFundRaiserImage(fundId, image, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const findProfile = yield this.FundRaiserRepo.findFundPostByFundId(fundId);
            if (findProfile) {
                const field = type == UtilEnum_1.FundRaiserFileType.Document ? 'documents' : 'picture';
                if (findProfile[field].length < 4) {
                    return {
                        status: false,
                        msg: "Image deletion is not allowed; at least 3 images must be retained",
                        statusCode: UtilEnum_1.StatusCode.BAD_REQUESR
                    };
                }
                else {
                    const deletePic = type == UtilEnum_1.FundRaiserFileType.Pictures ? yield this.FundRaiserRepo.deleteOnePicture(fundId, image) : yield this.FundRaiserRepo.deleteOneDocument(fundId, image);
                    if (deletePic) {
                        return {
                            msg: `${type} delete success`,
                            status: true,
                            statusCode: UtilEnum_1.StatusCode.OK
                        };
                    }
                    else {
                        return {
                            msg: `${type} delete failed`,
                            status: false,
                            statusCode: UtilEnum_1.StatusCode.BAD_REQUESR
                        };
                    }
                }
            }
            else {
                return {
                    msg: `Profile not found`,
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.NOT_FOUND
                };
            }
        });
    }
    createPresignedUrl(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const utilHelper = new utilHelper_1.default();
            try {
                if (type == UtilEnum_1.FundRaiserFileType.Pictures) {
                    const key = `${utilHelper.createRandomText(4)}-${utilHelper.generateAnOTP(4)}-pic.jpeg`;
                    const url = yield this.fundRaiserPictureBucket.generatePresignedUrl(key);
                    if (url) {
                        return {
                            status: true,
                            msg: "Presigne url created",
                            statusCode: UtilEnum_1.StatusCode.CREATED,
                            data: {
                                url
                            }
                        };
                    }
                }
                else {
                    const key = `${utilHelper.createRandomText(4)}-${utilHelper.generateAnOTP(4)}-doc.jpeg`;
                    const url = yield this.fundRaiserDocumentBucket.generatePresignedUrl(key);
                    if (url) {
                        return {
                            status: true,
                            msg: "Presigne url created",
                            statusCode: UtilEnum_1.StatusCode.CREATED,
                            data: {
                                url
                            }
                        };
                    }
                }
                return {
                    status: false,
                    msg: "Presigned url creation failed",
                    statusCode: UtilEnum_1.StatusCode.BAD_REQUESR
                };
            }
            catch (e) {
                return {
                    status: false,
                    msg: "Something went wrong",
                    statusCode: UtilEnum_1.StatusCode.SERVER_ERROR
                };
            }
        });
    }
    // async editFundRaiser(editId: string, editData: IEditableFundRaiser): Promise<HelperFuncationResponse> {
    //     const editResponse: boolean = await this.FundRaiserRepo.updateFundRaiser(editId, editData);
    //     if (editResponse) {
    //         return {
    //             msg: "Update success",
    //             status: true,
    //             statusCode: StatusCode.OK
    //         }
    //     } else {
    //         return {
    //             msg: "Update failed",
    //             status: false,
    //             statusCode: StatusCode.BAD_REQUESR
    //         }
    //     }
    // }
    removeBeneficiary(benfId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                cashfreedocs_new_1.default.auth(process.env.CASHFREE_PAYOUT_KEY || "");
                cashfreedocs_new_1.default.auth(process.env.CASHFREE_PAYOUT_SECRET || "");
                const authOptions = {
                    method: 'POST',
                    url: 'https://payout-gamma.cashfree.com/payout/v1/authorize',
                    headers: {
                        accept: 'application/json',
                        'x-client-id': process.env.CASHFREE_PAYOUT_KEY,
                        'x-client-secret': process.env.CASHFREE_PAYOUT_SECRET
                    }
                };
                const request = yield axios_1.default.request(authOptions);
                const responseData = request.data.data;
                const { token } = responseData;
                if (token) {
                    const options = {
                        method: 'POST',
                        url: 'https://payout-gamma.cashfree.com/payout/v1/removeBeneficiary',
                        headers: {
                            accept: 'application/json',
                            'content-type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        data: {
                            beneId: benfId,
                        }
                    };
                    const addBeneficiary = yield (yield axios_1.default.request(options)).data;
                    if (addBeneficiary.status == "SUCCESS") {
                        return {
                            msg: "Beneficiary added success",
                            status: true,
                            statusCode: UtilEnum_1.StatusCode.OK
                        };
                    }
                    else {
                        return {
                            msg: addBeneficiary.message,
                            status: false,
                            statusCode: UtilEnum_1.StatusCode.BAD_REQUESR
                        };
                    }
                }
                else {
                    return {
                        msg: "Something went wrong",
                        status: false,
                        statusCode: UtilEnum_1.StatusCode.SERVER_ERROR
                    };
                }
            }
            catch (e) {
                console.log(e);
                return {
                    msg: "Something went wrong",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.SERVER_ERROR
                };
            }
        });
    }
    addBeneficiary(fund_id, name, email, phone, accountNumber, ifsc, address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const utilHelper = new utilHelper_1.default();
                const benfId = utilHelper.convertFundIdToBeneficiaryId(fund_id, ifsc);
                cashfreedocs_new_1.default.auth(process.env.CASHFREE_PAYOUT_KEY || "");
                cashfreedocs_new_1.default.auth(process.env.CASHFREE_PAYOUT_SECRET || "");
                const authOptions = {
                    method: 'POST',
                    url: 'https://payout-gamma.cashfree.com/payout/v1/authorize',
                    headers: {
                        accept: 'application/json',
                        'x-client-id': process.env.CASHFREE_PAYOUT_KEY,
                        'x-client-secret': process.env.CASHFREE_PAYOUT_SECRET
                    }
                };
                const request = yield axios_1.default.request(authOptions);
                console.log("fund-raising");
                console.log(request);
                const responseData = request.data.data;
                console.log(responseData);
                const { token } = responseData;
                if (token) {
                    const options = {
                        method: 'POST',
                        url: 'https://payout-gamma.cashfree.com/payout/v1/addBeneficiary',
                        headers: {
                            accept: 'application/json',
                            'content-type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        data: {
                            beneId: benfId,
                            name: name,
                            email: email,
                            phone: phone,
                            address1: address,
                            bankAccount: accountNumber,
                            ifsc: ifsc,
                        }
                    };
                    console.log(options);
                    const addBeneficiary = yield (yield axios_1.default.request(options)).data;
                    console.log("Added");
                    console.log(addBeneficiary);
                    if (addBeneficiary.status == "SUCCESS") {
                        return {
                            msg: "Beneficiary added success",
                            status: true,
                            statusCode: UtilEnum_1.StatusCode.OK
                        };
                    }
                    else {
                        return {
                            msg: addBeneficiary.message,
                            status: false,
                            statusCode: UtilEnum_1.StatusCode.BAD_REQUESR
                        };
                    }
                }
                else {
                    return {
                        msg: "Something went wrong",
                        status: false,
                        statusCode: UtilEnum_1.StatusCode.SERVER_ERROR
                    };
                }
            }
            catch (e) {
                console.log(e);
                return {
                    msg: "Something went wrong",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.SERVER_ERROR
                };
            }
        });
    }
    closeBankAccount(fund_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findBankAccount = yield this.bankRepo.findBenfIdsByFundId(fund_id);
                if (findBankAccount.length) {
                    const bulkDelete = [];
                    for (let index = 0; index < findBankAccount.length; index++) {
                        bulkDelete.push(this.removeBeneficiary(findBankAccount[index]));
                    }
                    yield Promise.all(bulkDelete);
                    yield this.bankRepo.closeBankAccount(fund_id);
                }
                return true;
            }
            catch (e) {
                return false;
            }
        });
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
                    yield this.closeBankAccount(fund_id);
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
            const matchQuery = Object.assign(Object.assign(Object.assign({}, (filter.sub_category ? { sub_category: filter.sub_category } : {})), (filter.state ? { state: filter.state } : {})), (filter.min || filter.max
                ? {
                    amount: Object.assign(Object.assign({}, (filter.min ? { $gte: +filter.min } : {})), (filter.max ? { $lte: +filter.max } : {}))
                }
                : {}));
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
                    if (!!findData.description) {
                        const length = findData[field].length;
                        if (length <= 3) {
                            return {
                                msg: "Please keep minimum 3 image's",
                                status: false,
                                statusCode: UtilEnum_1.StatusCode.BAD_REQUESR
                            };
                        }
                    }
                    const filterImage = findData[field].filter((each) => each != image);
                    const newDocs = [...filterImage];
                    // await this.FundRaiserRepo.updateFundRaiserByModel(findData);
                    yield this.FundRaiserRepo.updateFundRaiser(fund_id, {
                        [field]: newDocs,
                    });
                    return {
                        msg: "Image deletion success",
                        status: true,
                        statusCode: UtilEnum_1.StatusCode.OK
                    };
                }
                else {
                    return {
                        msg: "Data couldn't found",
                        status: false,
                        statusCode: UtilEnum_1.StatusCode.NOT_FOUND
                    };
                }
            }
            catch (e) {
                console.log(e);
                return {
                    msg: "Something went wrong",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.SERVER_ERROR
                };
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
                return {
                    status: createFundRaise.status,
                    msg: createFundRaise.msg,
                    data: {
                        id: (_a = createFundRaise.data) === null || _a === void 0 ? void 0 : _a.id,
                        fund_id: (_b = createFundRaise.data) === null || _b === void 0 ? void 0 : _b.fund_id,
                    },
                    statusCode: createFundRaise.statusCode
                };
            }
            catch (e) {
                console.log(e);
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
    closeFundRaiser(fund_id, needVerification) {
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
                        if (needVerification) {
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
                                yield this.closeBankAccount(fund_id);
                                yield this.FundRaiserRepo.updateFundRaiser(fund_id, { close_token: token });
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
                        else {
                            const close = yield this.FundRaiserRepo.closeFundRaiser(fund_id);
                            if (close) {
                                return {
                                    msg: "Fund raising campign has been closed",
                                    status: true,
                                    statusCode: UtilEnum_1.StatusCode.OK
                                };
                            }
                            else {
                                return {
                                    msg: "Campign already stopped",
                                    status: false,
                                    statusCode: UtilEnum_1.StatusCode.BAD_REQUESR
                                };
                            }
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
                        // currentFund.status = newStatus;
                        yield this.FundRaiserRepo.updateFundRaiser(fund_id, {
                            status: newStatus,
                        });
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
                // if (edit_data?.withdraw_docs?.account_number) {
                //     const findProfile = await this.FundRaiserRepo.findFundPostByFundId(fund_id);
                //     if (findProfile) {
                //         const addBeneficiary = await this.addBeneficiary(fund_id, findProfile.full_name, findProfile.email_id, findProfile.phone_number.toString(), edit_data?.withdraw_docs?.account_number, edit_data?.withdraw_docs?.ifsc_code, findProfile.full_address);
                //         console.log("Add Benificiary details");
                //         console.log(addBeneficiary);
                //         if (addBeneficiary.status) {
                //             const utilHelper = new UtilHelper();
                //             const benfId = utilHelper.convertFundIdToBeneficiaryId(fund_id);
                //             edit_data.benf_id = benfId;
                //         } else {
                //             return {
                //                 msg: addBeneficiary.msg,
                //                 status: false,
                //                 statusCode: StatusCode.BAD_REQUESR
                //             }
                //         }
                //     } else {
                //         return {
                //             status: false,
                //             msg: "We couldn't find the profile",
                //             statusCode: StatusCode.BAD_REQUESR
                //         }
                //     }
                // }
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
                console.log(images);
                const imageLength = images.length;
                const utilHelper = new utilHelper_1.default();
                for (let fileIndex = 0; fileIndex < imageLength; fileIndex++) {
                    const bucketName = process.env.FUND_RAISER_BUCKET; //document_type == FundRaiserFileType.Document ? BucketsOnS3.FundRaiserDocument : BucketsOnS3.FundRaiserPicture;
                    const imageKey = utilHelper.extractImageNameFromPresignedUrl(images[fileIndex]);
                    if (imageKey) {
                        const findFile = yield this.fundRaiserDocumentBucket.findFile(imageKey);
                        if (findFile) {
                            const imageName = `https://${bucketName}.s3.amazonaws.com/${imageKey}`;
                            newImages.push(imageName.toString());
                        }
                    }
                }
                const initFundRaise = yield this.FundRaiserRepo.findFundPostByFundId(fundRaiserID);
                ;
                console.log(initFundRaise);
                if (initFundRaise) {
                    const replaceImage = initFundRaise[field]; //initFundRaise[field] as string[]
                    const newDocs = [...replaceImage, ...newImages];
                    // await this.FundRaiserRepo.updateFundRaiserByModel(initFundRaise);
                    yield this.FundRaiserRepo.updateFundRaiser(fundRaiserID, { [field]: newDocs });
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
