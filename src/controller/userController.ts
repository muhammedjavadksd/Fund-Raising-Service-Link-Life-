import { Request, Response } from "express";
import FundRaiserService from "../services/FundRaiserService";
import { CustomRequest } from "../types/DataType/Objects";
import { FundRaiserCreatedBy, FundRaiserStatus } from "../types/Enums/DbEnum";
import { HelperFuncationResponse, ICloseFundRaiseJwtToken, IPaginatedResponse, IVerifyPaymentResponse } from "../types/Interface/Util";
import { IEditableFundRaiser, IFundRaise, IFundRaiseInitialData, iFundRaiseModel } from "../types/Interface/IDBmodel";
import { FundRaiserFileType, JwtTimer, JwtType, StatusCode } from "../types/Enums/UtilEnum";
import FundRaiserRepo from "../repositorys/FundRaiserRepo";
import UtilHelper from "../util/helper/utilHelper";
import { BucketsOnS3, const_data } from "../types/Enums/ConstData";
import { IUserController } from "../types/Interface/IController";
import { UploadedFile } from "express-fileupload";
import S3BucketHelper from "../util/helper/s3Bucket";
import url from 'url'
import CommentService from "../services/CommentService";
import TokenHelper from "../util/helper/tokenHelper";
import DonationService from "../services/DonationService";

class UserController implements IUserController {

    private readonly fundRaiserService;
    private readonly commentService;
    private readonly fundRaiserRepo;
    private readonly donationService;

    constructor() {

        this.getUserFundRaisePost = this.getUserFundRaisePost.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
        this.closeFundRaise = this.closeFundRaise.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.editFundRaise = this.editFundRaise.bind(this);
        this.createFundRaise = this.createFundRaise.bind(this);
        this.getActiveFundRaise = this.getActiveFundRaise.bind(this);
        this.getSingleProfile = this.getSingleProfile.bind(this);
        this.addComment = this.addComment.bind(this);
        this.getPaginatedComments = this.getPaginatedComments.bind(this);
        this.editComment = this.editComment.bind(this)
        this.deleteComment = this.deleteComment.bind(this)
        this.categoryFundRaiserPaginated = this.categoryFundRaiserPaginated.bind(this);
        this.verifyCloseToken = this.verifyCloseToken.bind(this)
        this.payToFundRaiser = this.payToFundRaiser.bind(this)
        this.verifyPayment = this.verifyPayment.bind(this)
        this.fundRaiserService = new FundRaiserService();
        this.commentService = new CommentService();
        this.fundRaiserRepo = new FundRaiserRepo();
        this.donationService = new DonationService()
    }


    async payToFundRaiser(req: CustomRequest, res: Response): Promise<void> {

        const full_name = req.body.full_name;
        const phone_number = req.body.phone_number;
        const email_id = req.body.email_id;
        const amount = req.body.amount;
        const fund_id = req.params.fund_id;
        const context = req.context
        const hide_profile = req.body.hide_profile

        if (context && context.profile_id) {
            const profile_id = context.profile_id
            const createOrder = await this.donationService.creatOrder(profile_id, full_name, phone_number, email_id, amount, fund_id, hide_profile);
            res.status(createOrder.statusCode).json({ status: createOrder.status, msg: createOrder.msg, data: createOrder.data })
        } else {
            res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Un authrazied access", })
        }
    }


    async verifyPayment(req: Request, res: Response): Promise<void> {

        const verifyBody: IVerifyPaymentResponse = req.body
        const verifyPayment = await this.donationService.verifyPayment(verifyBody.order_id);
        res.status(verifyPayment.statusCode).json({ status: verifyPayment.status, msg: verifyPayment.msg, data: verifyPayment.data })
    }

    async verifyCloseToken(req: Request, res: Response): Promise<void> {
        const headers = req.headers;
        const authToken = headers.authorization;
        if (authToken) {
            const splitToken = authToken.split(" ")
            const token = splitToken[1];
            if (splitToken[0] == "Bearer" && token) {
                const closeFundRaiser = await this.fundRaiserService.closeFundRaiserVerification(token);
                res.status(closeFundRaiser.statusCode).json({ status: closeFundRaiser.status, msg: closeFundRaiser.msg })
                return
            }
        }
        res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Un authrazied access" })
    }


