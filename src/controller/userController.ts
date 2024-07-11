import { Request, Response } from "express";
import FundRaiserService from "../services/FundRaiserService";
import { CustomRequest } from "../types/DataType/Objects";
import { FundRaiserCreatedBy } from "../types/Enums/DbEnum";
import { HelperFuncationResponse } from "../types/Interface/Util";
import { IEditableFundRaiser, IFundRaiseInitialData, iFundRaiseModel } from "../types/Interface/IDBmodel";
import { FundRaiserFileType } from "../types/Enums/UtilEnum";
import FundRaiserRepo from "../repositorys/FundRaiserRepo";
import UtilHelper from "../util/helper/utilHelper";
import { const_data } from "../types/Enums/ConstData";
import { IUserController } from "../types/Interface/IController";

class UserController implements IUserController {

    private readonly fundRaiserService;
    private readonly fundRaiserRepo;

    constructor() {
        this.fundRaiserService = new FundRaiserService();
        this.fundRaiserRepo = new FundRaiserRepo();
    }

    async getUserFundRaisePost(req: CustomRequest, res: Response): Promise<void> {

        try {

            const user_id: string = req.context?.user_id;
            if (user_id) {
                const getMyFundRaisePost: HelperFuncationResponse = await this.fundRaiserService.getOwnerFundRaise(user_id, FundRaiserCreatedBy.USER);
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

        try {
            const deleteImage: boolean = await this.fundRaiserService.deleteImage(edit_id, type, image_id)
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
            const fund_id: string = req.params.fund_id;

            const closePost: HelperFuncationResponse = await this.fundRaiserService.closeFundRaiser(fund_id);
            res.status(closePost.statusCode).json({ status: closePost.status, msg: closePost.msg })
        } catch (e) {
            res.status(500).json({ status: false, msg: "Internal server error" })
        }
    }

    async uploadImage(req: Request, res: Response): Promise<void> {

        try {


            let file: Express.Multer.File[] | undefined;
            if (Array.isArray(req.files)) {
                file = req.files;
            } else if (req.files && typeof req.files == "object") {
                file = Object.values(req.files).flat() as unknown as Express.Multer.File[]
            } else {
                file = undefined;
            }

            if (file) {
                const fundRaiserID: string = req.params.fund_id;
                const edit_type: FundRaiserFileType = req.body.edit_type;

                const saveFundRaise: HelperFuncationResponse = await this.fundRaiserService.uploadImage(file, fundRaiserID, edit_type)
                res.status(saveFundRaise.statusCode).json({
                    status: saveFundRaise.status,
                    msg: saveFundRaise.msg
                })
            } else {
                res.status(400).json({
                    status: false,
                    msg: "Please provide valid files"
                })
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
            const fund_id: string = utilHelper.createFundRaiseID("USER").toUpperCase()

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
                }

                console.log(fundRaiseData);

                const createFundRaise: HelperFuncationResponse = await this.fundRaiserService.createFundRaisePost(fundRaiseData);
                if (createFundRaise.status) {
                    res.status(createFundRaise.statusCode).json({ status: true, msg: createFundRaise.msg, data: { id: createFundRaise.data?.id } })
                } else {
                    res.status(createFundRaise.statusCode).json({ status: false, msg: createFundRaise.msg })
                }
            } else {
                res.status(500).json({
                    status: false,
                    msg: "Internal Servor Error"
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
