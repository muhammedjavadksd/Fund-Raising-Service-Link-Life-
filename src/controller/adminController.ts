import { Request, Response } from "express";
import utilHelper from "../util/helper/utilHelper";
import { IEditableFundRaiser, IFundRaise, iFundRaiseModel } from "../types/Interface/IDBmodel";
import { FundRaiserCreatedBy, FundRaiserStatus } from "../types/Enums/DbEnum";
import FundRaiserRepo from "../repositorys/FundRaiserRepo";
import { HelperFuncationResponse } from "../types/Interface/Util";
import FundRaiserService from "../services/FundRaiserService";


interface IAdminController {
    addFundRaiser(req: Request, res: Response): void;
}

class AdminController implements IAdminController {

    private readonly fundRaiserRepo;
    private readonly fundRaiserService;

    constructor() {
        this.fundRaiserRepo = new FundRaiserRepo();
        this.fundRaiserService = new FundRaiserService();
    }

    async getAllFundRaise(req: Request, res: Response): Promise<void> {

        try {

            const limit: number = Number(req.params.limit);
            const page: number = Number(req.params.page);
            const fundRaisersPost: iFundRaiseModel[] = await this.fundRaiserRepo.getAllFundRaiserPost(page, limit)

            if (fundRaisersPost?.length) {
                res.status(200).json({ status: true, data: fundRaisersPost })
            } else {
                res.status(204).json({ status: false, msg: "No data found" })
            }
        } catch (e) {
            res.status(500).json({ status: false, msg: "Internal Server Error" })
        }
    }

    async getSingleProfile(req: Request, res: Response): Promise<void> {

        try {

            const profile_id: string = req.params.profile_id;
            const profile: iFundRaiseModel | null = await this.fundRaiserRepo.findFundPostByFundId(profile_id);
            if (profile) {
                res.status(200).json({ status: true, data: profile })
            } else {
                res.status(204).json({ status: false, msg: "Profile not found" })
            }
        } catch (e) {
            res.status(500).json({ status: false, msg: "Internal Server Error" })
        }
    }


    async editFundRaiser(req: Request, res: Response): Promise<void> {
        try {

            const fund_id: string = req.body.fund_id;
            const edit_data: IEditableFundRaiser = req.body.edit_data;

            const updateFundRaiser: HelperFuncationResponse = await this.fundRaiserService.editFundRaiser(fund_id, edit_data);
            res.status(updateFundRaiser.statusCode).json({
                status: updateFundRaiser.status,
                msg: updateFundRaiser.msg
            })
        } catch (e) {
            res.status(500).json({
                status: false,
                msg: "Something went wrong"
            })
        }
    }

    addFundRaiser(req: Request, res: Response): void {
        try {

            const amount: number = req.body.amount;
            const category: string = req.body.category;
            const sub_category: string = req.body.sub_category;
            const phone_number: number = req.body.phone_number;
            const email_id: string = req.body.email_id;
            const age: number = req.body.age;
            const about: string = req.body.about;
            const benificiary_relation: string = req.body.benificiary_relation;
            const full_name: string = req.body.full_name;
            const city: string = req.body.city;
            const district: string = req.body.district;
            const full_address: string = req.body.full_address;
            const pincode: number = req.body.pin_code;
            const state: string = req.body.state

            const fundID: string = utilHelper.createFundRaiseID("ADMIN")
            const createdDate: Date = new Date()
            const fundRaiserData: IFundRaise = {
                "fund_id": fundID,
                "amount": amount,
                "category": category,
                "sub_category": sub_category,
                "phone_number": phone_number,
                "email_id": email_id,
                "created_date": createdDate,
                "created_by": FundRaiserCreatedBy.ADMIN,
                "user_id": "admin",
                "closed": false,
                "status": FundRaiserStatus.APPROVED,
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


            this.fundRaiserRepo.createFundRaiserPost(fundRaiserData).then((data: HelperFuncationResponse) => {
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

            const fund_id: string = req.body.fund_id;
            const newStatus: FundRaiserStatus = req.body.newStatus;

            const updateStatus: HelperFuncationResponse = await this.fundRaiserService.updateStatus(fund_id, newStatus);
            res.status(updateStatus.statusCode).json({ status: updateStatus.status, msg: updateStatus.msg })
        } catch (e) {
            res.status(500).json({ status: false, msg: "Internal server error" })
        }
    }

    async closeFundRaiser(req: Request, res: Response): Promise<void> {

        try {
            const fund_id: string = req.body.fund_id;
            const closeFundRaiser: HelperFuncationResponse = await this.fundRaiserService.closeFundRaiser(fund_id);
            res.status(closeFundRaiser.statusCode).json({ status: closeFundRaiser.status, msg: closeFundRaiser.msg })
        } catch (e) {
            res.status(500).json({ status: false, msg: "Internal server error" })
        }
    }
}


export { AdminController }