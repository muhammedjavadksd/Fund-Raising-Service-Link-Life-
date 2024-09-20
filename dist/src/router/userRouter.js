"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = __importDefault(require("../controller/userController"));
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const userRouter = express_1.default.Router();
const UserControllers = new userController_1.default();
const authMiddleware = new authMiddleware_1.default();
const multer = require("multer");
const multerDisk = multer.memoryStorage();
const multerStorage = multer({ storage: multerDisk });
// userRouter.get("/generate_presigned_url", UserControllers.getPresignedUrl); //test completed
// userRouter.put("/upload_image_presigned", multerStorage.single("file"), UserControllers.uploadImageIntoS3); //test completed
//Get method
userRouter.get("/view/self/:limit/:page/:status?", authMiddleware.isValidUser, UserControllers.getUserFundRaisePost); //test completed
userRouter.get("/view/:category/:limit/:page", UserControllers.categoryFundRaiserPaginated); //test completed
userRouter.get("/view/:profile_id", authMiddleware.hasUser, UserControllers.getSingleProfile); //test completed
userRouter.get("/view/:limit/:page", UserControllers.getActiveFundRaise); //test completed
userRouter.get("/comment/:fund_id/:limit/:page/", UserControllers.getPaginatedComments); //test completed
userRouter.get("/donation-history/:fund_id/:limit/:page", UserControllers.donationHistory); //test completed
userRouter.get("/my-donation-history/:limit/:page", authMiddleware.isValidUser, UserControllers.myDonationHistory); //test completed
userRouter.get("/find-payment-order/:order_id", authMiddleware.isValidUser, UserControllers.findPaymentOrder); //test completed
//payemnt post
userRouter.post("/pay/:fund_id", authMiddleware.isValidUser, UserControllers.payToFundRaiser);
userRouter.post("/verify-payment", UserControllers.verifyPayment);
// POST method
userRouter.post("/create", authMiddleware.isValidUser, UserControllers.createFundRaise); //test completed
userRouter.post("/add_comment/:post_id", authMiddleware.isValidUser, UserControllers.addComment);
userRouter.post("/verify-close-token", UserControllers.verifyCloseToken);
//Patch method
userRouter.patch("/edit/:edit_id", authMiddleware.isValidUser, authMiddleware.isFundRaiseRequestValid, UserControllers.editFundRaise); //test completed
userRouter.patch("/upload_images/:edit_id", authMiddleware.isValidUser, authMiddleware.isFundRaiseRequestValid, UserControllers.uploadImage); // test completed
userRouter.patch("/close/:edit_id", authMiddleware.isValidUser, authMiddleware.isFundRaiseRequestValid, UserControllers.closeFundRaise); // test completed
userRouter.patch("/edit_comment/:comment_id", authMiddleware.isValidUser, authMiddleware.isValidCommentOwner, UserControllers.editComment);
//delete method
userRouter.delete("/delete_image/:type/:edit_id", authMiddleware.isValidUser, authMiddleware.isFundRaiseRequestValid, UserControllers.deleteImage); //test completed
userRouter.delete("/delete_comment/:comment_id", authMiddleware.isValidUser, authMiddleware.isValidCommentOwner, UserControllers.deleteComment);
exports.default = userRouter;
