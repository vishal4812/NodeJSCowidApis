import { Response } from "express";

export function responseFunction(meta: object, data: object, resCode: number, res: Response) {
    let response: object = { meta, data };
    return res.status(resCode).json(response);
}

export function responseFunctions(data: object, resCode: number, res: Response,message: string,status:string){
    return res.status(resCode).json({status: status, data: data, message: message});
}