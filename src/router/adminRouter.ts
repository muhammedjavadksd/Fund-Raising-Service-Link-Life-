import express, { Router } from 'express'
import { AdminController } from '../controller/adminController';
import AuthMiddleware from '../middleware/authMiddleware';

const adminRouter: Router = express.Router();
const AdminControllers = new AdminController();
const authMiddleware = new AuthMiddleware()

//Get method
adminRouter.get("/view/:profile_id", authMiddleware.isValidAdmin, AdminControllers.getSingleProfile);
adminRouter.get("/view/:limit/:page", authMiddleware.isValidAdmin, AdminControllers.getAllFundRaise);

//Post Method
adminRouter.post("/create", authMiddleware.isValidAdmin, AdminControllers.addFundRaiser) // test completed

//patch method
adminRouter.patch("/edit/:edit_id", authMiddleware.isValidAdmin, AdminControllers.editFundRaiser) //test completed
adminRouter.patch("/update_status/:edit_id", authMiddleware.isValidAdmin, AdminControllers.updateStatus) //test completed
adminRouter.patch("/close", authMiddleware.isValidAdmin, AdminControllers.closeFundRaiser)


export default adminRouter

