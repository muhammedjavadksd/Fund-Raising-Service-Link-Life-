

const express = require("express");
const userController = require("../../controller/userController");
const authMiddleware = require("../../middleware/authMiddleware");
const userRouter = express.Router();

//Get method
userRouter.get("/view/:id", authMiddleware.isValidUser, userController.createFundRaise);
userRouter.get("/view", authMiddleware.isValidUser, userController.createFundRaise);

// POST method
userRouter.post("/create", authMiddleware.isValidUser, userController.createFundRaise);
userRouter.post("/upload_images", authMiddleware.isValidUser, userController.uploadImage);

//Patch method
userRouter.patch("/edit/:edit_id", authMiddleware.isValidUser, userController.createFundRaise);
userRouter.patch("/upload_images/:fund_id", authMiddleware.isValidUser, userController.createFundRaise);
userRouter.patch("/close", authMiddleware.isValidUser, userController.createFundRaise);


module.exports = userRouter;

