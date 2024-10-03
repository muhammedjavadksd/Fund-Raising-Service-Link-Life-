import UserController from "../controller/userController";
import express, { Router } from 'express'
import AuthMiddleware from "../middleware/authMiddleware";
import { Request, Response } from 'express'
const userRouter: Router = express.Router();

const UserControllers = new UserController();
const authMiddleware = new AuthMiddleware()

userRouter.get("/", (req: Request, res: Response) => {
    res.status(200).send("Welcome to fund raiser service");
})

//Get method
userRouter.get("/view/self/:limit/:page/:status?", authMiddleware.isValidUser, UserControllers.getUserFundRaisePost); //test completed
userRouter.get("/view/:category/:limit/:page", UserControllers.categoryFundRaiserPaginated); //test completed
userRouter.get("/view/:profile_id", authMiddleware.hasUser, UserControllers.getSingleProfile); //test completed
userRouter.get("/view/:limit/:page", UserControllers.getActiveFundRaise); //test completed
userRouter.get("/comment/:fund_id/:limit/:page/", UserControllers.getPaginatedComments);//test completed
userRouter.get("/donation-history/:fund_id/:limit/:page", UserControllers.donationHistory);//test completed
userRouter.get("/my-donation-history/:limit/:page", authMiddleware.isValidUser, UserControllers.myDonationHistory);//test completed
userRouter.get("/find-payment-order/:order_id", UserControllers.findPaymentOrder);//test completed
userRouter.get("/presigned-url", authMiddleware.isValidUser, UserControllers.getPresignedUrl);//test completed
userRouter.get("/bank-accounts/:edit_id/:limit/:page", authMiddleware.isValidUser, authMiddleware.isFundRaiseRequestValid, UserControllers.getBankAccounts);//test completed
userRouter.get("/bank-active-accounts/:edit_id/:limit/:page", UserControllers.getActiveBankAccounts);//test completed
userRouter.get("/profile-bank-account/:edit_id/:limit/:page", authMiddleware.isValidUser, UserControllers.profileBankAccounts);//test completed
userRouter.get("/donation-statistics/:fund_id", UserControllers.getDonationStatitics);//test completed

//payemnt post
userRouter.post("/pay/:fund_id", UserControllers.payToFundRaiser)
userRouter.post("/verify-payment", UserControllers.verifyPayment)

// POST method
userRouter.post("/create", authMiddleware.isValidUser, UserControllers.createFundRaise); //test completed
userRouter.post("/add-bank-account/:edit_id", authMiddleware.isValidUser, authMiddleware.isFundRaiseRequestValid, UserControllers.addBankAccount); //test completed
userRouter.post("/add_comment/:post_id", authMiddleware.isValidUser, UserControllers.addComment)
userRouter.post("/verify-close-token", UserControllers.verifyCloseToken)

//Patch method
userRouter.patch("/edit/:edit_id", authMiddleware.isValidUser, authMiddleware.isFundRaiseRequestValid, UserControllers.editFundRaise); //test completed
userRouter.patch("/upload_images/:edit_id", authMiddleware.isValidUser, authMiddleware.isFundRaiseRequestValid, UserControllers.uploadImage); // test completed
userRouter.patch("/close/:edit_id", authMiddleware.isValidUser, authMiddleware.isFundRaiseRequestValid, UserControllers.closeFundRaise); // test completed
userRouter.patch("/edit_comment/:comment_id", authMiddleware.isValidUser, authMiddleware.isValidCommentOwner, UserControllers.editComment)

//delete method
userRouter.delete("/delete_image/:type/:edit_id", authMiddleware.isValidUser, authMiddleware.isFundRaiseRequestValid, UserControllers.deleteImage) //test completed
userRouter.delete("/delete_comment/:comment_id", authMiddleware.isValidUser, authMiddleware.isValidCommentOwner, UserControllers.deleteComment)
userRouter.delete("/delete-bank-account/:edit_id/:benf_id", authMiddleware.isValidUser, authMiddleware.isFundRaiseRequestValid, UserControllers.deleteBankAccount)


export default userRouter

