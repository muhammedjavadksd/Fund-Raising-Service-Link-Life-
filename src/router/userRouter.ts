import UserController from "../controller/userController";
import express, { Router } from 'express'
import AuthMiddleware from "../middleware/authMiddleware";


const userRouter: Router = express.Router();

const UserControllers = new UserController();
const authMiddleware = new AuthMiddleware()

//Get method
userRouter.get("/view/:profile_id", UserControllers.getSingleProfile);
userRouter.get("/view/:limit/:page", UserControllers.getActiveFundRaise);
userRouter.get("/view/self", authMiddleware.isValidUser, UserControllers.getUserFundRaisePost);

// POST method
userRouter.post("/create", authMiddleware.isValidUser, UserControllers.createFundRaise);

//Patch method
userRouter.patch("/edit/:edit_id", authMiddleware.isValidUser, authMiddleware.isFundRaiseRequestValid, UserControllers.editFundRaise);
userRouter.patch("/upload_images/:fund_id", authMiddleware.isValidUser, UserControllers.uploadImage);
userRouter.patch("/close", authMiddleware.isValidUser, UserControllers.closeFundRaise);

//delete method
userRouter.delete("/delete_image/:type/:edit_id/:image_id", authMiddleware.isValidUser, authMiddleware.isFundRaiseRequestValid, UserControllers.deleteImage)


export default userRouter

