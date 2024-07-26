"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FundRaiserService_1 = __importDefault(require("../services/FundRaiserService"));
const DbEnum_1 = require("../types/Enums/DbEnum");
class OrganizationController {
    constructor() {
        this.fundRaiserService = new FundRaiserService_1.default();
    }
    getAllFundRaise(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const organization_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.organization_id;
            const limit = +req.params.limit;
            const skip = +req.params.skip;
            const findAllPost = yield this.fundRaiserService.getOwnerFundRaise(organization_id, DbEnum_1.FundRaiserCreatedBy.ORGANIZATION, limit, skip);
            res.status(findAllPost.statusCode).json({ status: findAllPost.status, msg: findAllPost.msg, data: findAllPost.data });
        });
    }
    getSingleProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const profile_id = req.params.profile_id;
            const organization_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.organization_id;
            const findProfile = yield this.fundRaiserService.getOwnerSingleProfile(profile_id, DbEnum_1.FundRaiserCreatedBy.ORGANIZATION, organization_id);
            res.status(findProfile.statusCode).json({ status: findProfile.status, msg: findProfile.msg, data: findProfile.data });
        });
    }
    editFundRaiser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const edit_id = req.params.edit_id;
            const edit_data = req.body.edit_data;
            const editFundRaiser = yield this.fundRaiserService.editFundRaiser(edit_id, edit_data);
            res.status(editFundRaiser.statusCode).json({ status: editFundRaiser.status, msg: editFundRaiser.msg });
        });
    }
    addFundRaiser(req, res) {
        throw new Error("Method not implemented.");
    }
    updateStatus(req, res) {
        throw new Error("Method not implemented.");
    }
    closeFundRaiser(req, res) {
        throw new Error("Method not implemented.");
    }
}
exports.default = OrganizationController;
