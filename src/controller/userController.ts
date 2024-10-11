import { Request, Response } from "express";
import FundRaiserService from "../services/FundRaiserService";
import { BankAccountType, FundRaiserCreatedBy, FundRaiserStatus } from "../types/Enums/DbEnum";
import { CustomRequest, HelperFuncationResponse, IPaginatedResponse, IVerifyPaymentResponse } from "../types/Interface/Util";
import { IEditableFundRaiser, IFundRaise, IFundRaiseInitialData, iFundRaiseModel } from "../types/Interface/IDBmodel";
import { FundRaiserFileType, PaymentVia, StatusCode } from "../types/Enums/UtilEnum";
import FundRaiserRepo from "../repositorys/FundRaiserRepo";
import UtilHelper from "../util/helper/utilHelper";
import { const_data } from "../types/Enums/ConstData";
import CommentService from "../services/CommentService";
import DonationService from "../services/DonationService";
import BankAccountService from "../services/BankAccountService";
import DonationRepo from "../repositorys/DonationRepo";
import { IUserController } from "../types/Interface/MethodImplimentetion";

class UserController implements IUserController {

    private readonly fundRaiserService;
    private readonly commentService;
    private readonly fundRaiserRepo;
    private readonly donationService;
    private readonly bankAccountService;
    private readonly donationRepo;

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
        this.donationHistory = this.donationHistory.bind(this)
        this.myDonationHistory = this.myDonationHistory.bind(this)
        this.findPaymentOrder = this.findPaymentOrder.bind(this)
        this.getPresignedUrl = this.getPresignedUrl.bind(this)
        this.addBankAccount = this.addBankAccount.bind(this)
        this.getBankAccounts = this.getBankAccounts.bind(this)
        this.profileBankAccounts = this.profileBankAccounts.bind(this)
        this.getDonationStatitics = this.getDonationStatitics.bind(this)
        this.deleteBankAccount = this.deleteBankAccount.bind(this)
        this.getActiveBankAccounts = this.getActiveBankAccounts.bind(this)
        this.activeBankAccount = this.activeBankAccount.bind(this)
        this.fundRaiserService = new FundRaiserService();
        this.commentService = new CommentService();
        this.fundRaiserRepo = new FundRaiserRepo();
        this.donationRepo = new DonationRepo()
        this.donationService = new DonationService()
        this.bankAccountService = new BankAccountService()
    }


    async activeBankAccount(req: CustomRequest, res: Response): Promise<void> {
        const fundId: string = req.params.edit_id;
        const benfId: string = req.params.benf_id;

        const activeAccount = await this.bankAccountService.activeBankAccount(fundId, benfId);
        res.status(activeAccount.statusCode).json({ status: activeAccount.status, msg: activeAccount.msg, data: activeAccount.data })
    }


    async getActiveBankAccounts(req: CustomRequest, res: Response): Promise<void> {
        const fundId = req.params.edit_id
        const page: number = +req.params.page;
        const limit: number = +req.params.limit;

        const findAllBenificiary = await this.bankAccountService.getAllBankAccount(fundId, page, limit, true);
        res.status(findAllBenificiary.statusCode).json({ status: findAllBenificiary.status, msg: findAllBenificiary.msg, data: findAllBenificiary.data })
    }


    async deleteBankAccount(req: CustomRequest, res: Response): Promise<void> {

        const fundId = req.params.edit_id;
        const benfId = req.params.benf_id;

        const deleteBenf = await this.bankAccountService.deleteAccount(benfId, fundId);
        res.status(deleteBenf.statusCode).json({ status: deleteBenf.status, msg: deleteBenf.msg, data: deleteBenf.data })
    }

    async getDonationStatitics(req: CustomRequest, res: Response): Promise<void> {
        const dateFrom = new Date(req.query.from_date?.toString() || new Date());
        const dateTo = new Date(req.query.to_date?.toString() || new Date());
        const fund_id = req.params.fund_id;

        if (dateFrom == null || dateTo == null) {
            res.status(StatusCode.BAD_REQUESR).json({ status: false, msg: "Please provide valid date" })
        } else {
            const findStatitics = await this.donationRepo.donationStatitics(dateFrom, dateTo, fund_id);

            if (findStatitics) {
                res.status(StatusCode.OK).json({ status: true, msg: "Data found", data: findStatitics })
            } else {
                res.status(StatusCode.NOT_FOUND).json({ status: false, msg: "No data found", })
            }
        }
    }

    async profileBankAccounts(req: CustomRequest, res: Response): Promise<void> {
        const fundId: string = req.params.edit_id;
        const page: number = +req.params.page;
        const limit: number = +req.params.limit;

        const findAllBenificiary = await this.bankAccountService.getActiveBankAccount(fundId, page, limit);
        res.status(findAllBenificiary.statusCode).json({ status: findAllBenificiary.status, msg: findAllBenificiary.msg, data: findAllBenificiary.data })

    }

    async getBankAccounts(req: CustomRequest, res: Response): Promise<void> {

        const fundId: string = req.params.edit_id;
        const page: number = +req.params.page;
        const limit: number = +req.params.limit;

        const findAllBenificiary = await this.bankAccountService.getAllBankAccount(fundId, page, limit, false);
        res.status(findAllBenificiary.statusCode).json({ status: findAllBenificiary.status, msg: findAllBenificiary.msg, data: findAllBenificiary.data })
    }


    async addBankAccount(req: CustomRequest, res: Response): Promise<void> {
        const accountNumber: number = req.body.account_number
        const ifsc_code: string = req.body.ifsc_code
        const holderName: string = req.body.holder_name
        const accountType: BankAccountType = req.body.account_type
        const fund_id: string = req.params.edit_id

        const addBankAccount = await this.bankAccountService.addBankAccount(accountNumber, ifsc_code, holderName, accountType, fund_id);
        res.status(addBankAccount.statusCode).json({ status: addBankAccount.status, msg: addBankAccount.msg, data: addBankAccount.data });
    }

    async findPaymentOrder(req: CustomRequest, res: Response): Promise<void> {

        const order_id: string = req.params.order_id;
        const profile_id: string = req.context?.profile_id

        const findOrder = await this.donationService.findDonationByOrderId(order_id, profile_id);
        res.status(findOrder.statusCode).json({ status: findOrder.status, msg: findOrder.msg, data: findOrder.data })

    }

    async myDonationHistory(req: CustomRequest, res: Response): Promise<void> {
        const page: number = +req.params.page
        const limit: number = +req.params.limit
        const profile_id: string = req.context?.profile_id
        if (profile_id) {
            const findProfile = await this.donationService.findMyDonationHistory(profile_id, limit, page);
            res.status(findProfile.statusCode).json({ status: findProfile.status, msg: findProfile.msg, data: findProfile.data })
        } else {
            res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Un Authraized access", })
        }
    }


    async donationHistory(req: Request, res: Response): Promise<void> {
        const profile_id: string = req.params.fund_id;
        const limit: number = +req.params.limit;
        const page: number = +req.params.page;

        const findProfile = await this.donationService.findPrivateProfileHistoryPaginated(profile_id, limit, page);
        res.status(findProfile.statusCode).json({ status: findProfile.status, msg: findProfile.msg, data: findProfile.data })
    }


    async payToFundRaiser(req: CustomRequest, res: Response): Promise<void> {

        const full_name: string = req.body.full_name;
        const phone_number: number = req.body.phone_number;
        const email_id: string = req.body.email_id;
        const amount: number = req.body.amount;
        const fund_id: string = req.params.fund_id;
        const context = req.context
        const hide_profile: boolean = req.body.hide_profile
        const paymentVia: PaymentVia = req.body.type

        const profile_id = context?.profile_id
        const createOrder = await this.donationService.creatOrder(profile_id, full_name, phone_number, email_id, amount, fund_id, hide_profile, paymentVia);
        res.status(createOrder.statusCode).json({ status: createOrder.status, msg: createOrder.msg, data: createOrder.data })

    }


    async verifyPayment(req: Request, res: Response): Promise<void> {
        const verifyBody: IVerifyPaymentResponse = req.body
        const verifyPayment = await this.donationService.verifyPayment(verifyBody?.data?.order?.order_id);
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


    async getPresignedUrl(req: Request, res: Response) {
        const type: FundRaiserFileType = req.query.type as FundRaiserFileType;
        const image = await this.fundRaiserService.createPresignedUrl(type);
        res.status(image.statusCode).json({ status: image.status, msg: image.msg, data: image.data })
    }

    async getUserFundRaisePost(req: CustomRequest, res: Response): Promise<void> {

        const limit: number = +req.params.limit;
        const page: number = +req.params.page;
        const status: FundRaiserStatus = req.params.status as FundRaiserStatus;
        const skip = (page - 1) * limit

        try {
            const user_id: string = req.context?.user_id;

            if (user_id) {
                const getMyFundRaisePost: HelperFuncationResponse = await this.fundRaiserService.getOwnerFundRaise(user_id, limit, skip, status);
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
        const imageName: string = req.query.image_id?.toString() || "";

        try {
            const deleteImage: HelperFuncationResponse = await this.fundRaiserService.deleteImage(edit_id, type, imageName)
            res.status(200).json({ status: deleteImage.status, msg: deleteImage.msg, data: deleteImage.data })
        } catch (e) {
            console.log(e);
            res.status(500).json({ status: false, msg: "Something went wrong" })
        }
    }

    async closeFundRaise(req: CustomRequest, res: Response): Promise<void> {

        try {
            const fund_id: string = req.params.edit_id;
            const closePost: HelperFuncationResponse = await this.fundRaiserService.closeFundRaiser(fund_id, true);
            res.status(closePost.statusCode).json({ status: closePost.status, msg: closePost.msg })
        } catch (e) {
            res.status(500).json({ status: false, msg: "Internal server error" })
        }
    }

    async uploadImage(req: Request, res: Response): Promise<void> {

        try {
            let imagesPresignedUrl: string[] = req.body.presigned_url;
            const fundRaiserID: string = req.params.edit_id;
            if (imagesPresignedUrl.length) {
                const edit_type: FundRaiserFileType = req.body.image_type;
                const saveFundRaise: HelperFuncationResponse = await this.fundRaiserService.uploadImage(imagesPresignedUrl, fundRaiserID, edit_type)
                console.log(saveFundRaise)
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
            res.status(500).json({
                status: false,
                msg: "Internal Server Error"
            })
        }
    }

    async editFundRaise(req: Request, res: Response): Promise<void> {
        const edit_id: string = req.params.edit_id;
        const body: IEditableFundRaiser = req.body;

        const editResponse: HelperFuncationResponse = await this.fundRaiserService.editFundRaiser(edit_id, body);
        console.log(editResponse);

        res.status(editResponse.statusCode).json({ status: editResponse.status, msg: editResponse.msg })
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
                    created_date: new Date(),
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
            const getLimitedData: IPaginatedResponse<IFundRaise[]> = await this.fundRaiserRepo.getActiveFundRaiserPost(page, limit, {})

            if (getLimitedData?.total_records) {
                res.status(StatusCode.OK).json({ status: true, data: getLimitedData })
            } else {
                console.log("This works");
                res.status(StatusCode.NOT_FOUND).json({ status: false, msg: "No data found" })
            }
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json({ status: false, msg: "Internal Server Error" })
        }
    }

    async getSingleProfile(req: CustomRequest, res: Response): Promise<void> {

        try {

            const fund_id: string = req.params.profile_id;
            const user_id: string = req.context?.user_id;
            const isForce = req.query.isForce;
            const profile: iFundRaiseModel | null = await this.fundRaiserRepo.findFundPostByFundId(fund_id);

            if (profile) {
                if (isForce && user_id) {
                    if (profile?.user_id != user_id) {
                        res.status(StatusCode.NOT_FOUND).json({ status: false, msg: "Profile not found" })
                        return;
                    } else {
                        res.status(StatusCode.OK).json({ status: true, data: profile })
                        return
                    }
                } else {
                    if (profile.closed || profile.status != FundRaiserStatus.APPROVED) {
                        res.status(StatusCode.FORBIDDEN).json({ status: false, msg: "This profile no longer requires contributions" })
                        return
                    } else {
                        res.status(StatusCode.OK).json({ status: true, data: profile })
                    }
                }
            } else {
                res.status(StatusCode.NOT_FOUND).json({ status: false, msg: "Profile not found" })
            }
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json({ status: false, msg: "Internal Server Error" })
        }
    }
}


export default UserController
