"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const organizationController_1 = __importDefault(require("../controller/organizationController"));
const organizationRouter = express_1.default.Router();
const organizationController = new organizationController_1.default();
const authMiddleware = new authMiddleware_1.default();
//Get method
organizationRouter.get("/view/:profile_id", authMiddleware.isValidOrganization, organizationController.getSingleProfile); //test completed
organizationRouter.get("/view/:limit/:skip", authMiddleware.isValidOrganization, organizationController.getAllFundRaise); //test completed
//Post Method
organizationRouter.post("/create", authMiddleware.isValidOrganization, organizationController.addFundRaiser); // test completed
//patch method
organizationRouter.patch("/edit/:edit_id", authMiddleware.isValidOrganization, organizationController.editFundRaiser); //test completed
organizationRouter.patch("/update_status/:edit_id", authMiddleware.isValidOrganization, organizationController.updateStatus); //test completed
organizationRouter.patch("/close/:edit_id", authMiddleware.isValidOrganization, organizationController.closeFundRaiser); //test completed
exports.default = organizationRouter;
