import moment from "moment";

export async function calculateFirstDose(users: any,user:any) {
    users.vaccinatedType = "Partially vaccinated";
    let first:any = users.firstDose;
    const doseFields: object = {
        address: first.address,
        vaccineType: first.vaccineType,
        age: first.age,
        cost: first.cost,
        date: first.date,
        timeSlot: first.timeSlot,
        vaccinatedType: "success"
    };
    users.firstDose = doseFields;
    users.secondDose = {};
    if (first.vaccineType === "cowaxin") {
        let due = new Date(first.date);
        let dueDate = new Date(due.setMonth(due.getMonth() + 1));
        let dueDateFormat = moment(dueDate).format("D MMMM y");
        let last = new Date(dueDateFormat);
        let lastDate = new Date(last.setMonth(last.getMonth() + 1));
        let lastDateFormat = moment(lastDate).format("D MMMM y");
        const doseFields: object = {
            dueDate: dueDateFormat,
            lastDate: lastDateFormat
        };
        users.secondDose = doseFields;
    } else if (first.vaccineType === "covishield") {
        let due = new Date(first.date);
        let dueDate = new Date(due.setMonth(due.getMonth() + 3));
        let dueDateFormat = moment(dueDate).format("D MMMM y");
        let last = new Date(dueDateFormat);
        let lastDate = new Date(last.setMonth(last.getMonth() + 1));
        let lastDateFormat = moment(lastDate).format("D MMMM y");
        const doseFields: object = {
            dueDate: dueDateFormat,
            lastDate: lastDateFormat
        };
        users.secondDose = doseFields;
    }
    return await user.save();
}

export async function calculateSecondDose(users: any,user:any) {
    users.vaccinatedType = "Successfully Vaccinated"
    let second:any = users.secondDose;
    const doseFields: object = {
        address: second.address,
        vaccineType: second.vaccineType,    
        age: second.age,
        cost: second.cost,
        date: second.date,
        timeSlot: second.timeSlot,
        vaccinatedType: "success"
    };
    users.secondDose = doseFields;
    await user.save();
}