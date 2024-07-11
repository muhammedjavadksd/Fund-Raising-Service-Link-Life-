import { CustomRequest } from "../DataType/Objects";
import { Request, Response } from "express";

interface IUserController {
    getUserFundRaisePost(req: CustomRequest, res: Response): Promise<void>
    deleteImage(req: Request, res: Response): Promise<void>
    closeFundRaise(req: CustomRequest, res: Response): Promise<void>
    uploadImage(req: Request, res: Response): Promise<void>
    editFundRaise(req: Request, res: Response): Promise<void>
    createFundRaise(req: CustomRequest, res: Response): Promise<void>
    getActiveFundRaise(req: Request, res: Response): Promise<void>
    getSingleProfile(req: Request, res: Response): Promise<void>
}

interface IAdminController {
    getAllFundRaise(req: Request, res: Response): Promise<void>
    getSingleProfile(req: Request, res: Response): Promise<void>
    editFundRaiser(req: Request, res: Response): Promise<void>
    addFundRaiser(req: Request, res: Response): void
    updateStatus(req: Request, res: Response): Promise<void>
    closeFundRaiser(req: Request, res: Response): Promise<void>
}


export { IUserController, IAdminController }