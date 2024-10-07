import { skip } from "node:test";
import InitFundRaisingModel from "../db/model/initFundRaiseModel";
import { FundRaiserCreatedBy, FundRaiserStatus } from "../types/Enums/DbEnum";
import { StatusCode } from "../types/Enums/UtilEnum";
import { IAdminAddFundRaiser, IEditableFundRaiser, IFundRaise, IFundRaiseInitialData, iFundRaiseModel } from "../types/Interface/IDBmodel";
import { IFundRaiserRepo } from "../types/Interface/IRepo";
import { HelperFuncationResponse, IPaginatedResponse } from "../types/Interface/Util";
import mongoose, { Schema } from "mongoose";



class FundRaiserRepo implements IFundRaiserRepo {

    private readonly FundRaiserModel;

    constructor() {
        this.getActiveFundRaiserPost = this.getActiveFundRaiserPost.bind(this)
        this.getAllFundRaiserPost = this.getAllFundRaiserPost.bind(this)
        this.getRestrictedFundRaisePost = this.getRestrictedFundRaisePost.bind(this)
        this.getUserPosts = this.getUserPosts.bind(this)
        this.getOrganizationPosts = this.getOrganizationPosts.bind(this)
        this.createFundRaiserPost = this.createFundRaiserPost.bind(this)
        this.updateFundRaiser = this.updateFundRaiser.bind(this)
        this.updateFundRaiserByModel = this.updateFundRaiserByModel.bind(this)
        this.findFundPostByFundId = this.findFundPostByFundId.bind(this)
        this.getSingleFundRaiseOfUser = this.getSingleFundRaiseOfUser.bind(this)
        this.fundRaiserPaginatedByCategory = this.fundRaiserPaginatedByCategory.bind(this);
        this.closeFundRaiser = this.closeFundRaiser.bind(this);
        this.deleteOneDocument = this.deleteOneDocument.bind(this)
        this.deleteOnePicture = this.deleteOnePicture.bind(this)

        this.FundRaiserModel = InitFundRaisingModel
    }


    async deleteOneDocument(fundId: string, image: string): Promise<boolean> {
        const deleteDoc = await this.FundRaiserModel.updateOne({ fund_id: fundId }, { $pull: { documents: image } })
        return deleteDoc.modifiedCount > 0
    }


    async deleteOnePicture(fundId: string, image: string): Promise<boolean> {
        const deleteDoc = await this.FundRaiserModel.updateOne({ fund_id: fundId }, { $pull: { picture: image } })
        return deleteDoc.modifiedCount > 0
    }


    async getStatitics(): Promise<Record<string, any>> {
        const result = await this.FundRaiserModel.aggregate([
            {
                $facet: {
                    totalFundRaise: [{ $count: "count" }],
                    activeFundRaise: [
                        { $match: { is_closed: false, status: FundRaiserStatus.APPROVED } },
                        { $count: "count" }
                    ],
                    closedFundRaise: [
                        { $match: { is_closed: false, status: FundRaiserStatus.CLOSED } },
                        { $count: "count" }
                    ],
                    pendingFundRaiser: [
                        { $match: { is_closed: false, status: { $in: [FundRaiserStatus.INITIATED, FundRaiserStatus.CREATED] } } },
                        { $count: "count" }
                    ]
                }
            }
        ]);

        const totalFundRaise = result[0].totalFundRaise[0]?.count || 0;
        const activeFundRaise = result[0].activeFundRaise[0]?.count || 0;
        const closedFundRaise = result[0].closedFundRaise[0]?.count || 0;
        const pendingFundRaiser = result[0].pendingFundRaiser[0]?.count || 0;
        return {
            total_fund_raiser: totalFundRaise,
            activeFundRaise,
            closedFundRaise,
            pendingFundRaiser
        }
    }




    async closeFundRaiser(fund_id: string): Promise<boolean> {
        const findUpdate = await this.FundRaiserModel.updateOne({ fund_id }, { $set: { closed: true, status: FundRaiserStatus.CLOSED } })
        return findUpdate.modifiedCount > 0
    }

    async fundRaiserPaginatedByCategory(category: string, skip: number, limit: number): Promise<iFundRaiseModel[]> {
        // try {
        //     const findProfile = await this.FundRaiserModel.find({ category, status: FundRaiserStatus.APPROVED, closed: false }).skip(skip).limit(limit);
        //     return findProfile
        // } catch (e) {
        //     return [];
        // }


        //dont need this function use getActiveFundRaiserPost
        return []
    }

    async countRecords(): Promise<number> {
        try {
            const countFundRaise: number = await this.FundRaiserModel.countDocuments({})
            return countFundRaise
        } catch (e) {
            return 0
        }
    }



