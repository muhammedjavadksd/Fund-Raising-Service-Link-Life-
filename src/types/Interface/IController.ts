
import { Request, Response } from "express";
import { CustomRequest } from "../DataType/Objects";

interface IUserController {
    getUserFundRaisePost(req: CustomRequest, res: Response): Promise<void>
    deleteImage(req: Request, res: Response): Promise<void>
    closeFundRaise(req: CustomRequest, res: Response): Promise<void>
    uploadImage(req: Request, res: Response): Promise<void>
    editFundRaise(req: Request, res: Response): Promise<void>
    createFundRaise(req: CustomRequest, res: Response): Promise<void>
    getActiveFundRaise(req: Request, res: Response): Promise<void>
    getSingleProfile(req: Request, res: Response): Promise<void>
    addComment(req: Request, res: Response): Promise<void>
    getPaginatedComments(req: Request, res: Response): Promise<void>
    editComment(req: Request, res: Response): Promise<void>
    deleteComment(req: Request, res: Response): Promise<void>
    categoryFundRaiserPaginated(req: Request, res: Response): Promise<void>
    verifyCloseToken(req: Request, res: Response): Promise<void>
    payToFundRaiser(req: Request, res: Response): Promise<void>
    verifyPayment(req: Request, res: Response): Promise<void>
    donationHistory(req: Request, res: Response): Promise<void>
    myDonationHistory(req: Request, res: Response): Promise<void>
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