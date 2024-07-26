import { Request, Response } from "express"
import FundRaiserRepo from "../repositorys/FundRaiserRepo"
import { CustomRequest } from "../types/DataType/Objects"
import { StatusCode } from "../types/Enums/UtilEnum"
import { iFundRaiseModel } from "../types/Interface/IDBmodel"
import FundRaiserService from "../services/FundRaiserService"
import { FundRaiserCreatedBy } from "../types/Enums/DbEnum"
import { HelperFuncationResponse } from "../types/Interface/Util"


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

    getSingleProfile(req: Request, res: Response): Promise<void> {
        throw new Error("Method not implemented.")
    }
    editFundRaiser(req: Request, res: Response): Promise<void> {
        throw new Error("Method not implemented.")
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