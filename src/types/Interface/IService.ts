import { UploadedFile } from "express-fileupload";
import { FundRaiserCreatedBy, FundRaiserStatus } from "../Enums/DbEnum";
import { FundRaiserFileType } from "../Enums/UtilEnum";
import { IEditableFundRaiser, IFundRaiseInitialData } from "./IDBmodel";
import { HelperFuncationResponse } from "./Util";


interface IFundRaiserService {

    deleteImage(fund_id: string, type: FundRaiserFileType, image: string): Promise<boolean>
    createFundRaisePost(data: IFundRaiseInitialData): Promise<HelperFuncationResponse>
    getOwnerFundRaise(owner_id: string, owner_type: FundRaiserCreatedBy, limit: number, skip: number): Promise<HelperFuncationResponse>
    closeFundRaiser(fund_id: string): Promise<HelperFuncationResponse>
    updateStatus(fund_id: string, newStatus: FundRaiserStatus): Promise<HelperFuncationResponse>
    editFundRaiser(fund_id: string, edit_data: IEditableFundRaiser, ownerType: FundRaiserCreatedBy): Promise<HelperFuncationResponse>
    uploadImage(images: string[], fundRaiserID: string, document_type: FundRaiserFileType): Promise<HelperFuncationResponse>
    getOwnerSingleProfile(profile_id: string, user_type: FundRaiserCreatedBy, owner_id: string): Promise<HelperFuncationResponse>
    paginatedFundRaiserByCategory(category: string, limit: number, skip: number): Promise<HelperFuncationResponse>
}

export { IFundRaiserService }