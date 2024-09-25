import DonateHistoryCollection from "../db/model/DonationHistory";
import PaymentOrderCollection from "../db/model/PaymentOrder";
import { IDonateHistoryCollection, IDonateHistoryTemplate } from "../types/Interface/IDBmodel";
import { IPaginatedResponse } from "../types/Interface/Util";


interface IDonationRepo {
    getStatitics(): Promise<Record<string, any>>
    insertDonationHistory(data: IDonateHistoryTemplate): Promise<string | null | undefined>
    findOneDonation(donation_id: string): Promise<IDonateHistoryCollection | null>
    findManyUserDonation(user_id: string): Promise<IDonateHistoryCollection[]>
    findManyFundRaiserDonation(fund_id: string): Promise<IDonateHistoryCollection[]>
    findManyFundRaiserDonationByUser(fund_id: string, user_id: string): Promise<IDonateHistoryCollection[]>
    findProfilePaginedtHistory(profile_id: string, limit: number, skip: number): Promise<IPaginatedResponse<IDonateHistoryCollection[]>>
    findPrivateProfilePaginedtHistory(profile_id: string, limit: number, skip: number): Promise<IPaginatedResponse<IDonateHistoryCollection[]>>
    findUserDonationHistory(profile_id: string, limit: number, skip: number): Promise<IPaginatedResponse<IDonateHistoryCollection[]>>
    findOrder(order_id: string): Promise<null | IDonateHistoryCollection>
}


class DonationRepo implements IDonationRepo {


    async getStatitics(): Promise<Record<string, any>> {

        const result = await DonateHistoryCollection.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        return {
            total_donation: result[0]?.totalAmount || 0
        }
    }


    async findOrder(order_id: string): Promise<null | IDonateHistoryCollection> {

        console.log("Oderid");

        console.log(order_id);

        try {
            const payment = await PaymentOrderCollection.aggregate([
                {
                    $match: {
                        order_id
                    }
                },
                {
                    $lookup: {
                        from: "init_fund_raising",
                        as: "profile",
                        foreignField: "fund_id",
                        localField: "fund_id"
                    }
                },
                {
                    $unwind: "$profile"
                }
            ])
            console.log("Payment");
            console.log(payment);

            return payment[0]
        } catch (e) {
            console.log(e);
            return null
        }
    }

    async findUserDonationHistory(profile_id: string, limit: number, skip: number): Promise<IPaginatedResponse<IDonateHistoryCollection[]>> {
        try {
            const find = await DonateHistoryCollection.aggregate([
                {
                    $match: {
                        profile_id,
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
                            },
                            {
                                $lookup: {
                                    from: "init_fund_raising",
                                    as: "fund_profile",
                                    foreignField: "fund_id",
                                    localField: "fund_id"
                                }
                            },
                            {
                                $unwind: "$fund_profile"
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
                    $sort: {
                        date: -1
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
            ]
            )

            const response: IPaginatedResponse<IDonateHistoryCollection[]> = {
                paginated: find[0].paginated,
                total_records: find[0].total_records
            }

            return response
        } catch (e) {
            return {
                total_records: 0,
                paginated: []
            }
        }
    }

    async findPrivateProfilePaginedtHistory(profile_id: string, limit: number, skip: number): Promise<IPaginatedResponse<IDonateHistoryCollection[]>> {
        try {
            const find = await DonateHistoryCollection.aggregate([
                {
                    $match: {
                        fund_id: profile_id,
                        hide_profile: false
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
                    $sort: {
                        date: -1
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
            ]
            )

            const response: IPaginatedResponse<IDonateHistoryCollection[]> = {
                paginated: find[0].paginated,
                total_records: find[0].total_records
            }

            return response
        } catch (e) {
            return {
                total_records: 0,
                paginated: []
            }
        }
    }


    async findProfilePaginedtHistory(profile_id: string, limit: number, skip: number): Promise<IPaginatedResponse<IDonateHistoryCollection[]>> {

        try {
            const find = await DonateHistoryCollection.aggregate([
                {
                    $match: {
                        fund_id: profile_id,
                    }
                },
                {
                    $skip: skip
                },
                {
                    $limit: limit
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
                    $sort: {
                        date: -1
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
            ]
            )

            const response: IPaginatedResponse<IDonateHistoryCollection[]> = {
                paginated: find[0].paginated,
                total_records: find[0].total_records
            }

            return response
        } catch (e) {
            return {
                total_records: 0,
                paginated: []
            }
        }
    }

    async findManyUserDonation(user_id: string): Promise<IDonateHistoryCollection[]> {
        const findMany = await DonateHistoryCollection.find({ profile_id: user_id });
        return findMany
    }

    async findManyFundRaiserDonation(fund_id: string): Promise<IDonateHistoryCollection[]> {
        const findMany = await DonateHistoryCollection.find({ fund_id });
        return findMany
    }

    async findManyFundRaiserDonationByUser(fund_id: string, user_id: string): Promise<IDonateHistoryCollection[]> {
        const findMany = await DonateHistoryCollection.find({ fund_id, profile_id: user_id });
        return findMany
    }

    async insertDonationHistory(data: IDonateHistoryTemplate): Promise<string | null | undefined> {
        const instance = new DonateHistoryCollection(data);
        const save = await instance.save()
        return save?.id
    }

    async findOneDonation(donation_id: string): Promise<IDonateHistoryCollection | null> {
        const findOne = await DonateHistoryCollection.findOne({ donation_id });
        return findOne
    }
}

export default DonationRepo