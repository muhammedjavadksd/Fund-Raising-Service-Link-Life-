import { Request, Response } from "express"
import { CustomRequest } from "../types/DataType/Objects"
import FundRaiserService from "../services/FundRaiserService"
import { FundRaiserCreatedBy } from "../types/Enums/DbEnum"
import { HelperFuncationResponse } from "../types/Interface/Util"
import { IEditableFundRaiser } from "../types/Interface/IDBmodel"


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

    constructor() {
        this.fundRaiserService = new FundRaiserService()
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
        throw new Error("Method not implemented.")
    }
    updateStatus(req: Request, res: Response): Promise<void> {
        throw new Error("Method not implemented.")
    }
    closeFundRaiser(req: Request, res: Response): Promise<void> {
        throw new Error("Method not implemented.")
    }

}

export default OrganizationController