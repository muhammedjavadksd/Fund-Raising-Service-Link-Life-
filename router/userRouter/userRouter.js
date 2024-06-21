

const express = require("express");
const userController = require("../../controller/userController");
const authMiddleware = require("../../middleware/authMiddleware");
const userRouter = express.Router();

//Get method
userRouter.get("/view/:profile_id", userController.getSingleProfile);
userRouter.get("/view/:limit/:page", userController.getActiveFundRaise);

// POST method
userRouter.post("/create", authMiddleware.isValidUser, userController.createFundRaise);
userRouter.post("/upload_images", authMiddleware.isValidUser, userController.uploadImage);

//Patch method
userRouter.patch("/edit/:edit_id", authMiddleware.isValidUser, authMiddleware.isFundRaiseRequestValid, userController.editFundRaise);
userRouter.patch("/upload_images/:fund_id", authMiddleware.isValidUser, userController.createFundRaise);
userRouter.patch("/close", authMiddleware.isValidUser, userController.createFundRaise);

//delete method
userRouter.delete("/delete_image/:type/:edit_id/:image_id", authMiddleware.isValidUser, authMiddleware.isFundRaiseRequestValid, userController.deleteImage)


module.exports = userRouter;

