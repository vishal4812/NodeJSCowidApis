import { Document, Model, model, Schema } from "mongoose";
import mongoose from "mongoose";

/**
 * Interface to model the User Schema for TypeScript.
 * @param mobile:number
 * @param password: string
 * @param members:array
 */

export interface IDose {
  address: string;
  vaccineType: string;
  age: string;
  cost: string;
  date: string;
  timeSlot: string;
  vaccinatedType: string;
}

export interface IMembers {
  photoId: string,
  photoIdNumber: string
  name: string,
  gender: string,
  yearOfBirth: number,
  refId: number,
  secretCode: number,
  vaccinatedType: string,
  firstDose: object,
  secondDose: object,
}

export interface IUser extends Document {
  mobile: number;
  password: string;
  members: Array<IMembers>;
}

const doseSchema = new Schema({
  address: { type: String },
  vaccineType: { type: String },
  age: { type: String },
  cost: { type: String },
  date: { type: String },
  timeSlot: { type: String },
  vaccinatedType: { type: String }
}, { _id: false });

const membersSchema = new Schema({
  photoId: { type: String },
  photoIdNumber: { type: String },
  name: { type: String },
  gender: { type: String },
  yearOfBirth: { type: Number },
  refId: { type: Number },
  secretCode: { type: Number },
  vaccinatedType: { type: String },
  firstDose: { type: Object },
  secondDose: { type: Object }
}, { _id: false });

const userSchema: Schema = new Schema({
  mobile: { type: Number, required: true, unique: true },
  password: { type: String, required: true },
  members: [membersSchema]
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
