import moment from "moment";
import {IDose, IMembers, IUser} from "../model/User";

function createDoseObject(doses: any) {
    const doseFields: IDose = {
        address: doses.address,
        vaccineType: doses.vaccineType,
        age: doses.age,
        cost: doses.cost,
        date: doses.date,
        timeSlot: doses.timeSlot,
        vaccinatedType: "success"
    };
    return doseFields;
}

function calculateDueAndLastDate(first: any, users: IMembers) {
    let month: number;
    if (first.vaccineType === "cowaxin") {
        month = 3;
    } else if (first.vaccineType === "covishield") {
        month = 1
    }
    let due = new Date(first.date);
    let dueDate = new Date(due.setMonth(due.getMonth() + month));
    let dueDateFormat = moment(dueDate).format("D MMMM y");
    let last = new Date(dueDateFormat);
    let lastDate = new Date(last.setMonth(last.getMonth() + 1));
    let lastDateFormat = moment(lastDate).format("D MMMM y");
    const doseFields: object = {
        dueDate: dueDateFormat,
        lastDate: lastDateFormat
    };
    return users.secondDose = doseFields;
}

export async function setFirstDoseStatus(users: IMembers, user: IUser) {
    users.vaccinatedType = "Partially vaccinated";
    let first: object = users.firstDose;
    users.firstDose = createDoseObject(first);
    users.secondDose = {};
    calculateDueAndLastDate(first, users);
    return await user.save();
}

export async function setSecondDoseStatus(users: IMembers, user: IUser) {
    users.vaccinatedType = "Successfully Vaccinated"
    let second: object = users.secondDose;
    users.secondDose = createDoseObject(second);
    return await user.save();
}