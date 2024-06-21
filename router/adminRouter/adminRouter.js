


const express = require("express");
const adminController = require("../../controller/adminController");
const authMiddleware = require("../../middleware/authMiddleware");
const adminRouter = express.Router();

//Get method
adminRouter.get("/view/:profile_id", authMiddleware.isValidAdmin, adminController.getSingleProfile);
adminRouter.get("/view", authMiddleware.isValidAdmin, adminController.createFundRaise);


module.exports = adminRouter;

