import bcrypt from "bcrypt";
import config from "config";
import jwt from "jsonwebtoken"
import User, { IUser } from "../model/User";

export function createToken(userId: string, isAdmin: boolean) {
    const token: string = jwt.sign(
        { user_id: userId, user_isAdmin: isAdmin },
        config.get("jwtSecret"),
        { expiresIn: config.get("jwtExpiration") }
    );
    return token;
}

export async function createUser(mobile: number, password: string) {
    const salt: string = await bcrypt.genSalt(10);
    const hashed: string = await bcrypt.hash(password, salt);
    let user: IUser = new User({
        mobile: mobile,
        password: hashed
    });
    await user.save();
    const token: string = createToken(user._id, user.isAdmin);
    return token;
}

export async function getUser(mobile: number) {
    const user: IUser = await User.findOne({ mobile: mobile });
    return user;
}

export async function getUserById(userId: string) {
    const user: IUser = await User.findById(userId);
    return user;
}

export async function getUserBySecretCode(secretCode: string) {
    const user: IUser = await User.findOne({ "members": { $elemMatch: { secretCode: secretCode } } });
    return user;
}