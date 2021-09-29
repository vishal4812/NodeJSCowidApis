import moment from "moment";

export async function calculateSecondDose(users: any,user:any) {
    users.vaccinatedType = "Partially vaccinated";
    let first: any = users.firstDose;
    let second: any = users.secondDose;
    const doseFields: object = {
        address: first.address,
        vaccineType: first.vaccineType,
        age: first.age,
        cost: first.cost,
        date: first.date,
        timeSlot: first.timeSlot,
        vaccinatedType: "success"
    };
    user.users.firstDose = doseFields;
    user.users.secondDose = {};
    if (first.vaccineType === "cowaxin") {
        let due = new Date(first.date);
        let dueDate = new Date(due.setMonth(due.getMonth() + 1));
        let dueDateFormat = moment(dueDate).format("D MMMM y");
        let last = new Date(dueDateFormat);
        let lastDate = new Date(last.setMonth(last.getMonth() + 1));
        let lastDateFormat = moment(lastDate).format("D MMMM y");
        second.dueDate = dueDateFormat;
        second.lastDate = lastDateFormat;
    } else if (first.vaccineType === "covishield") {
        let due = new Date(first.date);
        let dueDate = new Date(due.setMonth(due.getMonth() + 3));
        let dueDateFormat = moment(dueDate).format("D MMMM y");
        let last = new Date(dueDateFormat);
        let lastDate = new Date(last.setMonth(last.getMonth() + 1));
        let lastDateFormat = moment(lastDate).format("D MMMM y");
        second.dueDate = dueDateFormat;
        second.lastDate = lastDateFormat;
    }
    return await user.save();
}