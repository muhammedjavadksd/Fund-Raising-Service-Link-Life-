


const express = require("express");
const adminController = require("../../controller/adminController");
const authMiddleware = require("../../middleware/authMiddleware");
const adminRouter = express.Router();

//Get method
adminRouter.get("/view/:id", authMiddleware.isValidAdmin, adminController.createFundRaise);
adminRouter.get("/view", authMiddleware.isValidAdmin, adminController.createFundRaise);

// POST method
adminRouter.post("/create", authMiddleware.isValidAdmin, adminController.createFundRaise);

//Patch method
adminRouter.patch("/edit", authMiddleware.isValidAdmin, adminController.createFundRaise);
adminRouter.patch("/close", authMiddleware.isValidAdmin, adminController.createFundRaise);

module.exports = adminRouter;

