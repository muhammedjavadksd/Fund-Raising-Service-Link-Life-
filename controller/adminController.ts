import { Request, Response } from "express";
import utilHelper from "../util/helper/utilHelper";
import { IFundRaiseInitial } from "../types/Interface/IDBmodel";
import { FundRaiserCreatedBy, FundRaiserStatus } from "../types/Enums/DbEnum";
import mongoose from "mongoose";
// import FundRaiserService from "../services/FundRaiserService";
import FundRaiserRepo from "../repositorys/FundRaiserRepo";
import { HelperFuncationResponse } from "../types/Interface/Util";

const fundRaisingHelper = require("../util/helper/fundRaiserHelper");
// const utilHelper = require("../util/helper/utilHelper");
// utilHelper
// import { Request, Response } from 'express';

interface IAdminController {
    addFundRaiser(req: Request, res: Response): void;
}

class AdminController implements IAdminController {

    // private readonly fundRaiserService;
    private readonly fundRaiserRepo;

    constructor() {
        // this.fundRaiserService = new FundRaiserService();
        this.fundRaiserRepo = new FundRaiserRepo();
    }

    addFundRaiser(req: Request, res: Response) {
        try {

            const amount: number = req.body.amount;
            const category: string = req.body.category;
            const sub_category: string = req.body.sub_category;
            const phone_number: number = req.body.phone_number;
            const email_id: string = req.body.email_id;
            const age: number = req.body.age;
            const about: string = req.body.about;
            const benificiary_relation: string = req.body.benificiary_relation;
            const full_name: string = req.body.full_name;
            const city: string = req.body.city;
            const district: string = req.body.district;
            const full_address: string = req.body.full_address;
            const pincode: number = req.body.pin_code;
            const state: string = req.body.state

            const fundID: string = utilHelper.createFundRaiseID("ADMIN")
            const createdDate: Date = new Date()
            const fundRaiserData: IFundRaiseInitial = {
                "fund_id": fundID,
                "amount": amount,
                "category": category,
                "sub_category": sub_category,
                "phone_number": phone_number,
                "email_id": email_id,
                "created_date": createdDate,
                "created_by": FundRaiserCreatedBy.ADMIN,
                "user_id": "admin",
                "closed": false,
                "status": FundRaiserStatus.APPROVED,
                "about": about,
                "age": age,
                "benificiary_relation": benificiary_relation,
                "full_name": full_name,
                "city": city,
                "district": district,
                "full_address": full_address,
                "pincode": pincode,
                "state": state
            }


            this.fundRaiserRepo.createFundRaiserPost(fundRaiserData).then((data: HelperFuncationResponse) => {
                res.status(data.statusCode).json({ status: true, msg: data.msg, data: data.data })
            }).catch((err) => {
                res.status(500).json({ status: false, msg: "Interanl server error", })
            })
        } catch (e) {
            console.log(e);
            res.status(500).json({ status: false, msg: "Interanl server error", })
        }
    }
}




let adminController = {

    getSingleProfile: async (req: Request, res: Response) => {
        try {
            let profile_id = req.params.profile_id;
            let profile = await fundRaisingHelper.getSingleFundRaise(profile_id);
            if (profile) {
                res.status(200).json({ status: true, data: profile })
            } else {
                res.status(404).json({ status: false, msg: "No profile found" })
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({ status: false, msg: "Internal server error" })
        }
    },

    getAllProfile: async (req: Request, res: Response) => {

        try {
            let limit = req.params.limit
            let page = req.params.page;

            let allFundRaisers = await fundRaisingHelper.getAllFundRaisers(limit, page);
            if (allFundRaisers?.length) {
                res.status(200).json({ status: true, data: allFundRaisers })
            } else {
                res.status(204).json({ status: false, msg: "No profile found" })
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({ status: false, msg: "Internal server error" })
        }
    },



}

export { adminController, AdminController }