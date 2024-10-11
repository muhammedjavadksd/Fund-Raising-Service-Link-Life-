
import { NextFunction, Request, Response } from "express";
import { FundRaiserFileType, JwtTimer } from "../Enums/UtilEnum";
import * as Jwt from "jsonwebtoken";
import { FundRaiserCreatedBy, FundRaiserStatus } from "../Enums/DbEnum";
import { IEditableFundRaiser, IFundRaise, IFundRaiseInitialData, iFundRaiseModel } from "./IDBmodel";
import { CustomRequest, HelperFuncationResponse, IPaginatedResponse } from "./Util";

interface IUserController {
    activeBankAccount(req: CustomRequest, res: Response): Promise<void>
    deleteBankAccount(req: CustomRequest, res: Response): Promise<void>
    getActiveBankAccounts(req: CustomRequest, res: Response): Promise<void>
    getDonationStatitics(req: CustomRequest, res: Response): Promise<void>
    profileBankAccounts(req: CustomRequest, res: Response): Promise<void>
    getBankAccounts(req: CustomRequest, res: Response): Promise<void>
    addBankAccount(req: CustomRequest, res: Response): Promise<void>
    getPresignedUrl(req: CustomRequest, res: Response): Promise<void>
    findPaymentOrder(req: CustomRequest, res: Response): Promise<void>
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
    activeBankAccount(req: Request, res: Response): Promise<void>
    getBankAccounts(req: Request, res: Response): Promise<void>
    deleteFundRaiserImage(req: Request, res: Response): Promise<void>
    addBankAccount(req: Request, res: Response): Promise<void>
    getStatitics(req: Request, res: Response): Promise<void>
    getAllFundRaise(req: Request, res: Response): Promise<void>
    getSingleProfile(req: Request, res: Response): Promise<void>
    editFundRaiser(req: Request, res: Response): Promise<void>
    addFundRaiser(req: Request, res: Response): void
    updateStatus(req: Request, res: Response): Promise<void>
    closeFundRaiser(req: Request, res: Response): Promise<void>
    viewDonationHistory(req: Request, res: Response): Promise<void>
}


interface ITokenHelper {
    createJWTToken(payload: object, timer: JwtTimer): Promise<string | null>
    decodeJWTToken(jwtToken: string): Promise<Jwt.Jwt | null>
    checkTokenValidity(token: string): Promise<Jwt.JwtPayload | false | string>
}

interface IUtilHelper {
    createFundRaiseID(created_by: FundRaiserCreatedBy): string
    generateAnOTP(length: number): number
    createRandomText(length: number): string
    extractImageNameFromPresignedUrl(url: string): string | boolean
    generateFundRaiserTitle(profile: IFundRaise): string
    formatDateToMonthNameAndDate(date: Date): string
}

interface IAuthMiddleware {
    isValidUser(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    isFundRaiseRequestValid(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    isValidAdmin(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    isValidCommentOwner(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
}



interface IFundRaiserRepo {
    deleteOnePicture(fundId: string, image: string): Promise<boolean>
    deleteOneDocument(fundId: string, image: string): Promise<boolean>
    getStatitics(): Promise<Record<string, any>>
    getSingleFundRaiseOfUser(user_id: string, fund_id: string): Promise<iFundRaiseModel | null>
    findFundPostByFundId(fund_id: string): Promise<iFundRaiseModel | null>
    // updateFundRaiserByModel(model: iFundRaiseModel): Promise<boolean>
    updateFundRaiser(fund_id: string, edit_data: IEditableFundRaiser): Promise<boolean>
    createFundRaiserPost(initialData: IFundRaise): Promise<HelperFuncationResponse>
    getUserPosts(user_id: string, skip: number, limit: number, status: FundRaiserStatus): Promise<IPaginatedResponse<iFundRaiseModel>>
    getAllFundRaiserPost(page: number, limit: number, status: FundRaiserStatus, filter: Record<string, any>): Promise<IPaginatedResponse<IFundRaise>>
    getActiveFundRaiserPost(page: number, limit: number, query: Record<string, any>): Promise<IPaginatedResponse<IFundRaise[]>>
    closeFundRaiser(fund_id: string): Promise<boolean>
}


interface IFundRaiserService {

    deleteFundRaiserImage(fundId: string, image: string, type: FundRaiserFileType): Promise<HelperFuncationResponse>
    createPresignedUrl(type: FundRaiserFileType): Promise<HelperFuncationResponse>
    deleteImage(fund_id: string, type: FundRaiserFileType, image: string): Promise<HelperFuncationResponse>
    createFundRaisePost(data: IFundRaiseInitialData): Promise<HelperFuncationResponse>
    getOwnerFundRaise(owner_id: string, limit: number, skip: number, status: FundRaiserStatus): Promise<HelperFuncationResponse>
    closeFundRaiser(fund_id: string, needVerification: boolean): Promise<HelperFuncationResponse>
    closeFundRaiserVerification(token: string): Promise<HelperFuncationResponse>
    updateStatus(fund_id: string, newStatus: FundRaiserStatus): Promise<HelperFuncationResponse>
    editFundRaiser(fund_id: string, edit_data: IEditableFundRaiser, ownerType: FundRaiserCreatedBy): Promise<HelperFuncationResponse>
    uploadImage(images: string[], fundRaiserID: string, document_type: FundRaiserFileType): Promise<HelperFuncationResponse>
    getOwnerSingleProfile(user_id: string): Promise<HelperFuncationResponse>
    paginatedFundRaiserByCategory(category: string, limit: number, skip: number, filter: Record<string, any>): Promise<HelperFuncationResponse>
    addBeneficiary(benfId: string,fund_id: string, name: string, email: string, phone: string, accountNumber: string, ifsc: string, address: string): Promise<HelperFuncationResponse>
    editFundRaiser(editId: string, editData: IEditableFundRaiser): Promise<HelperFuncationResponse>
}

export { IUserController, IAdminController, ITokenHelper, IFundRaiserService, IFundRaiserRepo, IAuthMiddleware, IUtilHelper }