import { Request, Response } from "express"
import { CustomRequest } from "../types/DataType/Objects"
import FundRaiserService from "../services/FundRaiserService"
import { FundRaiserCreatedBy, FundRaiserStatus } from "../types/Enums/DbEnum"
import { HelperFuncationResponse } from "../types/Interface/Util"
import { IEditableFundRaiser, IFundRaise } from "../types/Interface/IDBmodel"
import { FundRaiserCategory } from "../types/Enums/UtilEnum"
import UtilHelper from "../util/helper/utilHelper"
import FundRaiserRepo from "../repositorys/FundRaiserRepo"


interface IOrganizationController {
    getAllFundRaise(req: CustomRequest, res: Response): Promise<void>
    getSingleProfile(req: Request, res: Response): Promise<void>
    editFundRaiser(req: Request, res: Response): Promise<void>
    addFundRaiser(req: Request, res: Response): void
    updateStatus(req: Request, res: Response): Promise<void>
    closeFundRaiser(req: Request, res: Response): Promise<void>
}

class OrganizationController implements IOrganizationController {

    private readonly fundRaiserService;
    private readonly fundRaiserRepo

    constructor() {
        this.fundRaiserService = new FundRaiserService()
        this.fundRaiserRepo = new FundRaiserRepo();

    }

    async getAllFundRaise(req: CustomRequest, res: Response): Promise<void> {
        const organization_id = req.context?.organization_id;
        const limit: number = +req.params.limit;
        const skip: number = +req.params.skip;
        const findAllPost: HelperFuncationResponse = await this.fundRaiserService.getOwnerFundRaise(organization_id, FundRaiserCreatedBy.ORGANIZATION, limit, skip);
        res.status(findAllPost.statusCode).json({ status: findAllPost.status, msg: findAllPost.msg, data: findAllPost.data })
    }

    async getSingleProfile(req: CustomRequest, res: Response): Promise<void> {
        const profile_id: string = req.params.profile_id;
        const organization_id = req.context?.organization_id;
        const findProfile: HelperFuncationResponse = await this.fundRaiserService.getOwnerSingleProfile(profile_id, FundRaiserCreatedBy.ORGANIZATION, organization_id);
        res.status(findProfile.statusCode).json({ status: findProfile.status, msg: findProfile.msg, data: findProfile.data })
    }


    async editFundRaiser(req: Request, res: Response): Promise<void> {
        const edit_id: string = req.params.edit_id;
        const edit_data: IEditableFundRaiser = req.body.edit_data;

        const editFundRaiser: HelperFuncationResponse = await this.fundRaiserService.editFundRaiser(edit_id, edit_data);
        res.status(editFundRaiser.statusCode).json({ status: editFundRaiser.status, msg: editFundRaiser.msg })
    }

    addFundRaiser(req: Request, res: Response): void {

        const amount: number = req.body.amount;
        const category: FundRaiserCategory = req.body.category;
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

        const utilHelper = new UtilHelper();

        const fundID: string = utilHelper.createFundRaiseID(FundRaiserCreatedBy.ORGANIZATION).toUpperCase()
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
        this.fundRaiserRepo.createFundRaiserPost(fundRaiserData).then((data: HelperFuncationResponse) => {
            res.status(data.statusCode).json({ status: true, msg: data.msg, data: data.data })
        }).catch((err) => {
            res.status(500).json({ status: false, msg: "Interanl server error", })
        })
    }


    async updateStatus(req: Request, res: Response): Promise<void> {
        const fund_id: string = req.params.edit_id;
        const newStatus: FundRaiserStatus = req.body.status;

        const updateStatus: HelperFuncationResponse = await this.fundRaiserService.updateStatus(fund_id, newStatus);
        res.status(updateStatus.statusCode).json({ status: updateStatus.status, msg: updateStatus.msg })
    }

    async closeFundRaiser(req: Request, res: Response): Promise<void> {
        const fund_id: string = req.params.edit_id;
        const closeFundRaiser: HelperFuncationResponse = await this.fundRaiserService.closeFundRaiser(fund_id);
        res.status(closeFundRaiser.statusCode).json({ status: closeFundRaiser.status, msg: closeFundRaiser.msg })
    }

}

export default OrganizationController