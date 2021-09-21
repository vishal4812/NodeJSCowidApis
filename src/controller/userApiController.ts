import config  from "config";
import bcrypt from "bcrypt";
import { Response } from "express";
import Request from "../types/Request";
import User, {IMembers, IUser} from "../model/User";
import jwt from "jsonwebtoken"
import { success,error,dataArray } from "../response_builder/responsefunction";
import responsecode  from "../response_builder/responsecode";
const { Validator } = require('node-input-validator');

const userApiController = {
    /**
     * Request a data from User
     * @param req
     * @param res
     * @returns {*}
     */
    loginRegister: async function loginRegister(req: Request,res: Response){
        const validate = new Validator(req.body, {
            mobile: 'required|integer|minLength:10|maxLength:10',
            password: 'required|minLength:8',
        })
        const matched: boolean = await validate.check();
        const { mobile,password } = req.body;
        const salt: string = await bcrypt.genSalt(10);
        const hashed: string = await bcrypt.hash(password, salt);
        // Build user object based on IUser
        const userFields: object = {
            mobile,
            password: hashed
        };
        try{
            if (!matched) {
                let meta :object ={ message:"Bad Request", status:"Failed", errors: validate.errors };
                res.status(responsecode.Bad_Request).json(error(meta,dataArray));
            } else {
                let user: IUser = await User.findOne({ mobile: mobile });
                if (user) {
                    const isMatch: boolean = await bcrypt.compare(password, user.password);
                    if (isMatch) {
                        const token = jwt.sign(
                            { user_id: user._id },
                            config.get("jwtSecret"),
                            {expiresIn: config.get("jwtExpiration")}
                        );
                        let meta :object ={ message:"logged in successfully", status:"Success" };
                        res.status(responsecode.Success).json(success(meta,{token}));
                    } else {
                        let meta :object ={ message:"Invalid Credential", status:"Failed" };
                        res.status(responsecode.Unauthorized).json(error(meta,dataArray));
                    }
                } else {
                    user = new User(userFields);
                    await user.save();
                    const token = jwt.sign(
                        { user_id: user._id },
                        config.get("jwtSecret"),
                        {expiresIn: config.get("jwtExpiration")}
                    );
                    let meta :object ={ message:"logged in successfully", status:"Success" };
                    res.status(responsecode.Success).json(success(meta,{token}));
                }
            }
        } catch (err) {
            console.error(err.message);
            let meta :object ={ message:"Server error", status:"Failed" };
            res.status(responsecode.Internal_Server_Error).json(error(meta,dataArray));
        }
    },

    userData: async function userData(req: Request,res: Response) {
        try {
            let user: IUser = await User.findById(req.userId).select("-password");
            let meta :object = { message:"User Data", status:"success" };
            res.status(responsecode.Success).json(success(meta,user));    
        } catch (err) {
            console.error(err.message);
            let meta :object = { message:"Server error", status:"Failed" };
            res.status(responsecode.Internal_Server_Error).json(error(meta,dataArray));
        }
    },

    addMember: async function addMember(req: Request,res: Response) {
        const validate = new Validator(req.body, {
            photoId: 'required|string',
            photoIdNumber: 'required|string|minLength:12|maxLength:12',
            name: 'required|string',
            gender: 'required|string',
            yearOfBirth: 'required|integer'
        })
        const matched: boolean = await validate.check();
        const { photoId,photoIdNumber,name,gender,yearOfBirth } = req.body;
        const memberFields: object = {
            photoId,
            photoIdNumber,
            name,
            gender,
            yearOfBirth
        };
        try{
            if (!matched) {
                let meta :object ={ message:"Bad Request", status:"Failed", errors: validate.errors };
                res.status(responsecode.Bad_Request).json(error(meta,dataArray));
            } else {
                let user: IUser = await User.findById(req.userId).select("-password");
                if (!user) {
                    let meta :object ={ message:"User not found", status:"Failed", errors: validate.errors };
                    res.status(responsecode.Not_Found).json(error(meta,dataArray));
                } else {
                    await user.members.push(req.body);
                    await user.save();
                    let meta :object ={ message:"logged in successfully", status:"Success" };
                    res.status(responsecode.Success).json(success(meta,user));
                }
            }
        } catch (err) {
            console.error(err.message);
            let meta :object ={ message:"Server error", status:"Failed" };
            res.status(responsecode.Internal_Server_Error).json(error(meta,dataArray));
        }
    }
};
export default userApiController;