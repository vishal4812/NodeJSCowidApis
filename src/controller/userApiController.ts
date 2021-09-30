import config from "config";
import bcrypt from "bcrypt";
import { Response } from "express";
import Request from "../types/Request";
import User, { IMembers, IUser } from "../model/User";
import jwt from "jsonwebtoken"
import { success, error, dataArray } from "../response_builder/responsefunction";
import responsecode from "../response_builder/responsecode";
import moment from "moment";
import * as cowidService from "../service/cowidService";
const { Validator } = require('node-input-validator');

const userApiController = {
    /**
     * Request a data from User
     * @param req
     * @param res
     * @returns {*}
     */
    loginRegister: async function loginRegister(req: Request, res: Response) {
        const validate = new Validator(req.body, {
            mobile: 'required|integer|minLength:10|maxLength:10',
            password: 'required|minLength:8',
        })
        const matched: boolean = await validate.check();
        const { mobile, password } = req.body;
        const salt: string = await bcrypt.genSalt(10);
        const hashed: string = await bcrypt.hash(password, salt);
        const userFields: object = {
            mobile,
            password: hashed
        };
        try {
            if (!matched) {
                let meta: object = { message: "Bad Request", status: "Failed", errors: validate.errors };
                res.status(responsecode.Bad_Request).json(error(meta, dataArray));
            } else {
                let user: IUser = await User.findOne({ mobile: mobile });
                if (user) {
                    const isMatch: boolean = await bcrypt.compare(password, user.password);
                    if (isMatch) {
                        const token = jwt.sign(
                            { user_id: user._id },
                            config.get("jwtSecret"),
                            { expiresIn: config.get("jwtExpiration") }
                        );
                        let meta: object = { message: "logged in successfully", status: "Success" };
                        res.status(responsecode.Success).json(success(meta, { token }));
                    } else {
                        let meta: object = { message: "Invalid Credential", status: "Failed" };
                        res.status(responsecode.Unauthorized).json(error(meta, dataArray));
                    }
                } else {
                    user = new User(userFields);
                    await user.save();
                    const token = jwt.sign(
                        { user_id: user._id },
                        config.get("jwtSecret"),
                        { expiresIn: config.get("jwtExpiration") }
                    );
                    let meta: object = { message: "registered successfully", status: "Success" };
                    res.status(responsecode.Success).json(success(meta, { token }));
                }
            }
        } catch (err) {
            console.error(err.message);
            let meta: object = { message: "Server error", status: "Failed" };
            res.status(responsecode.Internal_Server_Error).json(error(meta, dataArray));
        }
    },

    userData: async function userData(req: Request, res: Response) {
        try {
            let user: IUser = await User.findById(req.userId).select("-password");
            let meta: object = { message: "User Data", status: "success" };
            res.status(responsecode.Success).json(success(meta, user));
        } catch (err) {
            console.error(err.message);
            let meta: object = { message: "Server error", status: "Failed" };
            res.status(responsecode.Internal_Server_Error).json(error(meta, dataArray));
        }
    },

    addMember: async function addMember(req: Request, res: Response) {
        const validate = new Validator(req.body, {
            photoId: 'required|string',
            photoIdNumber: 'required|string',
            name: 'required|string',
            gender: 'required|string',
            yearOfBirth: 'required|integer'
        })
        const matched: boolean = await validate.check();
        const { photoId, photoIdNumber, name, gender, yearOfBirth } = req.body;
        let refId: number = new Date().valueOf();
        let secretCode: number = +refId.toString().substr(-4);
        let vaccinatedType: string = "Not Vaccinated";
        const memberFields: IMembers = {
            photoId,
            photoIdNumber,
            name,
            gender,
            yearOfBirth,
            refId: refId,
            secretCode: secretCode,
            vaccinatedType: vaccinatedType,
            firstDose: {},
            secondDose: {}
        };
        try {
            if (!matched) {
                let meta: object = { message: "Bad Request", status: "Failed", errors: validate.errors };
                res.status(responsecode.Bad_Request).json(error(meta, dataArray));
            } else {
                let user: IUser = await User.findById(req.userId);
                if (!user) {
                    let meta: object = { message: "User not found", status: "Failed", errors: validate.errors };
                    res.status(responsecode.Not_Found).json(error(meta, dataArray));
                } else {
                    if (user.members.length < 4) {
                        let member = await User.find({ members: { $elemMatch: { photoIdNumber: req.body.photoIdNumber } } });
                        if (member.length === 0) {
                            await user.members.push(memberFields);
                            await user.save();
                            let meta: object = { message: "member registered successfully", status: "Success" };
                            res.status(responsecode.Success).json(success(meta, user));
                        } else {
                            let meta: object = { message: "member already registered", status: "Failed" };
                            res.status(responsecode.Bad_Request).json(error(meta, dataArray));
                        }
                    } else {
                        let meta: object = { message: "you can only add 4 members", status: "Failed" };
                        res.status(responsecode.Bad_Request).json(error(meta, dataArray));
                    }
                }
            }
        } catch (err) {
            console.error(err.message);
            let meta: object = { message: "Server error", status: "Failed" };
            res.status(responsecode.Internal_Server_Error).json(error(meta, dataArray));
        }
    },

    schedule: async function schedule(req: Request, res: Response) {
        const validate = new Validator(req.body, {
            secretCode: 'required|integer',
            address: 'required|string',
            vaccineType: 'required|string',
            age: 'required|string',
            cost: 'required|string',
            date: 'required|string',
            timeSlot: 'required|string',
            vaccinatedType: 'string'
        });
        const matched: boolean = await validate.check();
        const { address, vaccineType, age, cost, date, timeSlot } = req.body;
        let scheduled: string = "scheduled";
        const doseFields: object = {
            address,
            vaccineType,
            age,
            cost,
            date,
            timeSlot,
            vaccinatedType: scheduled
        };
        try {
            if (!matched) {
                let meta: object = { message: "Bad Request", status: "Failed", errors: validate.errors };
                res.status(responsecode.Bad_Request).json(error(meta, dataArray));
            } else {
                let user: IUser = await User.findById(req.userId).select("-password");
                if (!user) {
                    let meta: object = { message: "User not found", status: "Failed", errors: validate.errors };
                    res.status(responsecode.Not_Found).json(error(meta, dataArray));
                } else {
                    for (let k = 0; k < user.members.length; k++) {
                        if (user.members[k].secretCode === req.body.secretCode) {
                            if (user.members[k].firstDose === undefined) {
                                user.members[k].firstDose = doseFields;
                                await user.save();
                                let meta: object = { message: "firstdose scheduled successfully", status: "Success" };
                                res.status(responsecode.Success).json(success(meta, user));
                            } else {
                                let first: any = user.members[k].firstDose;
                                let second: any = user.members[k].secondDose;
                                if (first.vaccinatedType === "success") {
                                    if (second.vaccinatedType === "success") {
                                        let meta: object = { message: "vaccinated successfully", status: "Success" };
                                        res.status(responsecode.Success).json(success(meta, dataArray));
                                    } else {
                                        if (second.vaccinatedType === "scheduled") {
                                            let meta: object = { message: "second dose already scheduled", status: "Success" };
                                            res.status(responsecode.Success).json(success(meta, dataArray));
                                        } else {
                                            user.members[k].secondDose = doseFields;
                                            await user.save();
                                            let meta: object = { message: "second dose scheduled successfully", status: "Success" };
                                            res.status(responsecode.Success).json(success(meta, user));
                                        }
                                    }
                                } else {
                                    let meta: object = { message: "you are not able to schedule second dose take first dose", status: "Failed", errors: validate.errors };
                                    res.status(responsecode.Not_Found).json(error(meta, dataArray));
                                }
                            }
                        } else {
                            let meta: object = { message: "secretcode is not valid", status: "Failed" };
                            res.status(responsecode.Internal_Server_Error).json(error(meta, dataArray));
                        }
                    }
                }
            }
        } catch (err) {
            console.error(err.message);
            let meta: object = { message: "Server error", status: "Failed" };
            res.status(responsecode.Internal_Server_Error).json(error(meta, dataArray));
        }
    },

    vaccinated: async function vaccinated(req: Request, res: Response) {
        const validate = new Validator(req.body, {
            secretCode: 'required|integer',
            dose: 'required|string',
        });
        const matched: boolean = await validate.check();
        try {
            if (!matched) {
                let meta: object = { message: "Bad Request", status: "Failed", errors: validate.errors };
                res.status(responsecode.Bad_Request).json(error(meta, dataArray));
            } else {
                let user: IUser = await User.findById(req.userId);
                if (!user) {
                    let meta: object = { message: "User not found", status: "Failed" };
                    res.status(responsecode.Not_Found).json(error(meta, dataArray));
                } else {
                    for (let j = 0; j < user.members.length; j++) {
                        if (user.members[j].secretCode === req.body.secretCode) {
                            if (req.body.dose === "first") {
                                let first: any = user.members[j].firstDose;
                                if (first === undefined) {
                                    let meta: object = { message: "first dose not scheduled", status: "Failed" };
                                    res.status(responsecode.Internal_Server_Error).json(error(meta, dataArray));
                                } else {
                                    if (first.vaccinatedType === "success") {
                                        let meta: object = { message: "already vaccinated with first dose", status: "Success" };
                                        res.status(responsecode.Success).json(success(meta, dataArray));
                                    } else {
                                        cowidService.calculateFirstDose(user.members[j], user);
                                        let meta: object = { message: "successfully vaccinated with first dose", status: "Success" };
                                        res.status(responsecode.Success).json(success(meta, user));
                                    }
                                }
                            } else if (req.body.dose === "second") {
                                let first: any = user.members[j].firstDose;
                                let second: any = user.members[j].secondDose;
                                if (first === undefined) {
                                    let meta: object = { message: "dose not scheduled", status: "Failed" };
                                    res.status(responsecode.Internal_Server_Error).json(error(meta, dataArray));
                                } else {
                                    if (first.vaccinatedType === "scheduled") {
                                        let meta: object = { message: "second dose not scheduled", status: "Failed" };
                                        res.status(responsecode.Not_Found).json(error(meta, dataArray));
                                    } else {
                                        if (second.vaccinatedType === undefined) {
                                            let meta: object = { message: "second dose not scheduled", status: "Failed" };
                                            res.status(responsecode.Internal_Server_Error).json(error(meta, dataArray));
                                        } else {
                                            if (second.vaccinatedType === "success") {
                                                let meta: object = { message: "already vaccinated with second dose", status: "Success" };
                                                res.status(responsecode.Success).json(success(meta, dataArray));
                                            } else {
                                                cowidService.calculateSecondDose(user.members[j], user);
                                                let meta: object = { message: "successfully vaccinated with second dose", status: "Success" };
                                                res.status(responsecode.Success).json(success(meta, user));
                                            }
                                        }
                                    }
                                }
                            } else {
                                let meta: object = { message: "dose not available", status: "Failed" };
                                res.status(responsecode.Internal_Server_Error).json(error(meta, dataArray));
                            }
                        } else {
                            let meta: object = { message: "secretcode is not valid", status: "Failed" };
                            res.status(responsecode.Internal_Server_Error).json(error(meta, dataArray));
                        }
                    }
                }
            }
        } catch (err) {
            console.error(err.message);
            let meta: object = { message: "Server error", status: "Failed" };
            res.status(responsecode.Internal_Server_Error).json(error(meta, dataArray));
        }
    }
};
export default userApiController;
