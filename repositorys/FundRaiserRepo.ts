import { IFundRaiseInitial } from "../types/Interface/IDBmodel";
import { HelperFuncationResponse } from "../types/Interface/Util";
import InitFundRaisingModel from "../util/config/db/model/initFundRaiseModel";

interface IFundRaiserRepo {

    createFundRaiserPost(initialData: IFundRaiseInitial): Promise<HelperFuncationResponse>

}

class FundRaiserRepo implements IFundRaiserRepo {

    private readonly FundRaiserModel;

    constructor() {
        this.FundRaiserModel = InitFundRaisingModel
    }

    async createFundRaiserPost(initialData: IFundRaiseInitial): Promise<HelperFuncationResponse> {

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

}

export default FundRaiserRepo