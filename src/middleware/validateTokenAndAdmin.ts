import { Response, NextFunction } from "express";
import Request from "../types/Request";
import { IResponse } from "../model/User";
import responseCode, { dataArray } from "../response_builder/responsecode";
import authenticate from "./validateToken";

export default function (req: Request, res: Response, next: NextFunction) {
  let result: IResponse;
  try {
    console.log(req.isAdmin);
    authenticate(req, res, () => {
      if (req.isAdmin) {
        next();
      } else {
        result = {
          meta: {
            "responseCode": responseCode.Forbidden,
            "message": "you are not admin",
            "status": "Failed",
            "errors": dataArray
          },
          data: dataArray
        }
        return res.status(result.meta['responseCode']).json(result);
      }
    })
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