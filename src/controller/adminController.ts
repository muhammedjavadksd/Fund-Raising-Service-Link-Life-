import { Request, Response } from "express";
import { IEditableFundRaiser, IFundRaise, IFundRaiseInitialData, iFundRaiseModel } from "../types/Interface/IDBmodel";
import { FundRaiserCreatedBy, FundRaiserStatus } from "../types/Enums/DbEnum";
import FundRaiserRepo from "../repositorys/FundRaiserRepo";
import { HelperFuncationResponse, IPaginatedResponse } from "../types/Interface/Util";
import FundRaiserService from "../services/FundRaiserService";
import UtilHelper from "../util/helper/utilHelper";
import { IAdminController } from "../types/Interface/IController";
import { FundRaiserBankAccountType, FundRaiserCategory, FundRaiserFileType, StatusCode } from "../types/Enums/UtilEnum";
import { File } from "node:buffer";
import DonationService from "../services/DonationService";

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

    async getAllFundRaise(req: Request, res: Response): Promise<void> {
        console.log("Reached here");


        try {

            const limit: number = Number(req.params.limit);
            const page: number = Number(req.params.page);
            const status: FundRaiserStatus = req.params.status as FundRaiserStatus;
            const fundRaisersPost: IPaginatedResponse<iFundRaiseModel> = await this.fundRaiserRepo.getAllFundRaiserPost(page, limit, status)

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

    addFundRaiser(req: Request, res: Response): void {
        try {

            const amount: number = req.body.amount;
            const category: FundRaiserCategory = req.body.category;
            const sub_category: string = req.body.sub_category;
            const phone_number: number = req.body.phone_number;
            const email_id: string = req.body.email_id;
            const age: number = req.body.age;
            const about: string = req.body.about;
            const description: string = req.body.description;
            const benificiary_relation: string = req.body.benificiary_relation;
            const full_name: string = req.body.full_name;
            const city: string = req.body.city;
            const district: string = req.body.district;
            const full_address: string = req.body.full_address;
            const pincode: number = req.body.pin_code;
            const state: string = req.body.state
            const documents: number = req.body.documents
            const pictures: number = req.body.pictures

            console.log(req.body);
            console.log("body");

            console.log("Reached here");


            console.log(documents);
            console.log(pictures);


            const utilHelper = new UtilHelper();

            const fundID: string = utilHelper.createFundRaiseID(FundRaiserCreatedBy.ADMIN).toUpperCase()
            const createdDate: Date = new Date()
            const fundRaiserData: IFundRaise = {
                withdraw_docs: {
                    accont_type: FundRaiserBankAccountType.Savings,
                    account_number: '',
                    holder_name: "",
                    ifsc_code: ""
                },
                "fund_id": fundID,
                "amount": amount,
                "category": category,
                "sub_category": sub_category,
                "phone_number": phone_number,
                "email_id": email_id,
                "description": description,
                "created_date": createdDate,
                "created_by": FundRaiserCreatedBy.ADMIN,
                "user_id": "667868f8e5922a99a6e87d95",
                "closed": false,
                "status": FundRaiserStatus.INITIATED,
                "about": about,
                "age": age,
                "benificiary_relation": benificiary_relation,
                "full_name": full_name,
                "city": city,
                "district": district,
                "full_address": full_address,
                "pincode": pincode,
                "state": state
            }

            console.log("Thsi data will svae");

            console.log(fundRaiserData);

            this.fundRaiserService.createFundRaisePost(fundRaiserData).then(async (data) => {
                let picturesUrl = data.data?.upload_images?.pictures.slice(0, pictures)
                let documentsUrl = data.data?.upload_images?.pictures.slice(0, documents)

                await this.fundRaiserService.uploadImage(picturesUrl, fundID, FundRaiserFileType.Pictures)
                await this.fundRaiserService.uploadImage(documentsUrl, fundID, FundRaiserFileType.Document)
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