    async categoryFundRaiserPaginated(req: Request, res: Response): Promise<void> {

        const category = req.params.category;
        const page: number = +req.params.page
        const limit: number = +req.params.limit
        const skip: number = (page - 1) * limit;

        let filter: Record<string, any> = {};
        if (req.query.sub_category) {
            filter['sub_category'] = req.query.sub_category
        }
        if (req.query.urgency) {
            filter['urgency'] = req.query.urgency == "urgent"
        }
        if (req.query.state) {
            filter['state'] = req.query.state
        }
        if (req.query.min) {
            filter['min'] = req.query.min
        }
        if (req.query.max) {
            filter['max'] = req.query.max
        }



        const findProfile = await this.fundRaiserService.paginatedFundRaiserByCategory(category, limit, skip, filter);
        res.status(findProfile.statusCode).json({ status: findProfile.status, msg: findProfile.msg, data: findProfile.data })
    }

    async editComment(req: Request, res: Response): Promise<void> {

        const newComment = req.body.new_comment;
        const comment_id = req.params.comment_id;

        const editComment = await this.commentService.editComment(newComment, comment_id);
        res.status(editComment.statusCode).json({ status: editComment.status, msg: editComment.msg, data: editComment.data })
    }

    async deleteComment(req: Request, res: Response): Promise<void> {
        const comment_id: string = req.params.comment_id;
        const deleteComment = await this.commentService.deleteComment(comment_id);
        res.status(deleteComment.statusCode).json({ status: deleteComment.status, msg: deleteComment.msg, data: deleteComment.data })
    }

    async getPaginatedComments(req: Request, res: Response): Promise<void> {

        const page: number = +req.params.page;
        const limit: number = +req.params.limit;
        const fund_id: string = req.params.fund_id;

        const skip = (page - 1) * limit;
        console.log(skip, page, limit);
        console.log(req.params);



        const findComment = await this.commentService.getPaginatedComments(fund_id, skip, limit);
        res.status(findComment.statusCode).json({ status: findComment.status, msg: findComment.msg, data: findComment.data })
    }

    async addComment(req: CustomRequest, res: Response): Promise<void> {
        //add comment controller
        const comment = req.body.comment;
        const post_id = req.params.post_id;
        const user_name = req?.context?.full_name;
        const user_id = req?.context?.profile_id;
        const mention = req.body.mention;
        const replay_id = req.body.replay_id;

        const saveComment = await this.commentService.addComment(comment, post_id, user_id, user_name, mention, replay_id);
        res.status(saveComment.statusCode).json({ status: saveComment.status, msg: saveComment.msg, data: saveComment.data })
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

        const limit: number = +req.params.limit;
        const page: number = +req.params.page;
        const skip = (page - 1) * limit

        console.log("The limit is");
        console.log(limit);



        try {

            const user_id: string = req.context?.user_id;
            console.log(user_id);

            if (user_id) {
                const getMyFundRaisePost: HelperFuncationResponse = await this.fundRaiserService.getOwnerFundRaise(user_id, limit, skip);
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
            console.log("the body");

            console.log(body);


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


        console.log(req.params);

        try {

            const limit: number = Number(req.params.limit);
            const page: number = Number(req.params.page);
            const getLimitedData: IPaginatedResponse<IFundRaise[]> = await this.fundRaiserRepo.getActiveFundRaiserPost(page, limit, {})

            if (getLimitedData?.total_records) {
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
            const isForce = req.query.isForce;
            let profile: iFundRaiseModel | null;
            if (isForce) {
                profile = await this.fundRaiserRepo.findFundPostByFundId(profile_id);
            } else {
                profile = await this.fundRaiserRepo.getRestrictedFundRaisePost(profile_id);
            }
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
