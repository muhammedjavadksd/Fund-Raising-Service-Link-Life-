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
const DbEnum_1 = require("../types/Enums/DbEnum");
const UtilEnum_1 = require("../types/Enums/UtilEnum");
const fs_1 = __importDefault(require("fs"));
class FundRaiserService {
    constructor() {
        this.deleteImage = this.deleteImage.bind(this);
        this.createFundRaisePost = this.createFundRaisePost.bind(this);
        this.getOwnerFundRaise = this.getOwnerFundRaise.bind(this);
        this.closeFundRaiser = this.closeFundRaiser.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
        this.editFundRaiser = this.editFundRaiser.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.FundRaiserRepo = new FundRaiserRepo_1.default();
    }
    deleteImage(fund_id, type, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let findData = yield this.FundRaiserRepo.findFundPostByFundId(fund_id); // await InitFundRaisingModel.findOne({ fund_id: fund_id });
                if (findData) {
                    let field = (type == UtilEnum_1.FundRaiserFileType.Document) ? "documents" : "picture";
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
            var _a;
            try {
                const createFundRaise = yield this.FundRaiserRepo.createFundRaiserPost(data); //this.createFundRaisePost(data);
                return {
                    status: createFundRaise.status,
                    msg: createFundRaise.msg,
                    data: {
                        id: (_a = createFundRaise.data) === null || _a === void 0 ? void 0 : _a.id
                    },
                    statusCode: createFundRaise.statusCode
                };
            }
            catch (e) {
                return {
                    status: false,
                    msg: "Internal server error",
                    statusCode: 500
                };
            }
        });
    }
    getOwnerFundRaise(owner_id, owner_type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (owner_id) {
                    let fundraiser_data;
                    if (owner_type == DbEnum_1.FundRaiserCreatedBy.ORGANIZATION) {
                        fundraiser_data = yield this.FundRaiserRepo.getOrganizationPosts(owner_id);
                    }
                    else if (owner_type == DbEnum_1.FundRaiserCreatedBy.USER) {
                        fundraiser_data = yield this.FundRaiserRepo.getUserPosts(owner_id);
                    }
                    if (fundraiser_data && (fundraiser_data === null || fundraiser_data === void 0 ? void 0 : fundraiser_data.length)) {
                        return {
                            msg: "Data fetched success",
                            status: true,
                            statusCode: 200,
                            data: fundraiser_data
                        };
                    }
                    else {
                        return {
                            msg: "No data found",
                            status: false,
                            statusCode: 400
                        };
                    }
                }
                else {
                    return {
                        msg: "Please provide valid user id",
                        status: false,
                        statusCode: 401
                    };
                }
            }
            catch (e) {
                console.log(e);
                return {
                    msg: "Internal server error",
                    status: false,
                    statusCode: 500
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
                            statusCode: 400,
                        };
                    }
                    else {
                        currentFund.closed = true;
                        yield this.FundRaiserRepo.updateFundRaiserByModel(currentFund);
                        return {
                            msg: "Fund raiser closed success",
                            status: true,
                            statusCode: 200
                        };
                    }
                }
                else {
                    return {
                        msg: "Fund raiser is not available",
                        status: false,
                        statusCode: 400
                    };
                }
            }
            catch (e) {
                return {
                    msg: "Internal server error",
                    status: false,
                    statusCode: 500
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
                            statusCode: 401
                        };
                    }
                    else {
                        currentFund.status = newStatus;
                        yield this.FundRaiserRepo.updateFundRaiserByModel(currentFund);
                        return {
                            status: true,
                            msg: "Status has been updated",
                            statusCode: 200
                        };
                    }
                }
                else {
                    return {
                        status: false,
                        msg: "Fund raiser is not available",
                        statusCode: 400
                    };
                }
            }
            catch (e) {
                return {
                    status: false,
                    msg: "Interanl server error",
                    statusCode: 500
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
                        statusCode: 200,
                    };
                }
                else {
                    return {
                        msg: "Fund raiser updation failed",
                        status: false,
                        statusCode: 400,
                    };
                }
            }
            catch (e) {
                return {
                    msg: "Internal server error",
                    status: false,
                    statusCode: 500,
                };
            }
        });
    }
    uploadImage(images, fundRaiserID, document_type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newImages = [];
                const isDocument = document_type == UtilEnum_1.FundRaiserFileType.Document;
                let field = document_type == UtilEnum_1.FundRaiserFileType.Document ? "documents" : "picture";
                let imageLength = images.length;
                for (let fileIndex = 0; fileIndex < imageLength; fileIndex++) {
                    let imageName = images[fileIndex].filename;
                    let path = isDocument ? `public/images/fund_raise_document/${imageName}` : `public/images/fund_raiser_image/${imageName}`;
                    newImages.push(imageName);
                    const imageBuffer = images[fileIndex].buffer;
                    yield fs_1.default.promises.writeFile(path, imageBuffer);
                }
                let initFundRaise = yield this.FundRaiserRepo.findFundPostByFundId(fundRaiserID);
                ;
                if (initFundRaise) {
                    const replaceImage = initFundRaise[field]; //initFundRaise[field] as string[]
                    initFundRaise[field] = [...replaceImage, ...newImages];
                    yield this.FundRaiserRepo.updateFundRaiserByModel(initFundRaise);
                    return {
                        msg: "Image uploaded success",
                        status: true,
                        statusCode: 201,
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
                        statusCode: 400,
                    };
                }
            }
            catch (e) {
                console.log(e);
                return {
                    msg: "Internal server error",
                    status: false,
                    statusCode: 500,
                };
            }
        });
    }
}
exports.default = FundRaiserService;
