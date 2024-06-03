

const express = require("express");
const userController = require("../../controller/userController");
const userRouter = express.Router();

userRouter.post("/create", authMiddleware.isValidUser, userController.createFundRaise);

module.exports = userRouter;

