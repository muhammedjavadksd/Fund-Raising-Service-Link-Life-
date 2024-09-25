import { FundRaiserStatus } from "../Enums/DbEnum"
import { IEditableFundRaiser, IFundRaise, iFundRaiseModel } from "./IDBmodel"
import { HelperFuncationResponse, IPaginatedResponse } from "./Util"

interface IFundRaiserRepo {
    getStatitics(): Promise<Record<string, any>>
    getSingleFundRaiseOfUser(user_id: string, fund_id: string): Promise<iFundRaiseModel | null>
    findFundPostByFundId(fund_id: string): Promise<iFundRaiseModel | null>
    updateFundRaiserByModel(model: iFundRaiseModel): Promise<boolean>
    updateFundRaiser(fund_id: string, edit_data: IEditableFundRaiser): Promise<boolean>
    createFundRaiserPost(initialData: IFundRaise): Promise<HelperFuncationResponse>
    getOrganizationPosts(organization_id: string, skip: number, limit: number): Promise<iFundRaiseModel[]>
    getUserPosts(user_id: string, skip: number, limit: number, status: FundRaiserStatus): Promise<IPaginatedResponse<iFundRaiseModel>>
    getRestrictedFundRaisePost(fund_id: string): Promise<iFundRaiseModel | null>
    getAllFundRaiserPost(page: number, limit: number, status: FundRaiserStatus, filter: Record<string, any>): Promise<IPaginatedResponse<IFundRaise>>
    getActiveFundRaiserPost(page: number, limit: number, query: Record<string, any>): Promise<IPaginatedResponse<IFundRaise[]>>
    fundRaiserPaginatedByCategory(category: string, skip: number, limit: number): Promise<iFundRaiseModel[]>
    closeFundRaiser(fund_id: string): Promise<boolean>
}

export { IFundRaiserRepo }