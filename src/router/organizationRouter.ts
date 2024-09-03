import express, { Router } from 'express'
import AuthMiddleware from '../middleware/authMiddleware';
import OrganizationController from '../controller/organizationController';

const organizationRouter: Router = express.Router();
const organizationController = new OrganizationController();
const authMiddleware = new AuthMiddleware()

//Get method
organizationRouter.get("/view/:profile_id", authMiddleware.isValidOrganization, organizationController.getSingleProfile); //test pending
organizationRouter.get("/view/:limit/:skip", authMiddleware.isValidOrganization, organizationController.getAllFundRaise); //test pending

//Post Method
organizationRouter.post("/create", authMiddleware.isValidOrganization, organizationController.addFundRaiser)

//patch method
organizationRouter.patch("/edit/:edit_id", authMiddleware.isValidOrganization, authMiddleware.isOrganizationAuthraized, organizationController.editFundRaiser)
organizationRouter.patch("/update_status/:edit_id", authMiddleware.isValidOrganization, authMiddleware.isOrganizationAuthraized, organizationController.updateStatus)
organizationRouter.patch("/close/:edit_id", authMiddleware.isValidOrganization, authMiddleware.isValidOrganization, organizationController.closeFundRaiser)

export default organizationRouter

