"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controller/adminController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const adminRouter = express_1.default.Router();
const AdminControllers = new adminController_1.AdminController();
const authMiddleware = new authMiddleware_1.default();
//Get method
adminRouter.get("/view/:profile_id", authMiddleware.isValidAdmin, AdminControllers.getSingleProfile);
adminRouter.get("/view/:limit/:page", authMiddleware.isValidAdmin, AdminControllers.getAllFundRaise);
//Post Method
adminRouter.post("/create", authMiddleware.isValidAdmin, AdminControllers.addFundRaiser);
//patch method
adminRouter.patch("/edit", authMiddleware.isValidAdmin, AdminControllers.editFundRaiser);
adminRouter.patch("/update_status", authMiddleware.isValidAdmin, AdminControllers.updateStatus);
adminRouter.patch("/close", authMiddleware.isValidAdmin, AdminControllers.closeFundRaiser);
exports.default = adminRouter;
