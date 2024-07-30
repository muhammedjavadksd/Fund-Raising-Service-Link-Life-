import { Request, Response } from "express";
import FundRaiserService from "../services/FundRaiserService";
import { CustomRequest } from "../types/DataType/Objects";
import { FundRaiserCreatedBy, FundRaiserStatus } from "../types/Enums/DbEnum";
import { HelperFuncationResponse } from "../types/Interface/Util";
import { IEditableFundRaiser, IFundRaiseInitialData, iFundRaiseModel } from "../types/Interface/IDBmodel";
import { FundRaiserFileType } from "../types/Enums/UtilEnum";
import FundRaiserRepo from "../repositorys/FundRaiserRepo";
import UtilHelper from "../util/helper/utilHelper";
import { const_data } from "../types/Enums/ConstData";
import { IUserController } from "../types/Interface/IController";
import { UploadedFile } from "express-fileupload";

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
            const fund_id: string = req.params.edit_id;

            const closePost: HelperFuncationResponse = await this.fundRaiserService.closeFundRaiser(fund_id);
            res.status(closePost.statusCode).json({ status: closePost.status, msg: closePost.msg })
        } catch (e) {
            res.status(500).json({ status: false, msg: "Internal server error" })
        }
    }

    async uploadImage(req: Request, res: Response): Promise<void> {

        try {


            const body_file = req.files;
            const files: UploadedFile[] = [];
            if (typeof body_file == 'object' && body_file) {
                Object.keys(body_file).forEach((each) => {
                    const file = body_file[each];
                    if (Array.isArray(file)) {
                        files.push(...file);
                    } else {
                        files.push(file);
                    }
                })


                console.log(req.files);
                console.log(req.body);



                if (files.length) {
                    const fundRaiserID: string = req.params.edit_id;
                    const edit_type: FundRaiserFileType = req.body.image_type;

                    const saveFundRaise: HelperFuncationResponse = await this.fundRaiserService.uploadImage(files, fundRaiserID, edit_type)




                    res.status(saveFundRaise.statusCode).json({
                        status: saveFundRaise.status,
                        msg: saveFundRaise.msg,
                        data: {
                            picture: saveFundRaise.data?.picture,
                            documents: saveFundRaise.data?.documents
                        }
                    })
                } else {
                    res.status(400).json({
                        status: false,
                        msg: "Please provide valid files"
                    })
                }
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

            console.log(bodyData);


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


            console.log(fund_id);
            console.log(req.context);


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

                console.log(fundRaiseData);

                const createFundRaise: HelperFuncationResponse = await this.fundRaiserService.createFundRaisePost(fundRaiseData);
                if (createFundRaise.status) {
                    res.status(createFundRaise.statusCode).json({ status: true, msg: createFundRaise.msg, data: { id: createFundRaise.data?.id, fund_id: createFundRaise.data.fund_id } })
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
