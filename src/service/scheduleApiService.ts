import Request from "../types/Request";
import { IVaccineCenter } from "../model/vaccineCenter";
import User, { IDose, IMembers, IUser } from "../model/User";

export function updateDoseSlots(dose: any, center: IVaccineCenter, doseNo: string) {
    for (let i = 0; i < center.vaccine.length; i++) {
        let element = center.vaccine[i];
        if (dose.vaccineType === element.name && dose.age === element.age) {
            if (doseNo === "first") {
                element.dose1 = element.dose1 - 1;
                if (element.dose1 === 0) {
                    center.isAvailable = false;
                }
                center.save();
            } else if (doseNo === "second") {
                element.dose2 = element.dose2 - 1;
                if (element.dose2 === 0) {
                    center.isAvailable = false;
                }
                center.save();
            }
        }
    }
}

export async function createDose(element: IMembers, user: IUser, center: IVaccineCenter, doseNo: string, address: string, vaccineType: string, age: string, cost: string, date: string, timeSlot: string) {
    let scheduled: string = "scheduled";
    const doseFields: IDose = {
        address,
        vaccineType,
        age,
        cost,
        date,
        timeSlot,
        vaccinatedType: scheduled
    };
    if (doseNo === "first") {
        element.firstDose = doseFields;
        await updateDoseSlots(element.firstDose, center, doseNo);
    } else if (doseNo === "second") {
        element.secondDose = doseFields;
        await updateDoseSlots(element.secondDose, center, doseNo);
    }
    await user.save();
    return user;
}
