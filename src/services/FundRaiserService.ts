import FundRaiserRepo from "../repositorys/FundRaiserRepo";
import { FundRaiserCreatedBy, FundRaiserStatus } from "../types/Enums/DbEnum";
import { FundRaiserFileType, JwtTimer, JwtType, StatusCode } from "../types/Enums/UtilEnum";
import { IAdminAddFundRaiser, IEditableFundRaiser, IFundRaise, IFundRaiseInitialData, iFundRaiseModel } from "../types/Interface/IDBmodel";
import { IFundRaiserService } from "../types/Interface/IService";
import { HelperFuncationResponse, ICloseFundRaiseJwtToken, IPaginatedResponse } from "../types/Interface/Util";
import fs from 'fs'
import { UploadedFile } from 'express-fileupload'
import S3BucketHelper from "../util/helper/s3Bucket";
import { S3Folder, const_data } from "../types/Enums/ConstData";
import UtilHelper from "../util/helper/utilHelper";
import axios from "axios";
import TokenHelper from "../util/helper/tokenHelper";
import FundRaiserProvider from "../communication/provider";
import { config } from 'dotenv';
import cashfreedocsNew from '../apis/cashfreedocs-new';
import BankAccountRepo from "../repositorys/BankAccountRepo";


class FundRaiserService implements IFundRaiserService {

    private readonly FundRaiserRepo;
    private readonly fundRaiserPictureBucket;
    private readonly fundRaiserDocumentBucket;
    private readonly bankRepo;

    constructor() {
        this.deleteImage = this.deleteImage.bind(this)
        this.createFundRaisePost = this.createFundRaisePost.bind(this)
        this.getOwnerFundRaise = this.getOwnerFundRaise.bind(this)
        this.closeFundRaiser = this.closeFundRaiser.bind(this)
        this.updateStatus = this.updateStatus.bind(this)
        this.editFundRaiser = this.editFundRaiser.bind(this)
        this.uploadImage = this.uploadImage.bind(this)
        this.paginatedFundRaiserByCategory = this.paginatedFundRaiserByCategory.bind(this);
        this.closeFundRaiserVerification = this.closeFundRaiserVerification.bind(this);
        this.createPresignedUrl = this.createPresignedUrl.bind(this)
        this.deleteFundRaiserImage = this.deleteFundRaiserImage.bind(this)
        this.removeBeneficiary = this.removeBeneficiary.bind(this)
        config()
        this.FundRaiserRepo = new FundRaiserRepo();
        console.log("Main bucket  name");
        console.log(process.env.FUND_RAISER_BUCKET);
        this.bankRepo = new BankAccountRepo()
        this.fundRaiserPictureBucket = new S3BucketHelper(process.env.FUND_RAISER_BUCKET || "", S3Folder.FundRaiserPicture);
        this.fundRaiserDocumentBucket = new S3BucketHelper(process.env.FUND_RAISER_BUCKET || "", S3Folder.FundRaiserDocument);
    }

    async deleteFundRaiserImage(fundId: string, image: string, type: FundRaiserFileType): Promise<HelperFuncationResponse> {

        const findProfile = await this.FundRaiserRepo.findFundPostByFundId(fundId)
        if (findProfile) {
            const field = type == FundRaiserFileType.Document ? 'documents' : 'picture'
            if (findProfile[field].length < 4) {
                return {
                    status: false,
                    msg: "Image deletion is not allowed; at least 3 images must be retained",
                    statusCode: StatusCode.BAD_REQUESR
                }
            } else {
                const deletePic = type == FundRaiserFileType.Pictures ? await this.FundRaiserRepo.deleteOnePicture(fundId, image) : await this.FundRaiserRepo.deleteOneDocument(fundId, image);
                if (deletePic) {
                    return {
                        msg: `${type} delete success`,
                        status: true,
                        statusCode: StatusCode.OK
                    }
                } else {
                    return {
                        msg: `${type} delete failed`,
                        status: false,
                        statusCode: StatusCode.BAD_REQUESR
                    }
                }
            }
        } else {
            return {
                msg: `Profile not found`,
                status: false,
                statusCode: StatusCode.NOT_FOUND
            }
        }
    }


