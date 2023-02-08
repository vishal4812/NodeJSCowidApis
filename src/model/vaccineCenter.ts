import { Document, Schema } from "mongoose";
import mongoose from "mongoose";

/**
 * Interface to model the User Schema for TypeScript.
 * @param mobile:number
 * @param password: string
 * @param members:array
 */

export interface IVaccine {
    date: string;
    name: string;
    dose1: number;
    dose2: number;
    age: string;
    price: number;
}

export interface ICenter {
    centerName: string;
    address: string;
    vaccine: Array<object>,
    cost: string;
    state: string;
    city: string;
    pinCode: number;
    isAvailable: boolean;
}

export interface IVaccineCenter extends Document {
    centerName: string;
    address: string;
    cost: string;
    state: string;
    city: string;
    pinCode: number;
    isAvailable: boolean;
    vaccine: [{
        date: string;
        name: string;
        dose1: number;
        dose2: number;
        age: string;
        price: number;
    }];
}

const vaccineCenterSchema: Schema = new Schema({
    centerName: { type: String, required: true },
    address: { type: String, required: true },
    cost: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pinCode: { type: Number, required: true },
    isAvailable: { type: Boolean },
    vaccine: [{
        date: { type: String, required: true },
        name: { type: String, required: true },
        dose1: { type: Number, required: true },
        dose2: { type: Number, required: true },
        age: { type: String, required: true },
        price: { type: Number },
        _id: false
    }]
});

const VaccineCenter = mongoose.model<IVaccineCenter>("VaccineCenter", vaccineCenterSchema);

export default VaccineCenter;
