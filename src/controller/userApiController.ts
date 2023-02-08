import bcrypt from "bcrypt";
import { Response } from "express";
import Request from "../types/Request";
import { IUser, IResponse } from "../model/User";
import responseCode, { dataArray } from "../response_builder/responsecode";
import * as userApiService from "../service/userApiService";

const userApiController = {
    /**
     * Request a mobile & password from User and login or register the user and return jwt token.
     * @param req
     * @param res
     * @returns {*}
     */
    loginRegister: async function loginRegister(req: Request, res: Response) {
        let result: IResponse;
        try {
            let user: IUser = await userApiService.getUser(req.body.mobile);
            if (user) {
                const isMatch: boolean = await bcrypt.compare(req.body.password, user.password);
                if (isMatch) {
                    const token: string = userApiService.createToken(user._id, user.isAdmin);
                    result = {
                        meta: {
                            "responseCode": responseCode.Success,
                            "message": "logged in successfully",
                            "status": "Success",
                            "errors": dataArray
                        },
                        data: { token }
                    }
                } else {
                    result = {
                        meta: {
                            "responseCode": responseCode.Unauthorized,
                            "message": "invalid credential",
                            "status": "Success",
                            "errors": dataArray
                        },
                        data: dataArray
                    }
                }
            } else {
                const token: string = await userApiService.createUser(req.body.mobile, req.body.password);
                result = {
                    meta: {
                        "responseCode": responseCode.Created,
                        "message": "registered Successfully",
                        "status": "Success",
                        "errors": dataArray
                    },
                    data: { token }
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

    /**
     * Request a jwt token from User and fetch user data.
     * @param req
     * @param res
     * @returns {*}
     */
    fetchUserData: async function fetchUserData(req: Request, res: Response) {
        let result: IResponse;
        try {
            let user: IUser = await userApiService.getUserById(req.userId);
            result = {
                meta: {
                    "responseCode": responseCode.Success,
                    "message": "user fetched successfully",
                    "status": "Success",
                    "errors": dataArray
                },
                data: user
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

export default userApiController;