    async createPresignedUrl(type: FundRaiserFileType): Promise<HelperFuncationResponse> {
        const utilHelper = new UtilHelper()
        try {
            if (type == FundRaiserFileType.Pictures) {
                const key = `${utilHelper.createRandomText(4)}-${utilHelper.generateAnOTP(4)}-pic.jpeg`;
                const url = await this.fundRaiserPictureBucket.generatePresignedUrl(key);
                if (url) {
                    return {
                        status: true,
                        msg: "Presigne url created",
                        statusCode: StatusCode.CREATED,
                        data: {
                            url
                        }
                    }
                }
            } else {
                const key = `${utilHelper.createRandomText(4)}-${utilHelper.generateAnOTP(4)}-doc.jpeg`;
                const url = await this.fundRaiserDocumentBucket.generatePresignedUrl(key);
                if (url) {
                    return {
                        status: true,
                        msg: "Presigne url created",
                        statusCode: StatusCode.CREATED,
                        data: {
                            url
                        }
                    }
                }
            }

            return {
                status: false,
                msg: "Presigned url creation failed",
                statusCode: StatusCode.BAD_REQUESR
            }
        } catch (e) {
            return {
                status: false,
                msg: "Something went wrong",
                statusCode: StatusCode.SERVER_ERROR
            }
        }
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

    async removeBeneficiary(benfId: string): Promise<HelperFuncationResponse> {


        try {
            cashfreedocsNew.auth(process.env.CASHFREE_PAYOUT_KEY || "");
            cashfreedocsNew.auth(process.env.CASHFREE_PAYOUT_SECRET || "");
            const authOptions = {
                method: 'POST',
                url: 'https://payout-gamma.cashfree.com/payout/v1/authorize',
                headers: {
                    accept: 'application/json',
                    'x-client-id': process.env.CASHFREE_PAYOUT_KEY,
                    'x-client-secret': process.env.CASHFREE_PAYOUT_SECRET
                }
            };

            const request = await axios.request(authOptions)
            const responseData = request.data.data
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



                const addBeneficiary = await (await axios.request(options)).data
                if (addBeneficiary.status == "SUCCESS") {
                    return {
                        msg: "Beneficiary added success",
                        status: true,
                        statusCode: StatusCode.OK
                    }
                } else {
                    return {
                        msg: addBeneficiary.message,
                        status: false,
                        statusCode: StatusCode.BAD_REQUESR
                    }
                }
            } else {
                return {
                    msg: "Something went wrong",
                    status: false,
                    statusCode: StatusCode.SERVER_ERROR
                }
            }
        } catch (e) {
            console.log(e);
            return {
                msg: "Something went wrong",
                status: false,
                statusCode: StatusCode.SERVER_ERROR
            }
        }
    }


