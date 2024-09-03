import UserController from "../controller/userController";
import express, { Router } from 'express'
import AuthMiddleware from "../middleware/authMiddleware";
import { Multer } from "multer";


const userRouter: Router = express.Router();

const UserControllers = new UserController();
const authMiddleware = new AuthMiddleware()
const multer = require("multer");
const multerDisk = multer.memoryStorage();
const multerStorage = multer({ storage: multerDisk })

userRouter.get("/generate_presigned_url", UserControllers.getPresignedUrl); //test completed
userRouter.put("/upload_image_presigned", multerStorage.single("file"), UserControllers.uploadImageIntoS3); //test completed


//Get method
userRouter.get("/view/self/:limit/:page", authMiddleware.isValidUser, UserControllers.getUserFundRaisePost); //test completed
userRouter.get("/view/:profile_id", UserControllers.getSingleProfile); //test completed
userRouter.get("/view/:limit/:page", UserControllers.getActiveFundRaise); //test completed
userRouter.get("/view/:category/:limit/:page", UserControllers.categoryFundRaiserPaginated); //test completed
userRouter.get("/comment/:fund_id/:limit/:page/", UserControllers.getPaginatedComments);//test completed



// POST method
userRouter.post("/create", authMiddleware.isValidUser, UserControllers.createFundRaise); //test completed
userRouter.post("/add_comment/:post_id", authMiddleware.isValidUser, UserControllers.addComment)
userRouter.post("/verify-close-token", UserControllers.verifyCloseToken)

//Patch method
userRouter.patch("/edit/:edit_id", authMiddleware.isValidUser, authMiddleware.isFundRaiseRequestValid, UserControllers.editFundRaise); //test completed
userRouter.patch("/upload_images/:edit_id", authMiddleware.isValidUser, authMiddleware.isFundRaiseRequestValid, UserControllers.uploadImage); // test completed
userRouter.patch("/close/:edit_id", authMiddleware.isValidUser, authMiddleware.isFundRaiseRequestValid, UserControllers.closeFundRaise); // test completed
userRouter.patch("/edit_comment/:comment_id", authMiddleware.isValidUser, authMiddleware.isValidCommentOwner, UserControllers.editComment)

//delete method
userRouter.delete("/delete_image/:type/:edit_id/:bucket_name/:image_id", authMiddleware.isValidUser, authMiddleware.isFundRaiseRequestValid, UserControllers.deleteImage) //test completed
userRouter.delete("/delete_comment/:comment_id", authMiddleware.isValidUser, authMiddleware.isValidCommentOwner, UserControllers.deleteComment)


export default userRouter

