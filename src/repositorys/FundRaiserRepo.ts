import InitFundRaisingModel from "../db/model/initFundRaiseModel";
import { FundRaiserCreatedBy, FundRaiserStatus } from "../types/Enums/DbEnum";
import { IEditableFundRaiser, IFundRaise, IFundRaiseInitialData, iFundRaiseModel } from "../types/Interface/IDBmodel";
import { HelperFuncationResponse } from "../types/Interface/Util";

interface IFundRaiserRepo {

    createFundRaiserPost(initialData: IFundRaise): Promise<HelperFuncationResponse>

}

class FundRaiserRepo implements IFundRaiserRepo {

    private readonly FundRaiserModel;

    constructor() {
        this.FundRaiserModel = InitFundRaisingModel
    }



    async getActiveFundRaiserPost(page: number, limit: number): Promise<iFundRaiseModel[]> {
        try {
            let skip = (page - 1) * limit;
            let limitedData: iFundRaiseModel[] = await this.FundRaiserModel.find({ status: FundRaiserStatus.APPROVED, closed: false }).skip(skip).limit(limit);
            return limitedData;
        } catch (e) {
            return []
        }
    }

    async getAllFundRaiserPost(page: number, limit: number): Promise<iFundRaiseModel[]> {
        try {
            let skip = (page - 1) * limit;
            let limitedData = await this.FundRaiserModel.find({}).skip(skip).limit(limit);
            return limitedData;
        } catch (e) {
            return []
        }
    }

    async getRestrictedFundRaisePost(fund_id: string): Promise<iFundRaiseModel | null> {
        try {
            const profile = await this.FundRaiserModel.findOne({ fund_id, status: FundRaiserStatus.APPROVED, closed: false });
            return profile
        } catch (e) {
            console.log(e);
            return null
        }
    }

    async getUserPosts(user_id: string): Promise<iFundRaiseModel[] | null> {
        try {
            const fundRaisePost: iFundRaiseModel[] = await this.FundRaiserModel.find({ created_by: FundRaiserCreatedBy.USER, user_id });
            return fundRaisePost
        } catch (e) {
            console.log(e);
            return null
        }
    }

    async getOrganizationPosts(organization_id: string) {
        try {
            const fundRaisePost: iFundRaiseModel[] = await this.FundRaiserModel.find({ created_by: FundRaiserCreatedBy.ORGANIZATION, user_id: organization_id });
            return fundRaisePost
        } catch (e) {
            console.log(e);
            return null
        }
    }

    async createFundRaiserPost(initialData: IFundRaise): Promise<HelperFuncationResponse> {

        try {
            const newFundRaiser = new this.FundRaiserModel(initialData);
            await newFundRaiser.save()
            return {
                msg: "Fund raise created success",
                status: true,
                statusCode: 201,
                data: {
                    id: newFundRaiser.id
                }
            }
        } catch (e) {
            console.log(e);
            return {
                msg: "Interanl server error",
                status: false,
                statusCode: 500,
            }
        }
    }

    async updateFundRaiser(fund_id: string, edit_data: IEditableFundRaiser): Promise<boolean> {
        try {
            await this.FundRaiserModel.updateOne({ fund_id }, { $set: edit_data });
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async updateFundRaiserByModel(model: iFundRaiseModel): Promise<boolean> {
        try {
            await model.save();
            return true
        } catch (e) {
            console.log(e);
            return false
        }
    }

    async findFundPostByFundId(fund_id: string): Promise<iFundRaiseModel | null> {
        try {
            const fund_post = this.FundRaiserModel.findOne({ fund_id });
            return fund_post
        } catch (e) {
            return null
        }
    }


    async getSingleFundRaiseOfUser(user_id: string, fund_id: string) {
        try {

            const findFundRaise: iFundRaiseModel | null = await this.FundRaiserModel.findOne({ user_id, fund_id });
            return findFundRaise
        } catch (e) {
            console.log(e);
            return null
        }
    }

}

export default FundRaiserRepo