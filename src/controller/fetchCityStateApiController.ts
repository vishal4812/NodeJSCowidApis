import { Response } from "express";
import Request from "../types/Request";
import { IResponse } from "../model/User";
import responseCode, { dataArray } from "../response_builder/responsecode";
const { getStates, getCities } = require('cities-states-countries');

const fetchCityStateApiController = {
    /**
     * Request a jwt token from User and return user data.
     * @param req
     * @param res
     * @returns {*}
     */
    fetchStateByCountry: async function fetchStateByCountry(req: Request, res: Response) {
        let result: IResponse;
        try {
            let countryName: string = req.query.countryName.toString();
            let states: object[] = getStates(countryName);
            if (states.length !== 0) {
                result = {
                    meta: {
                        "responseCode": responseCode.Success,
                        "message": "states fetched successfully",
                        "status": "Success",
                        "errors": dataArray
                    },
                    data: states
                }
            } else {
                result = {
                    meta: {
                        "responseCode": responseCode.Not_Found,
                        "message": "country code not Valid",
                        "status": "Failed",
                        "errors": dataArray
                    },
                    data: dataArray
                }
            }
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
        }
        return res.status(result.meta['responseCode']).json(result);
    },

    fetchCityByStateAndCountry: async function fetchCityByStateAndCountry(req: Request, res: Response) {
        let result: IResponse;
        try {
            let stateName: string = req.query.stateName.toString();
            let countryName: string = req.query.countryName.toString();
            let cities: object[] = getCities(countryName, stateName);
            if (cities === undefined || cities.length === 0) {
                result = {
                    meta: {
                        "responseCode": responseCode.Not_Found,
                        "message": "country & state name not Valid",
                        "status": "Failed",
                        "errors": dataArray
                    },
                    data: dataArray
                }
            } else {
                result = {
                    meta: {
                        "responseCode": responseCode.Success,
                        "message": "cities fetched successfully",
                        "status": "Success",
                        "errors": dataArray
                    },
                    data: cities
                }
            }
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
        }
        return res.status(result.meta['responseCode']).json(result);
    }
};

export default fetchCityStateApiController;
