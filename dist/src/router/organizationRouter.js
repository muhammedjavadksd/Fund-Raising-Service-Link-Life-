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
organizationRouter.get("/view/:profile_id", authMiddleware.isValidOrganization, organizationController.getSingleProfile); //test pending
organizationRouter.get("/view/:limit/:skip", authMiddleware.isValidOrganization, organizationController.getAllFundRaise); //test pending
//Post Method
organizationRouter.post("/create", authMiddleware.isValidOrganization, organizationController.addFundRaiser);
//patch method
organizationRouter.patch("/edit/:edit_id", authMiddleware.isValidOrganization, authMiddleware.isOrganizationAuthraized, organizationController.editFundRaiser);
organizationRouter.patch("/update_status/:edit_id", authMiddleware.isValidOrganization, authMiddleware.isOrganizationAuthraized, organizationController.updateStatus);
organizationRouter.patch("/close/:edit_id", authMiddleware.isValidOrganization, authMiddleware.isValidOrganization, organizationController.closeFundRaiser);
exports.default = organizationRouter;
