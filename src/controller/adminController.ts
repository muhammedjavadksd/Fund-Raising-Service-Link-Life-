import { Request, Response } from "express";
import { IAdminAddFundRaiser, IEditableFundRaiser, IFundRaise, IFundRaiseInitialData, iFundRaiseModel } from "../types/Interface/IDBmodel";
import { FundRaiserCreatedBy, FundRaiserStatus } from "../types/Enums/DbEnum";
import FundRaiserRepo from "../repositorys/FundRaiserRepo";
import { HelperFuncationResponse, IPaginatedResponse } from "../types/Interface/Util";
import FundRaiserService from "../services/FundRaiserService";
import UtilHelper from "../util/helper/utilHelper";
import { IAdminController } from "../types/Interface/IController";
import { FundRaiserBankAccountType, FundRaiserCategory, FundRaiserFileType, StatusCode } from "../types/Enums/UtilEnum";
import { File } from "node:buffer";
import DonationService from "../services/DonationService";
import { CustomRequest } from "../types/DataType/Objects";

class AdminController implements IAdminController {

    private readonly fundRaiserRepo;
    private readonly fundRaiserService;
    private readonly donationService;


    constructor() {
        this.getAllFundRaise = this.getAllFundRaise.bind(this)
        this.getSingleProfile = this.getSingleProfile.bind(this)
        this.editFundRaiser = this.editFundRaiser.bind(this)
        this.addFundRaiser = this.addFundRaiser.bind(this)
        this.updateStatus = this.updateStatus.bind(this)
        this.closeFundRaiser = this.closeFundRaiser.bind(this)
        this.getStatitics = this.getStatitics.bind(this)
        this.presignedUrl = this.presignedUrl.bind(this)
        this.uploadImages = this.uploadImages.bind(this)

        this.fundRaiserRepo = new FundRaiserRepo();
        this.fundRaiserService = new FundRaiserService();
        this.donationService = new DonationService()
    }


    async getStatitics(req: Request, res: Response): Promise<void> {
        const findStatitics = await this.donationService.getStatitics()
        res.status(findStatitics.statusCode).json({ status: findStatitics.status, msg: findStatitics.msg, data: findStatitics.data });
    }



    async viewDonationHistory(req: Request, res: Response): Promise<void> {

        const profile_id: string = req.params.profile_id;
        const page: number = +req.params.page;
        const limit: number = +req.params.limit;

        const donationHistory = await this.donationService.findPrivateProfileHistoryPaginated(profile_id, limit, page);
        res.status(donationHistory.statusCode).json({ status: donationHistory.status, msg: donationHistory.msg, data: donationHistory.data });
    }

    async presignedUrl(req: Request, res: Response): Promise<void> {

        const type: FundRaiserFileType = req.query.type as FundRaiserFileType;
        const presignedUrl = await this.fundRaiserService.createPresignedUrl(type)
        res.status(presignedUrl.statusCode).json({ status: presignedUrl.status, msg: presignedUrl.msg, data: presignedUrl.data });
    }

    async uploadImages(req: Request, res: Response): Promise<void> {

        const image: string[] = req.body.image
        const fund_id: string = req.params.edit_id
        const type: FundRaiserFileType = req.body.type

        console.log("The images");

        console.log(image);


        const uploadImage = await this.fundRaiserService.uploadImage(image, fund_id, type);
        res.status(uploadImage.statusCode).json({ status: uploadImage.status, msg: uploadImage.msg, data: uploadImage.data });
    }

