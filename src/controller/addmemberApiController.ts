import { Response } from "express";
import Request from "../types/Request";
import { IUser,IResponse } from "../model/User";
import responseCode, { dataArray } from "../response_builder/responsecode";
import * as userApiService from "../service/userApiService";
import * as addmemberService from "../service/addmemberService";

const addmemberApiController = {
    /**
     * Request a data from user and register member and return user data.
     * @param req
     * @param res
     * @returns {*}
     */
    addMember: async function addMember(req: Request, res: Response) {
        let result: IResponse;
        try {
            let user: IUser = await userApiService.getUserById(req.userId);
            if (user.members.length < 4) {
                let member: object[] = await addmemberService.getMember(req.body.photoIdNumber);
                if (member.length === 0) {
                    const { photoIdProof, photoIdNumber, name, gender, yearOfBirth } = req.body;
                    let user: IUser = await addmemberService.addMemberService(req.userId, photoIdProof, photoIdNumber, name, gender, yearOfBirth);
                    result = {
                        meta: {
                            "responseCode": responseCode.Created,
                            "message": "member registered successfully",
                            "status": "Success",
                            "errors": dataArray
                        },
                        data: user
                    }
                } else {
                    result = {
                        meta: {
                            "responseCode": responseCode.Conflict,
                            "message": "member already registered",
                            "status": "Failed",
                            "errors": dataArray
                        },
                        data: dataArray
                    }
                }
            } else {
                result = {
                    meta: {
                        "responseCode": responseCode.Bad_Request,
                        "message": "you can only add 4 members",
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

    deleteMember: async function deleteMember(req: Request, res: Response) {
        let result: IResponse;
        try {
            let user: IUser = await userApiService.getUserById(req.userId);
            if (user.members.length > 0) {
                for (let i = 0; i < user.members.length; i++) {
                    if (user.members[i].firstDose === undefined) {
                        if (user.members[i].refId === req.query.refId) {
                            await addmemberService.deleteMemberService(req.userId, req.query.refId);
                            result = {
                                meta: {
                                    "responseCode": responseCode.Success,
                                    "message": "member deleted successfully",
                                    "status": "Success",
                                    "errors": dataArray
                                },
                                data: dataArray
                            }
                        } else {
                            result = {
                                meta: {
                                    "responseCode": responseCode.Forbidden,
                                    "message": "member already deleted",
                                    "status": "Failed",
                                    "errors": dataArray
                                },
                                data: dataArray
                            }
                        }
                    } else {
                        result = {
                            meta: {
                                "responseCode": responseCode.Forbidden,
                                "message": "you are not able to delete member",
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
                        "responseCode": responseCode.Forbidden,
                        "message": "member not exists",
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

export default addmemberApiController;