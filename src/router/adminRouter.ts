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

//Post Method
adminRouter.post("/create", authMiddleware.isValidAdmin, AdminControllers.addFundRaiser) // test completed

//patch method
adminRouter.patch("/upload_images/:edit_id", authMiddleware.isValidAdmin, AdminControllers.uploadImages); // test completed
adminRouter.patch("/edit/:edit_id", AdminControllers.editFundRaiser) //test completed
adminRouter.patch("/update_status/:edit_id", authMiddleware.isValidAdmin, AdminControllers.updateStatus) //test completed
adminRouter.patch("/close/:edit_id", authMiddleware.isValidAdmin, AdminControllers.closeFundRaiser) //test completed
// adminRouter.post("/edit_fundraise", AdminControllers.editFundRaiser) // test completed


export default adminRouter

