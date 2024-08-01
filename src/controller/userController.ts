import { Request, Response } from "express";
import FundRaiserService from "../services/FundRaiserService";
import { CustomRequest } from "../types/DataType/Objects";
import { FundRaiserCreatedBy, FundRaiserStatus } from "../types/Enums/DbEnum";
import { HelperFuncationResponse } from "../types/Interface/Util";
import { IEditableFundRaiser, IFundRaiseInitialData, iFundRaiseModel } from "../types/Interface/IDBmodel";
import { FundRaiserFileType, StatusCode } from "../types/Enums/UtilEnum";
import FundRaiserRepo from "../repositorys/FundRaiserRepo";
import UtilHelper from "../util/helper/utilHelper";
import { BucketsOnS3, const_data } from "../types/Enums/ConstData";
import { IUserController } from "../types/Interface/IController";
import { UploadedFile } from "express-fileupload";
import S3BucketHelper from "../util/helper/s3Bucket";
import url from 'url'

class UserController implements IUserController {

    private readonly fundRaiserService;
    private readonly fundRaiserRepo;





    constructor() {

        this.getUserFundRaisePost = this.getUserFundRaisePost.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
        this.closeFundRaise = this.closeFundRaise.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.editFundRaise = this.editFundRaise.bind(this);
        this.createFundRaise = this.createFundRaise.bind(this);
        this.getActiveFundRaise = this.getActiveFundRaise.bind(this);
        this.getSingleProfile = this.getSingleProfile.bind(this);

        this.fundRaiserService = new FundRaiserService();
        this.fundRaiserRepo = new FundRaiserRepo();

    }


    async uploadImageIntoS3(req: Request, res: Response) {
        const pre_url = req.body.presigned_url;

        const file: Express.Multer.File | undefined = req.file;
        if (file) {
            const presignedUrl = url.parse(pre_url, true).pathname //.parse(url, true)
            if (presignedUrl) {
                const extractPath = presignedUrl.split("/");
                const imageName = extractPath[2];
                if (imageName) {
                    console.log(presignedUrl);

                    const s3Bucket = new S3BucketHelper("file-bucket");
                    const buffer = file.buffer;
                    const uploadImage = await s3Bucket.uploadFile(buffer, pre_url, file.mimetype, imageName)
                    if (uploadImage) {
                        res.status(200).json({ status: true, msg: "Image uploaded success", image_name: uploadImage })
                    } else {
                        res.status(400).json({ status: false, msg: "Image uploaded failed" })
                    }
                } else {
                    res.status(500).json({ status: false, msg: "No image found" })
                }
            }
        } else {
            res.status(400).json({ status: false, msg: "Please upload valid image" })
        }

    }


    async getPresignedUrl(req: Request, res: Response) {
        const util = new UtilHelper();
        const key = util.createRandomText(10) + ".jpeg"
        const s3Helper = new S3BucketHelper("file-bucket");
        const url = await s3Helper.generatePresignedUrl(key);
        console.log("The url is : ", url);
        console.log("token is ;", key);

        res.status(200).json({ status: true, msg: "Signed url createed", data: { url } })
    }

    async getUserFundRaisePost(req: CustomRequest, res: Response): Promise<void> {
        console.log("recivied");


        try {

            const user_id: string = req.context?.user_id;
            console.log(user_id);

            if (user_id) {
                const getMyFundRaisePost: HelperFuncationResponse = await this.fundRaiserService.getOwnerFundRaise(user_id, FundRaiserCreatedBy.USER, 1, 2);
                if (getMyFundRaisePost.status) {
                    const data: iFundRaiseModel = getMyFundRaisePost.data;
                    res.status(getMyFundRaisePost.statusCode).json({ status: true, data })
                } else {
                    res.status(getMyFundRaisePost.statusCode).json({ status: false, msg: getMyFundRaisePost.msg })
                }
            } else {
                res.status(401).json({ status: false, msg: "Authentication failed" })
            }
        } catch (e) {
            res.status(500).json({ status: false, msg: "Internal server error" })
        }
    }

