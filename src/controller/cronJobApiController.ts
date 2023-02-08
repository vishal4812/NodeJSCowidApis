import moment from "moment";
import { Response } from "express";
import Request from "../types/Request";
import { IVaccineCenter } from "../model/vaccineCenter";
import { IResponse } from "../model/User";
import responseCode, { dataArray } from "../response_builder/responsecode";
import * as vaccineCenterApiService from "../service/vaccineCenterApiService";

const cronJobApiController = {
    cronJob: async function cronJob(req: Request, res: Response) {
        let result: IResponse;
        try {
            const center: IVaccineCenter[] = await vaccineCenterApiService.getAllCenter();
            for (let i = 0; i < center.length; i++) {
                for (let j = 0; j < center[i].vaccine.length; j++) {
                    const date1 = moment();
                    const date2 = moment(center[i].vaccine[j].date,"YYYY-MM-DD");
                    console.log(date1,date2);
                }
            }
            res.json("helo");
        } catch (err) {
            console.error(err.message);
            result = {
                meta: {
                    "responseCode": responseCode.Internal_Server_Error,
                    "message": "server error",
                    "status": "Failed",
                    "errors": dataArray
                },
                data: dataArray
            }
            return res.status(result.meta['responseCode']).json(result);
        }
    }
};

export default cronJobApiController;