    async getAllFundRaise(req: Request, res: Response): Promise<void> {
        console.log("Reached here");


        try {

            const limit: number = Number(req.params.limit);
            const page: number = Number(req.params.page);
            const status: FundRaiserStatus = req.params.status as FundRaiserStatus;
            let filter: Record<string, any> = {};

            if (req.query.sub_category) {
                filter['sub_category'] = req.query.sub_category
            }
            if (req.query.category) {
                filter['category'] = req.query.category
            }
            if (req.query.urgency) {
                filter['urgency'] = req.query.urgency == "urgent"
            }
            if (req.query.state) {
                filter['state'] = req.query.state
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
            const fundRaisersPost: IPaginatedResponse<iFundRaiseModel> = await this.fundRaiserRepo.getAllFundRaiserPost(page, limit, status, filter)

            if (fundRaisersPost?.paginated.length) {
                res.status(StatusCode.OK).json({
                    status: true,
                    data: fundRaisersPost
                })
            } else {
                res.status(StatusCode.NOT_FOUND).json({ status: false, msg: "No data found" })
            }
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json({ status: false, msg: "Internal Server Error" })
        }
    }

    async getSingleProfile(req: Request, res: Response): Promise<void> {

        try {

            const profile_id: string = req.params.profile_id;
            const profile: iFundRaiseModel | null = await this.fundRaiserRepo.findFundPostByFundId(profile_id);


            if (profile) {
                res.status(StatusCode.OK).json({ status: true, msg: "Profile found", data: profile })
            } else {
                res.status(StatusCode.NOT_FOUND).json({ status: false, msg: "Profile not found" })
            }
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json({ status: false, msg: "Internal Server Error" })
        }
    }


    async editFundRaiser(req: Request, res: Response): Promise<void> {
        try {

            const fund_id: string = req.params.edit_id;
            const edit_data: IEditableFundRaiser = req.body.edit_data;


            const updateFundRaiser: HelperFuncationResponse = await this.fundRaiserService.editFundRaiser(fund_id, edit_data);
            console.log("This worked");

            res.status(updateFundRaiser.statusCode).json({
                status: updateFundRaiser.status,
                msg: updateFundRaiser.msg
            })
        } catch (e) {
            console.log(e);

            res.status(500).json({
                status: false,
                msg: "Something went wrong"
            })
        }
    }

    addFundRaiser(req: CustomRequest, res: Response): void {
        try {

            const amount: number = req.body.amount;
            const category: FundRaiserCategory = req.body.category;
            const sub_category: string = req.body.sub_category;
            const phone_number: number = req.body.phone_number;
            const email_id: string = req.body.email_id;
            const about: string = req.body.about;
            const benificiary_relation: string = req.body.benificiary_relation;
            const city: string = req.body.city;
            const deadline: Date = req.body.deadline;
            const description: string = req.body.description;
            const district: string = req.body.district;
            const fullAddress: string = req.body.fullAddress;
            const pinCode: string = req.body.pinCode;
            const raiser_age: number = req.body.raiser_age;
            const raiser_name: string = req.body.raiser_name;
            const state: string = req.body.state;


            console.log("User ID");

            console.log(req.context?.user_id);

            const utilHelper = new UtilHelper();

            const fundID: string = utilHelper.createFundRaiseID(FundRaiserCreatedBy.ADMIN).toUpperCase()
            const createdDate: Date = new Date()
            const fundRaiserData: IAdminAddFundRaiser = {
                created_by: FundRaiserCreatedBy.ADMIN,
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
                status: FundRaiserStatus.INITIATED,
                sub_category
            }

            this.fundRaiserService.createFundRaisePost(fundRaiserData).then(async (data) => {
                res.status(data.statusCode).json({ status: true, msg: data.msg, data: data.data })
            }).catch((err) => {
                res.status(500).json({ status: false, msg: "Interanl server error", })
            })
        } catch (e) {
            console.log(e);
            res.status(500).json({ status: false, msg: "Interanl server error", })
        }
    }

    async updateStatus(req: Request, res: Response): Promise<void> {

        try {

            const fund_id: string = req.params.edit_id;
            const newStatus: FundRaiserStatus = req.body.status;

            const updateStatus: HelperFuncationResponse = await this.fundRaiserService.updateStatus(fund_id, newStatus);
            res.status(updateStatus.statusCode).json({ status: updateStatus.status, msg: updateStatus.msg })
        } catch (e) {
            res.status(500).json({ status: false, msg: "Internal server error" })
        }
    }

    async closeFundRaiser(req: Request, res: Response): Promise<void> {

        try {
            const fund_id: string = req.params.edit_id;
            const closeFundRaiser: HelperFuncationResponse = await this.fundRaiserService.closeFundRaiser(fund_id);
            res.status(closeFundRaiser.statusCode).json({ status: closeFundRaiser.status, msg: closeFundRaiser.msg })
        } catch (e) {
            res.status(500).json({ status: false, msg: "Internal server error" })
        }
    }
}


export { AdminController }