    async deleteImage(req: Request, res: Response): Promise<void> {

        const type: FundRaiserFileType = req.params.type as FundRaiserFileType;
        const edit_id: string = req.params.edit_id;
        const image_id: string = req.params.image_id;
        const bucketName: string = req.params.bucket_name;
        const imageName = `${bucketName}/${image_id}`

        try {
            const deleteImage: boolean = await this.fundRaiserService.deleteImage(edit_id, type, imageName)
            if (deleteImage) {
                res.status(200).json({ status: true, msg: "Image delete success" })
            } else {
                res.status(500).json({ status: false, msg: "Something went wrong" })
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({ status: false, msg: "Something went wrong" })
        }
    }

    async closeFundRaise(req: CustomRequest, res: Response): Promise<void> {

        try {
            const fund_id: string = req.params.edit_id;

            const closePost: HelperFuncationResponse = await this.fundRaiserService.closeFundRaiser(fund_id);
            res.status(closePost.statusCode).json({ status: closePost.status, msg: closePost.msg })
        } catch (e) {
            res.status(500).json({ status: false, msg: "Internal server error" })
        }
    }

    async uploadImage(req: Request, res: Response): Promise<void> {

        try {


            console.log(req.body);


            let imagesPresignedUrl: string[] = req.body.presigned_url;
            const fundRaiserID: string = req.params.edit_id;


            console.log(imagesPresignedUrl);


            if (imagesPresignedUrl.length) {
                const edit_type: FundRaiserFileType = req.body.image_type;

                console.log("Image type is :" + edit_type);


                const saveFundRaise: HelperFuncationResponse = await this.fundRaiserService.uploadImage(imagesPresignedUrl, fundRaiserID, edit_type)

                res.status(saveFundRaise.statusCode).json({
                    status: saveFundRaise.status,
                    msg: saveFundRaise.msg,
                    data: {
                        picture: saveFundRaise.data?.picture,
                        documents: saveFundRaise.data?.documents
                    }
                })
            } else {
                res.status(StatusCode.BAD_REQUESR).json({ status: false, msg: "Please provid valid images" })
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({
                status: false,
                msg: "Internal Server Error"
            })
        }

    }

    async editFundRaise(req: Request, res: Response): Promise<void> {
        try {

            const edit_id: string = req.params.edit_id;
            const body: IEditableFundRaiser = req.body;

            const editResponse: boolean = await this.fundRaiserRepo.updateFundRaiser(edit_id, body);
            if (editResponse) {
                res.status(200).json({ status: true, msg: "Updated success" })
            } else {
                res.status(500).json({ status: false, msg: "Internal server error" })
            }
        } catch (e) {
            res.status(500).json({ status: true, msg: "Internal server error" })
        }
    }

    async createFundRaise(req: CustomRequest, res: Response): Promise<void> {

        try {

            const bodyData = req.body;
            const utilHelper = new UtilHelper();
            const amount: number = bodyData.amount;
            const category: string = bodyData.category;
            const sub_category: string = bodyData.sub_category;
            const phone_number: number = bodyData.phone_number;
            const email: string = bodyData.email;
            const otpNumber: number = utilHelper.generateAnOTP(const_data.OTP_LENGTH);
            const otpExpire: number = const_data.OTP_EXPIRE_TIME;
            const todayDate: Date = new Date();
            const user_id: string | undefined = req.context?.user_id;
            const fund_id: string = utilHelper.createFundRaiseID(FundRaiserCreatedBy.USER).toUpperCase()

            if (user_id && fund_id) {

                const fundRaiseData: IFundRaiseInitialData = {
                    validate: {
                        otp: otpNumber,
                        otp_expired: otpExpire
                    },
                    created_date: todayDate,
                    created_by: FundRaiserCreatedBy.USER,
                    user_id,
                    fund_id,
                    amount,
                    category,
                    sub_category,
                    phone_number,
                    email_id: email,
                    status: FundRaiserStatus.CREATED
                }

                const createFundRaise: HelperFuncationResponse = await this.fundRaiserService.createFundRaisePost(fundRaiseData);
                if (createFundRaise.status) {
                    res.status(createFundRaise.statusCode).json({ status: true, msg: createFundRaise.msg, data: createFundRaise.data })
                } else {
                    res.status(createFundRaise.statusCode).json({ status: false, msg: createFundRaise.msg })
                }
            } else {
                res.status(401).json({
                    status: false,
                    msg: "Unauthorized access"
                })
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({
                status: false,
                msg: "Internal Servor Error"
            })
        }
    }

    async getActiveFundRaise(req: Request, res: Response): Promise<void> {


        try {

            const limit: number = Number(req.params.limit);
            const page: number = Number(req.params.page);
            const getLimitedData: iFundRaiseModel[] = await this.fundRaiserRepo.getActiveFundRaiserPost(page, limit)

            if (getLimitedData?.length) {
                res.status(200).json({ status: true, data: getLimitedData })
            } else {
                console.log("This works");
                res.status(400).json({ status: false, msg: "No data found" })
            }
        } catch (e) {
            res.status(500).json({ status: false, msg: "Internal Server Error" })
        }
    }

    async getSingleProfile(req: Request, res: Response): Promise<void> {

        try {

            const profile_id: string = req.params.profile_id;

            const profile: iFundRaiseModel | null = await this.fundRaiserRepo.getRestrictedFundRaisePost(profile_id);
            if (profile) {
                res.status(200).json({ status: true, data: profile })
            } else {
                res.status(400).json({ status: false, msg: "Profile not found" })
            }
        } catch (e) {
            res.status(500).json({ status: false, msg: "Internal Server Error" })
        }
    }
}


export default UserController
