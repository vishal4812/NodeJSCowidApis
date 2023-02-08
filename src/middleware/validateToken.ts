import config from "config";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Payload from "../types/Payload";
import Request from "../types/Request";
import { IResponse } from "../model/User";
import responseCode, { dataArray } from "../response_builder/responsecode";

export default (req: Request, res: Response, next: NextFunction) => {
  let result: IResponse;
  // Get token from header
  const token: string = req.headers.authorization.split(' ')[1];
  // Check if no token
  if (!token) {
    result = {
      meta: {
        "responseCode": responseCode.Unauthorized,
        "message": "No token, authorization denied",
        "status": "Failed",
        "errors": dataArray
      },
      data: dataArray
    }
    return res.status(result.meta['responseCode']).json(result);
  }
  // Verify token
  try {
    const payload: Payload | any = jwt.verify(token, config.get("jwtSecret"));
    req.userId = payload.user_id;
    req.isAdmin = payload.user_isAdmin;
    next();
  } catch (err) {
    result = {
      meta: {
        "responseCode": responseCode.Unauthorized,
        "message": "Token is not valid",
        "status": "Failed",
        "errors": dataArray
      },
      data: dataArray
    }
    return res.status(result.meta['responseCode']).json(result);
  }
}