    async getActiveFundRaiserPost(skip: number, limit: number, query: Record<string, any>): Promise<IPaginatedResponse<IFundRaise[]>> {
        try {

            const limitedData = await this.FundRaiserModel.aggregate(
                [
                    {
                        $match: {
                            status: FundRaiserStatus.APPROVED,
                            closed: false,
                            ...query
                        }
                    },
                    {
                        $facet: {
                            paginated: [
                                {
                                    $skip: skip
                                },
                                {
                                    $limit: limit
                                }
                            ],
                            total_records: [
                                {
                                    $count: "total_records"
                                }
                            ]
                        }
                    },
                    {
                        $unwind: "$total_records"
                    },
                    {
                        $project: {
                            paginated: 1,
                            total_records: "$total_records.total_records"
                        }
                    }
                ])

            const response: IPaginatedResponse<IFundRaise[]> = {
                paginated: limitedData[0].paginated,
                total_records: limitedData[0].total_records
            }

            console.log("Limited data");
            console.log(limitedData);

            return response;
        } catch (e) {
            return {
                paginated: [],
                total_records: 0
            }
        }
    }

    async getAllFundRaiserPost(page: number, limit: number, status: FundRaiserStatus, filter: Record<string, any>): Promise<IPaginatedResponse<IFundRaise>> {
        try {
            const skip = (page - 1) * limit;
            const match: Record<string, any> = filter;
            if (status) {
                match['status'] = status
            }

            console.log(match);

            const fundRaisePost = await this.FundRaiserModel.aggregate([
                {
                    $match: match
                },
                {
                    $facet: {
                        paginated: [
                            {
                                $skip: skip
                            },
                            {
                                $limit: limit
                            }
                        ],
                        total_records: [
                            {
                                $count: "total_records"
                            }
                        ]
                    }
                },
                {
                    $unwind: "$total_records"
                },
                {
                    $project: {
                        paginated: 1,
                        total_records: "$total_records.total_records"
                    }
                }
            ])

            console.log(fundRaisePost);
            console.log(match);




            const response: IPaginatedResponse<iFundRaiseModel> = {
                paginated: fundRaisePost[0].paginated,
                total_records: fundRaisePost[0].total_records,
            }
            return response
        } catch (e) {
            return {
                paginated: [],
                total_records: 0
            }
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

    async getUserPosts(user_id: string, skip: number, limit: number, status: FundRaiserStatus): Promise<IPaginatedResponse<iFundRaiseModel>> {

        const filtter: Record<string, any> = {
            user_id: new mongoose.Types.ObjectId(user_id)
        }

        if (status) {
            filtter['status'] = status
        }

        try {
            const fundRaisePost = await this.FundRaiserModel.aggregate([
                {
                    $match: filtter
                },
                {
                    $facet: {
                        paginated: [
                            {
                                $skip: skip
                            },
                            {
                                $limit: limit
                            }
                        ],
                        total_records: [
                            {
                                $count: "total_records"
                            }
                        ]
                    }
                },
                {
                    $unwind: "$total_records"
                },
                {
                    $project: {
                        paginated: 1,
                        total_records: "$total_records.total_records"
                    }
                }
            ])

            console.log(fundRaisePost);

            const response: IPaginatedResponse<iFundRaiseModel> = {
                paginated: fundRaisePost[0].paginated,
                total_records: fundRaisePost[0].total_records,
            }
            return response
        } catch (e) {
            // console.log(e);
            return {
                paginated: [],
                total_records: 0
            }
        }
    }

    async getOrganizationPosts(organization_id: string, skip: number, limit: number): Promise<iFundRaiseModel[]> {
        try {
            const fundRaisePost: iFundRaiseModel[] = await this.FundRaiserModel.find({ created_by: FundRaiserCreatedBy.ORGANIZATION, user_id: organization_id }).skip(skip).limit(limit);
            return fundRaisePost
        } catch (e) {
            console.log(e);
            return []
        }
    }

    async createFundRaiserPost(initialData: IAdminAddFundRaiser | IFundRaiseInitialData): Promise<HelperFuncationResponse> {

        try {
            const newFundRaiser = new this.FundRaiserModel(initialData);
            await newFundRaiser.save()
            return {
                msg: "Fund raise created success",
                status: true,
                statusCode: StatusCode.CREATED,
                data: {
                    id: newFundRaiser.id,
                    fund_id: newFundRaiser.fund_id
                }
            }
        } catch (e) {
            console.log(e);
            return {
                msg: "Interanl server error",
                status: false,
                statusCode: StatusCode.SERVER_ERROR,
            }
        }
    }

    async updateFundRaiser(fund_id: string, edit_data: IEditableFundRaiser): Promise<boolean> {
        console.log(edit_data);

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
            const save = await model.save();
            console.log("Save the data");

            console.log(save);
            return true
        } catch (e) {
            console.log(e);
            return false
        }
    }

    async findFundPostByFundId(fund_id: string): Promise<iFundRaiseModel | null> {
        try {
            const fund_post = await this.FundRaiserModel.aggregate([
                {
                    $match: {
                        fund_id
                    }
                },
                {
                    $lookup: {
                        from: "bank-accounts",
                        localField: "befId",
                        foreignField: "befId",
                        as: "bank_account"
                    }
                },
                {
                    $unwind: "bank_account"
                }
            ]);

            return fund_post[0]
        } catch (e) {
            return null
        }
    }


    async getSingleFundRaiseOfUser(user_id: string, fund_id: string): Promise<iFundRaiseModel | null> {
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