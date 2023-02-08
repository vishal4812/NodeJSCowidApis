import { NextFunction, Response } from "express";
import { validationResult, ValidationChain, ValidationError, Result } from "express-validator";
import { IResponse } from "../model/User";
import responseCode, { dataArray } from "../response_builder/responsecode";
import Request from "../types/Request";

export const validateRequest = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (let i = 0; i < validations.length; i++) {
      const result: any = await validations[i].run(req);
      if (result.errors.length) break;
    }
    validate(req, res, next);
  };
};

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors: Result<ValidationError> = validationResult(req);
  let result: IResponse;
  if (!errors.isEmpty()) {
    result = {
      meta: {
        "responseCode": responseCode.Bad_Request,
        "message": "Bad Request",
        "status": "Failed",
        "errors": errors.array()
      },
      data: dataArray
    }
    return res.status(result.meta['responseCode']).json(result);
  } else {
    next();
  }
}