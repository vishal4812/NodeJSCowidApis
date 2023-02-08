import { Response } from "express";
import Request from "../types/Request";
import { IMembers, IUser, IResponse } from "../model/User";
import responseCode, { dataArray } from "../response_builder/responsecode";
import * as userApiService from "../service/userApiService";
import * as vaccinatedApiService from "../service/vaccinatedApiService";

const vaccinatedApiController = {
    /**
     * Request a secret code and dose from user and done vaccinated and return user data.
     * @param req
     * @param res
     * @returns {*}
     */
    vaccinated: async function vaccinated(req: Request, res: Response) {
        let result: IResponse;
        try {
            let user: IUser = await userApiService.getUserBySecretCode(req.body.secretCode);
            if (user !== null) {
                for (let j = 0; j < user.members.length; j++) {
                    let element: IMembers = user.members[j];
                    if (element.secretCode === req.body.secretCode) {
                        let first: any = element.firstDose;
                        let second: any = element.secondDose;
                        switch (req.body.dose) {
                            case "first":
                                if (first === undefined) {
                                    result = {
                                        meta: {
                                            "responseCode": responseCode.Not_Found,
                                            "message": "first dose not scheduled",
                                            "status": "Failed",
                                            "errors": dataArray
                                        },
                                        data: dataArray
                                    }
                                } else {
                                    if (first.vaccinatedType === "success") {
                                        result = {
                                            meta: {
                                                "responseCode": responseCode.Forbidden,
                                                "message": "already vaccinated with first dose",
                                                "status": "Success",
                                                "errors": dataArray
                                            },
                                            data: dataArray
                                        }
                                    } else {
                                        await vaccinatedApiService.setFirstDoseStatus(element, user);
                                        result = {
                                            meta: {
                                                "responseCode": responseCode.Created,
                                                "message": "vaccinated with first dose successfully",
                                                "status": "Success",
                                                "errors": dataArray
                                            },
                                            data: user
                                        }
                                    }
                                }
                                break;

                            case "second":
                                if (first === undefined) {
                                    result = {
                                        meta: {
                                            "responseCode": responseCode.Not_Found,
                                            "message": "first dose not scheduled",
                                            "status": "Failed",
                                            "errors": dataArray
                                        },
                                        data: dataArray
                                    }
                                } else {
                                    if (first.vaccinatedType === "scheduled") {
                                        result = {
                                            meta: {
                                                "responseCode": responseCode.Not_Found,
                                                "message": "second dose not scheduled",
                                                "status": "Failed",
                                                "errors": dataArray
                                            },
                                            data: dataArray
                                        }
                                    } else {
                                        if (second.vaccinatedType === undefined) {
                                            result = {
                                                meta: {
                                                    "responseCode": responseCode.Not_Found,
                                                    "message": "second dose not scheduled",
                                                    "status": "Failed",
                                                    "errors": dataArray
                                                },
                                                data: dataArray
                                            }
                                        } else {
                                            if (second.vaccinatedType === "success") {
                                                result = {
                                                    meta: {
                                                        "responseCode": responseCode.Forbidden,
                                                        "message": "already vaccinated with second dose",
                                                        "status": "Success",
                                                        "errors": dataArray
                                                    },
                                                    data: dataArray
                                                }
                                            } else {
                                                await vaccinatedApiService.setSecondDoseStatus(element, user);
                                                result = {
                                                    meta: {
                                                        "responseCode": responseCode.Created,
                                                        "message": "vaccinated with second dose successfully",
                                                        "status": "Success",
                                                        "errors": dataArray
                                                    },
                                                    data: user
                                                }
                                            }
                                        }
                                    }
                                }
                                break;

                            default:
                                result = {
                                    meta: {
                                        "responseCode": responseCode.Not_Found,
                                        "message": "dose not available",
                                        "status": "Failed",
                                        "errors": dataArray
                                    },
                                    data: dataArray
                                }
                                break;
                        }
                    } else {
                        result = {
                            meta: {
                                "responseCode": responseCode.Not_Found,
                                "message": "secretcode is not valid",
                                "status": "Failed",
                                "errors": dataArray
                            },
                            data: dataArray
                        }
                    }
                }
            } else {
                result = {
                    meta: {
                        "responseCode": responseCode.Not_Found,
                        "message": "secretcode is not valid",
                        "status": "Failed",
                        "errors": dataArray
                    },
                    data: dataArray
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

export default vaccinatedApiController;