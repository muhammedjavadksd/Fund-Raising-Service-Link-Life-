import express, { Router } from 'express'
import { AdminController } from '../controller/adminController';
import AuthMiddleware from '../middleware/authMiddleware';
import OrganizationController from '../controller/organizationController';

const organizationRouter: Router = express.Router();
const organizationController = new OrganizationController();
const authMiddleware = new AuthMiddleware()

//Get method
organizationRouter.get("/view/:profile_id", authMiddleware.isValidOrganization, organizationController.getSingleProfile); //test completed
organizationRouter.get("/view/:limit/:skip", authMiddleware.isValidOrganization, organizationController.getAllFundRaise); //test completed

//Post Method
organizationRouter.post("/create", authMiddleware.isValidOrganization, organizationController.addFundRaiser) // test completed

//patch method
organizationRouter.patch("/edit/:edit_id", authMiddleware.isValidOrganization, organizationController.editFundRaiser) //test completed
organizationRouter.patch("/update_status/:edit_id", authMiddleware.isValidOrganization, organizationController.updateStatus) //test completed
organizationRouter.patch("/close/:edit_id", authMiddleware.isValidOrganization, organizationController.closeFundRaiser) //test completed


export default organizationRouter

