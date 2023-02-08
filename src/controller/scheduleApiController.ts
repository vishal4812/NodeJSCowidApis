import { Response } from "express";
import Request from "../types/Request";
import { IMembers, IUser, IResponse } from "../model/User";
import responseCode, { dataArray } from "../response_builder/responsecode";
import { IVaccineCenter } from "../model/vaccineCenter";
import * as userApiService from "../service/userApiService";
import * as scheduleApiService from "../service/scheduleApiService";
import * as vaccineCenterApiService from "../service/vaccineCenterApiService";

const scheduleApiController = {
    /**
     * Request a data from user and schedule member vaccine and return user data.
     * @param req
     * @param res
     * @returns {*}
     */
    schedule: async function schedule(req: Request, res: Response) {
        let result: IResponse;
        try {
            let user: IUser = await userApiService.getUserById(req.userId);
            for (let k = 0; k < user.members.length; k++) {
                let element: IMembers = user.members[k];
                if (element.refId === req.body.refId) {
                    let center: IVaccineCenter = await vaccineCenterApiService.getCenterByName(req.body.address);
                    if (center === null || center.isAvailable === false) {
                        result = {
                            meta: {
                                "responseCode": responseCode.Not_Found,
                                "message": "center not available",
                                "status": "Failed",
                                "errors": dataArray
                            },
                            data: dataArray
                        }
                    } else {
                        if (element.firstDose === undefined) {
                            const { address, vaccineType, age, cost, date, timeSlot } = req.body;
                            const doseNo: string = "first";
                            const userData: IUser = await scheduleApiService.createDose(element, user, center, doseNo, address, vaccineType, age, cost, date, timeSlot);
                            result = {
                                meta: {
                                    "responseCode": responseCode.Created,
                                    "message": "firstdose scheduled successfully",
                                    "status": "Success",
                                    "errors": dataArray
                                },
                                data: userData
                            }
                        } else {
                            let first: any = element.firstDose;
                            let second: any = element.secondDose;
                            if (first.vaccinatedType === "success") {
                                if (second.vaccinatedType === "success") {
                                    result = {
                                        meta: {
                                            "responseCode": responseCode.Forbidden,
                                            "message": "vaccinated successfully",
                                            "status": "Success",
                                            "errors": dataArray
                                        },
                                        data: dataArray
                                    }
                                } else {
                                    if (second.vaccinatedType === "scheduled") {
                                        result = {
                                            meta: {
                                                "responseCode": responseCode.Forbidden,
                                                "message": "second dose already scheduled",
                                                "status": "Failed",
                                                "errors": dataArray
                                            },
                                            data: dataArray
                                        }
                                    } else {
                                        const { address, vaccineType, age, cost, date, timeSlot } = req.body;
                                        const doseNo: string = "second";
                                        const userData: IUser = await scheduleApiService.createDose(element, user, center, doseNo, address, vaccineType, age, cost, date, timeSlot);
                                        result = {
                                            meta: {
                                                "responseCode": responseCode.Created,
                                                "message": "second dose scheduled successfully",
                                                "status": "Success",
                                                "errors": dataArray
                                            },
                                            data: userData
                                        }
                                    }
                                }
                            } else {
                                result = {
                                    meta: {
                                        "responseCode": responseCode.Forbidden,
                                        "message": "you are not able to schedule second dose please take first dose",
                                        "status": "Failed",
                                        "errors": dataArray
                                    },
                                    data: dataArray
                                }
                            }
                        }
                    }
                } else {
                    result = {
                        meta: {
                            "responseCode": responseCode.Not_Found,
                            "message": "reference id is not valid",
                            "status": "Failed",
                            "errors": dataArray
                        },
                        data: dataArray
                    }
                }
            }
        } catch (err) {
            result = {
                meta: {
                    "responseCode": responseCode.Internal_Server_Error,
                    "message": "server error",
                    "status": "Failed",
                    "errors": dataArray
                },
                data: dataArray
            }
        }
        return res.status(result.meta['responseCode']).json(result);
    }
};

export default scheduleApiController;