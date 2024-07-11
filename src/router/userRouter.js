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
//Get method
userRouter.get("/view/:profile_id", UserControllers.getSingleProfile);
userRouter.get("/view/:limit/:page", UserControllers.getActiveFundRaise);
userRouter.get("/view/self", authMiddleware.isValidUser, UserControllers.getUserFundRaisePost);
// POST method
userRouter.post("/create", authMiddleware.isValidUser, UserControllers.createFundRaise); //test completed
//Patch method
userRouter.patch("/edit/:edit_id", authMiddleware.isValidUser, authMiddleware.isFundRaiseRequestValid, UserControllers.editFundRaise); //test completed
userRouter.patch("/upload_images/:fund_id", authMiddleware.isValidUser, authMiddleware.isFundRaiseRequestValid, UserControllers.uploadImage);
userRouter.patch("/close", authMiddleware.isValidUser, authMiddleware.isFundRaiseRequestValid, UserControllers.closeFundRaise);
//delete method
userRouter.delete("/delete_image/:type/:edit_id/:image_id", authMiddleware.isValidUser, authMiddleware.isFundRaiseRequestValid, UserControllers.deleteImage);
exports.default = userRouter;
