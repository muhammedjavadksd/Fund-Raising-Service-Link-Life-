import express, { Router } from 'express'
import { AdminController } from '../controller/adminController';
import AuthMiddleware from '../middleware/authMiddleware';

const adminRouter: Router = express.Router();
const AdminControllers = new AdminController();
const authMiddleware = new AuthMiddleware()

//Get method
adminRouter.get("/statitics", authMiddleware.isValidAdmin, AdminControllers.getStatitics); //test completed
adminRouter.get("/view/:profile_id", authMiddleware.isValidAdmin, AdminControllers.getSingleProfile); //test completed
adminRouter.get("/view/:limit/:page/:status?", authMiddleware.isValidAdmin, AdminControllers.getAllFundRaise); //test completed
adminRouter.get("/donation-history/:profile_id/:limit/:page/", authMiddleware.isValidAdmin, AdminControllers.getAllFundRaise); //test completed
adminRouter.get("/presigned-url", authMiddleware.isValidUser, AdminControllers.presignedUrl);//test completed
adminRouter.get("/bank-accounts/:edit_id/:limit/:page", authMiddleware.isValidAdmin, AdminControllers.getBankAccounts);//test completed

//Post Method
adminRouter.post("/create", authMiddleware.isValidAdmin, AdminControllers.addFundRaiser) // test completed
adminRouter.post("/add-bank-account/:edit_id", authMiddleware.isValidAdmin, AdminControllers.addBankAccount); //test completed

//patch method
adminRouter.patch("/upload_images/:edit_id", authMiddleware.isValidAdmin, AdminControllers.uploadImages); // test completed
adminRouter.patch("/edit/:edit_id", authMiddleware.isValidAdmin, AdminControllers.editFundRaiser) //test completed
adminRouter.patch("/update-status/:edit_id", authMiddleware.isValidAdmin, AdminControllers.updateStatus) //test completed
adminRouter.patch("/close/:edit_id", authMiddleware.isValidAdmin, AdminControllers.closeFundRaiser) //test completed
adminRouter.patch("/active-bank/:edit_id/:benf_id", authMiddleware.isValidUser, AdminControllers.activeBankAccount)


adminRouter.delete("/delete-images/:fund_id/:type", authMiddleware.isValidAdmin, AdminControllers.deleteFundRaiserImage) // test completed

export default adminRouter

