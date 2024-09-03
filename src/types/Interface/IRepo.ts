import { IEditableFundRaiser, IFundRaise, iFundRaiseModel } from "./IDBmodel"
import { HelperFuncationResponse } from "./Util"

interface IFundRaiserRepo {
    getSingleFundRaiseOfUser(user_id: string, fund_id: string): Promise<iFundRaiseModel | null>
    findFundPostByFundId(fund_id: string): Promise<iFundRaiseModel | null>
    updateFundRaiserByModel(model: iFundRaiseModel): Promise<boolean>
    updateFundRaiser(fund_id: string, edit_data: IEditableFundRaiser): Promise<boolean>
    createFundRaiserPost(initialData: IFundRaise): Promise<HelperFuncationResponse>
    getOrganizationPosts(organization_id: string, skip: number, limit: number): Promise<iFundRaiseModel[]>
    getUserPosts(user_id: string): Promise<iFundRaiseModel[] | null>
    getRestrictedFundRaisePost(fund_id: string): Promise<iFundRaiseModel | null>
    getAllFundRaiserPost(page: number, limit: number): Promise<iFundRaiseModel[]>
    getActiveFundRaiserPost(page: number, limit: number): Promise<iFundRaiseModel[]>
    fundRaiserPaginatedByCategory(category: string, skip: number, limit: number): Promise<iFundRaiseModel[]>
}

export { IFundRaiserRepo }