    async addBeneficiary(fund_id: string, name: string, email: string, phone: string, accountNumber: string, ifsc: string, address: string): Promise<HelperFuncationResponse> {


        try {
            const utilHelper = new UtilHelper();
            const benfId = utilHelper.convertFundIdToBeneficiaryId(fund_id);
            cashfreedocsNew.auth(process.env.CASHFREE_PAYOUT_KEY || "");
            cashfreedocsNew.auth(process.env.CASHFREE_PAYOUT_SECRET || "");
            const authOptions = {
                method: 'POST',
                url: 'https://payout-gamma.cashfree.com/payout/v1/authorize',
                headers: {
                    accept: 'application/json',
                    'x-client-id': process.env.CASHFREE_PAYOUT_KEY,
                    'x-client-secret': process.env.CASHFREE_PAYOUT_SECRET
                }
            };

            const request = await axios.request(authOptions)
            console.log("fund-raising");
            console.log(request);

            const responseData = request.data.data
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



                const addBeneficiary = await (await axios.request(options)).data
                if (addBeneficiary.status == "SUCCESS") {
                    return {
                        msg: "Beneficiary added success",
                        status: true,
                        statusCode: StatusCode.OK
                    }
                } else {
                    return {
                        msg: addBeneficiary.message,
                        status: false,
                        statusCode: StatusCode.BAD_REQUESR
                    }
                }
            } else {
                return {
                    msg: "Something went wrong",
                    status: false,
                    statusCode: StatusCode.SERVER_ERROR
                }
            }
        } catch (e) {
            console.log(e);
            return {
                msg: "Something went wrong",
                status: false,
                statusCode: StatusCode.SERVER_ERROR
            }
        }
    }

    async closeFundRaiserVerification(token: string): Promise<HelperFuncationResponse> {
        const tokenHelper = new TokenHelper();
        const verifyToken = await tokenHelper.checkTokenValidity(token);
        if (verifyToken && typeof verifyToken == "object") {
            const fund_id = verifyToken?.fund_id
            const type = verifyToken?.type;

            if (fund_id && type == JwtType.CloseFundRaise) {
                console.log(fund_id);

                await this.FundRaiserRepo.closeFundRaiser(fund_id)
                // const findFund = await this.FundRaiserRepo.findFundPostByFundId(fund_id);
                // if (findFund) {
                //     // const findAccount = await this.bankRepo.find
                //     // await this.removeBeneficiary()

                // }

                return {
                    status: true,
                    msg: "Fund raising closed",
                    statusCode: StatusCode.OK
                }
            }
        }
        return {
            status: false,
            msg: "Fund raising failed",
            statusCode: StatusCode.BAD_REQUESR
        }
    }


    async paginatedFundRaiserByCategory(category: string, limit: number, skip: number, filter: Record<string, any>): Promise<HelperFuncationResponse> {

        const matchQuery: Record<string, any> = {
            ...(filter.sub_category ? { sub_category: filter.sub_category } : {}),
            ...(filter.state ? { state: filter.state } : {}),
            ...(
                filter.min || filter.max
                    ? {
                        amount: {
                            ...(filter.min ? { $gte: +filter.min } : {}),
                            ...(filter.max ? { $lte: +filter.max } : {})
                        }
                    }
                    : {}
            )
        };
        if (category != "all") {
            matchQuery['category'] = category
        }
        const date = new Date()
        if (filter.urgency) {
            matchQuery['deadline'] = {
                $lte: new Date(date.setDate(date.getDate() + 10))
            }
        }


        console.log("Match query");
        console.log(matchQuery);


        const findProfile: IPaginatedResponse<IFundRaise[]> = await this.FundRaiserRepo.getActiveFundRaiserPost(skip, limit, matchQuery);
        // findProfile.paginated.filter()

        if (findProfile.total_records) {
            return {
                status: true,
                msg: "Profile found",
                statusCode: StatusCode.OK,
                data: {
                    profile: findProfile
                }
            }
        } else {
            return {
                status: false,
                msg: "No profile found",
                statusCode: StatusCode.BAD_REQUESR,
            }
        }
    }



    async getOwnerSingleProfile(profile_id: string): Promise<HelperFuncationResponse> {
        let fundraiser_data: iFundRaiseModel | null = await this.FundRaiserRepo.findFundPostByFundId(profile_id);
        if (!fundraiser_data) {
            return {
                msg: "No profile found",
                status: false,
                statusCode: StatusCode.NOT_FOUND,
            }
        }


        if (fundraiser_data.user_id == profile_id) {
            return {
                msg: "Data fetched success",
                status: true,
                statusCode: StatusCode.OK,
                data: fundraiser_data
            }
        } else {
            return {
                msg: "Unauthorized access",
                status: false,
                statusCode: StatusCode.UNAUTHORIZED,
            }
        }
    }





    async deleteImage(fund_id: string, type: FundRaiserFileType, image: string): Promise<HelperFuncationResponse> {
        try {
            const findData = await this.FundRaiserRepo.findFundPostByFundId(fund_id) // await InitFundRaisingModel.findOne({ fund_id: fund_id });
            if (findData) {
                const field: "documents" | "picture" = (type == FundRaiserFileType.Document) ? "documents" : "picture";
                if (!!findData.description) {
                    const length: number = findData[field].length;
                    if (length <= 3) {
                        return {
                            msg: "Please keep minimum 3 image's",
                            status: false,
                            statusCode: StatusCode.BAD_REQUESR
                        }
                    }
                }
                const filterImage = findData[field].filter((each) => each != image)
                findData[field] = [...filterImage]
                await this.FundRaiserRepo.updateFundRaiserByModel(findData);
                return {
                    msg: "Image deletion success",
                    status: true,
                    statusCode: StatusCode.OK
                }
            } else {
                return {
                    msg: "Data couldn't found",
                    status: false,
                    statusCode: StatusCode.NOT_FOUND
                }
            }
        } catch (e) {
            console.log(e);
            return {
                msg: "Something went wrong",
                status: false,
                statusCode: StatusCode.SERVER_ERROR
            }
        }
    }

    async createFundRaisePost(data: IFundRaiseInitialData | IAdminAddFundRaiser): Promise<HelperFuncationResponse> {

        console.log(data);


        try {
            const createFundRaise = await this.FundRaiserRepo.createFundRaiserPost(data) //this.createFundRaisePost(data);
            console.log(createFundRaise);
            console.log("this");

            return {
                status: createFundRaise.status,
                msg: createFundRaise.msg,
                data: {
                    id: createFundRaise.data?.id,
                    fund_id: createFundRaise.data?.fund_id,
                },
                statusCode: createFundRaise.statusCode
            }
        } catch (e) {
            console.log(e);
            return {
                status: false,
                msg: "Internal server error",
                statusCode: StatusCode.SERVER_ERROR
            }
        }
    }

    async getOwnerFundRaise(user_id: string, limit: number, skip: number, status: FundRaiserStatus): Promise<HelperFuncationResponse> {
        try {
            let fundraiser_data: IPaginatedResponse<iFundRaiseModel[]> = await this.FundRaiserRepo.getUserPosts(user_id, skip, limit, status);

            if (fundraiser_data.total_records) {
                return {
                    msg: "Data fetched success",
                    status: true,
                    statusCode: StatusCode.OK,
                    data: fundraiser_data
                }
            } else {
                return {
                    msg: "No data found",
                    status: false,
                    statusCode: StatusCode.NOT_FOUND
                }
            }
        } catch (e) {
            console.log(e);
            return {
                msg: "Internal server error",
                status: false,
                statusCode: StatusCode.SERVER_ERROR
            }
        }
    }

    async closeFundRaiser(fund_id: string, needVerification: boolean): Promise<HelperFuncationResponse> {
        try {
            const currentFund: iFundRaiseModel | null = await this.FundRaiserRepo.findFundPostByFundId(fund_id);
            if (currentFund) {
                if (currentFund.closed) {
                    return {
                        status: false,
                        msg: "This fund raiser is already closed",
                        statusCode: StatusCode.BAD_REQUESR,
                    }
                } else {

                    if (needVerification) {
                        const tokenHelper = new TokenHelper()
                        const communication = new FundRaiserProvider(process.env.FUND_RAISER_CLOSE_NOTIFICATION || "")
                        await communication._init__()

                        const createToken: ICloseFundRaiseJwtToken = {
                            fund_id,
                            type: JwtType.CloseFundRaise
                        }
                        const token = await tokenHelper.createJWTToken(createToken, JwtTimer._15Min);
                        communication.transferData({
                            token,
                            email_id: currentFund.email_id,
                            full_name: currentFund.full_name,
                            collected_amount: currentFund.collected
                        })
                        if (token) {
                            currentFund.close_token = token;
                            // currentFund.closed = true;
                            await this.FundRaiserRepo.updateFundRaiserByModel(currentFund);
                            return {
                                msg: "A verification email has been sent to the registered email address.",
                                status: true,
                                statusCode: StatusCode.OK
                            }
                        } else {
                            return {
                                msg: "Something went wrong",
                                status: false,
                                statusCode: StatusCode.BAD_REQUESR
                            }
                        }
                    } else {
                        const close = await this.FundRaiserRepo.closeFundRaiser(fund_id);
                        if (close) {
                            return {
                                msg: "Fund raising campign has been closed",
                                status: true,
                                statusCode: StatusCode.OK
                            }
                        } else {
                            return {
                                msg: "Campign already stopped",
                                status: false,
                                statusCode: StatusCode.BAD_REQUESR
                            }
                        }
                    }
                }
            } else {
                return {
                    msg: "Fund raiser is not available",
                    status: false,
                    statusCode: StatusCode.BAD_REQUESR
                }
            }
        } catch (e) {
            return {
                msg: "Internal server error",
                status: false,
                statusCode: StatusCode.SERVER_ERROR
            }

        }
    }

    async updateStatus(fund_id: string, newStatus: FundRaiserStatus): Promise<HelperFuncationResponse> {
        try {
            const currentFund: iFundRaiseModel | null = await this.FundRaiserRepo.findFundPostByFundId(fund_id);
            if (currentFund) {
                const currentStatus: FundRaiserStatus = currentFund.status;
                if (currentStatus == newStatus) {
                    return {
                        msg: "Current status is already that you have requested",
                        status: false,
                        statusCode: StatusCode.UNAUTHORIZED
                    }
                } else {
                    currentFund.status = newStatus;
                    await this.FundRaiserRepo.updateFundRaiserByModel(currentFund);
                    return {
                        status: true,
                        msg: "Status has been updated",
                        statusCode: StatusCode.OK
                    }
                }
            } else {
                return {
                    status: false,
                    msg: "Fund raiser is not available",
                    statusCode: StatusCode.BAD_REQUESR
                }
            }
        } catch (e) {
            return {
                status: false,
                msg: "Interanl server error",
                statusCode: StatusCode.SERVER_ERROR
            }
        }
    }

    async editFundRaiser(fund_id: string, edit_data: IEditableFundRaiser): Promise<HelperFuncationResponse> {
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
            const updateFundRaiserData = await this.FundRaiserRepo.updateFundRaiser(fund_id, edit_data);
            if (updateFundRaiserData) {
                return {
                    msg: "Fund raiser updated success",
                    status: true,
                    statusCode: StatusCode.OK,
                }
            } else {
                return {
                    msg: "Fund raiser updation failed",
                    status: false,
                    statusCode: StatusCode.BAD_REQUESR,
                }
            }
        } catch (e) {
            return {
                msg: "Internal server error",
                status: false,
                statusCode: StatusCode.SERVER_ERROR,
            }
        }
    }


    async uploadImage(images: string[], fundRaiserID: string, document_type: FundRaiserFileType): Promise<HelperFuncationResponse> {
        try {

            const newImages: string[] = [];
            const field: 'picture' | 'documents' = document_type == FundRaiserFileType.Document ? "documents" : "picture"
            console.log("Field type :" + document_type);
            console.log(images);

            const imageLength = images.length

            const utilHelper = new UtilHelper();
            for (let fileIndex = 0; fileIndex < imageLength; fileIndex++) {
                const bucketName = process.env.FUND_RAISER_BUCKET //document_type == FundRaiserFileType.Document ? BucketsOnS3.FundRaiserDocument : BucketsOnS3.FundRaiserPicture;
                const imageKey: string | false = utilHelper.extractImageNameFromPresignedUrl(images[fileIndex])
                if (imageKey) {
                    const findFile = await this.fundRaiserDocumentBucket.findFile(imageKey)
                    if (findFile) {
                        const imageName: string | boolean = `https://${bucketName}.s3.amazonaws.com/${imageKey}`
                        newImages.push(imageName.toString())
                    }
                }
            }

            const initFundRaise: iFundRaiseModel | null = await this.FundRaiserRepo.findFundPostByFundId(fundRaiserID);;


            console.log(initFundRaise);


            if (initFundRaise) {
                const replaceImage: string[] = initFundRaise[field] //initFundRaise[field] as string[]
                initFundRaise[field] = [...replaceImage, ...newImages]
                await this.FundRaiserRepo.updateFundRaiserByModel(initFundRaise);

                return {
                    msg: "Image uploaded success",
                    status: true,
                    statusCode: StatusCode.CREATED,
                    data: {
                        picture: initFundRaise.picture,
                        documents: initFundRaise.documents
                    }
                }
            } else {
                return {
                    msg: "Fund id couldn't found",
                    status: false,
                    statusCode: StatusCode.BAD_REQUESR,
                }
            }
        } catch (e) {
            console.log(e);
            return {
                msg: "Internal server error",
                status: false,
                statusCode: StatusCode.SERVER_ERROR,
            }
        }
    }
}

export default FundRaiserService