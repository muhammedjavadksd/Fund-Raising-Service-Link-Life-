import { NextFunction, Response } from "express"
import { CustomRequest } from "../DataType/Objects"

interface IAuthMiddleware {
    isValidUser(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    isFundRaiseRequestValid(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    isValidAdmin(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
}

export { IAuthMiddleware }

