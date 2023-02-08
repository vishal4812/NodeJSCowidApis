import { Document, Schema } from "mongoose";
import mongoose from "mongoose";

/**
 * Interface to model the User Schema for TypeScript.
 * @param mobile:number
 * @param password: string
 * @param members:array
 */

export interface IResponse {
  meta: {
    responseCode: number;
    message: string;
    status: string;
    errors: object;
  },
  data: object;
}

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
  photoIdProof: string,
  photoIdNumber: string
  name: string,
  gender: string,
  yearOfBirth: number,
  refId: string,
  secretCode: string,
  vaccinatedType: string,
  firstDose: object,
  secondDose: object
}

export interface IUser extends Document {
  isAdmin: boolean;
  mobile: number;
  password: string;
  members: Array<IMembers>
}

const userSchema: Schema = new Schema({
  isAdmin: { type: Boolean, default: false },
  mobile: { type: Number, required: true, unique: true },
  password: { type: String, required: true },
  members: [{
    photoIdProof: { type: String },
    photoIdNumber: { type: String },
    name: { type: String },
    gender: { type: String },
    yearOfBirth: { type: Number },
    refId: { type: String },
    secretCode: { type: String },
    vaccinatedType: { type: String },
    firstDose: { type: Object },
    secondDose: { type: Object }
  }, { _id: false }]
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;