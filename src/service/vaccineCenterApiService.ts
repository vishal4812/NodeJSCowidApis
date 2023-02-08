import Request from "../types/Request";
import responseCode, { dataArray } from "../response_builder/responsecode";
import { IResponse } from "../model/User";
import VaccineCenter, { ICenter, IVaccine, IVaccineCenter } from "../model/vaccineCenter";
import moment from "moment";

export async function createVaccineCenter(centerName: string, address: string, cost: string, state: string, city: string, pinCode: number, name: string, dose1: number, dose2: number, age: string, price: number) {
    const vaccine: [IVaccine] = [{
        date: moment(new Date()).format("D MMMM y"),
        name: name,
        dose1: dose1,
        dose2: dose2,
        age: age,
        price: price
    }];
    const centerFields: ICenter = {
        centerName,
        address,
        cost,
        state,
        city,
        pinCode,
        isAvailable: true,
        vaccine: vaccine
    };
    let center: IVaccineCenter = new VaccineCenter(centerFields);
    await center.save();
    return center;
}

export async function getAllCenter() {
    let center: IVaccineCenter[] = await VaccineCenter.find();
    return center;
}

export async function getCenterByName(centerName: string) {
    let center: IVaccineCenter = await VaccineCenter.findOne({ "centerName": centerName });
    return center;
}

export async function getCenterById(centerId: string) {
    let center: IVaccineCenter = await VaccineCenter.findOne({ "_id": centerId });
    return center;
}

export async function getVaccineCenterByPincode(pinCode: number) {
    let center: IVaccineCenter[] = await VaccineCenter.find({ pinCode: pinCode });
    return center;
}

export async function getVaccineCenterByCityState(state: string, city: string) {
    let center: IVaccineCenter[] = await VaccineCenter.find({ "state": state, "city": city });
    return center;
}

export async function filteringVaccineCenterForUpdate(req: Request) {
    let centerId: string = req.body.centerId;
    let date: string = req.body.date ? req.body.date : null;
    let age: string = req.body.age ? req.body.age : null;
    let name: string = req.body.name ? req.body.name : null;
    let dose1: number = req.body.dose1 ? req.body.dose1 : "";
    let dose2: number = req.body.dose2 ? req.body.dose2 : "";
    let price: number = req.body.price ? req.body.price : "";
    const vaccine: [IVaccine] = [{
        date: date,
        name: name,
        dose1: dose1,
        dose2: dose2,
        age: age,
        price: price
    }];
    if (age !== null && name !== null) {
        let center: any = await VaccineCenter.findOne({ "_id": centerId });
        let vaccines: any = center.vaccine;
        let ageGroup: string[] = [];
        let nameGroup: string[] = [];
        let dateGroup: string[] = [];
        for (let i = 0; i < vaccines.length; i++) {
            if (vaccines[i].date < moment().format("D MMMM y")) {
                await VaccineCenter.updateOne(
                    { "_id": centerId },
                    { $pull: { vaccine: { date: vaccines[i].date } } }
                );
            }
            ageGroup.push(vaccines[i].age);
            nameGroup.push(vaccines[i].name);
            dateGroup.push(vaccines[i].date);
        }
        if (!dateGroup.includes(date)) {
            await VaccineCenter.updateOne(
                { "_id": centerId },
                { $push: { vaccine: vaccine } }
            );
            return await VaccineCenter.find({ "_id": centerId });
        } else {
            if (!ageGroup.includes(age) || !nameGroup.includes(name)) {
                await VaccineCenter.updateOne(
                    { "_id": centerId },
                    { $push: { vaccine: vaccine } }
                );
                return await VaccineCenter.find({ "_id": centerId });
            } else {
                center = [];
                return center;
            }
        }
    }
}

/* new api functions */
export async function getVaccineCenterByCost(center: IVaccineCenter[], cost: string) {
    let costArray: string[] = cost.split(",");
    let centerArr: object[] = [];
    for (let j = 0; j < center.length; j++) {
        if (costArray.includes(center[j].cost)) {
            let centerObj: ICenter = getCenter(center[j], center[j].vaccine);
            centerArr.push(centerObj);
        }
    }
    console.log(centerArr);
    return centerArr;
}

export async function getVaccineCenterByAge(center: IVaccineCenter[], age: string) {
    let ageArray: string[] = age.split(",");
    let vaccine: object[] = [];
    let centerArr: object[] = [];
    for (let j = 0; j < center.length; j++) {
        for (let k = 0; k < center[j].vaccine.length; k++) {
            if (ageArray.includes(center[j].vaccine[k].age)) {
                vaccine.push(center[j].vaccine[k]);
            }
        }
        let centerObj: ICenter = getCenter(center[j], vaccine);
        if (centerObj.vaccine.length !== 0) {
            centerArr.push(centerObj);
        } else {

        }
        vaccine = [];
    }
    return centerArr;
}

export async function getVaccineCenterByName(center: IVaccineCenter[], name: string) {
    let nameArray: string[] = name.split(",");
    let vaccine: object[] = [];
    let centerArr: object[] = [];
    for (let j = 0; j < center.length; j++) {
        for (let k = 0; k < center[j].vaccine.length; k++) {
            if (nameArray.includes(center[j].vaccine[k].name)) {
                vaccine.push(center[j].vaccine[k]);
            }
        }
        let centerObj: ICenter = getCenter(center[j], vaccine);
        if (centerObj.vaccine.length !== 0) {
            centerArr.push(centerObj);
        }
        vaccine = [];
    }
    return centerArr;
}

export async function getVaccineCenterByCostAndAge(center: IVaccineCenter[], cost: string, age: string) {
    let costArray: string[] = cost.split(",");
    let ageArray: string[] = age.split(",");
    let vaccine: object[] = [];
    let centerArr: object[] = [];
    for (let j = 0; j < center.length; j++) {
        for (let k = 0; k < center[j].vaccine.length; k++) {
            if (costArray.includes(center[j].cost) && ageArray.includes(center[j].vaccine[k].age)) {
                vaccine.push(center[j].vaccine[k]);
            }
        }
        let centerObj: ICenter = getCenter(center[j], vaccine);
        if (centerObj.vaccine.length !== 0) {
            centerArr.push(centerObj);
        }
        vaccine = [];
    }
    return centerArr;
}

export async function getVaccineCenterByAgeAndName(center: IVaccineCenter[], age: string, name: string) {
    let ageArray: string[] = age.split(",");
    let nameArray: string[] = name.split(",");
    let vaccine: object[] = [];
    let centerArr: object[] = [];
    for (let j = 0; j < center.length; j++) {
        for (let k = 0; k < center[j].vaccine.length; k++) {
            if (ageArray.includes(center[j].vaccine[k].age) && nameArray.includes(center[j].vaccine[k].name)) {
                vaccine.push(center[j].vaccine[k]);
            }
        }
        let centerObj: ICenter = getCenter(center[j], vaccine);
        if (centerObj.vaccine.length !== 0) {
            centerArr.push(centerObj);
        }
        vaccine = [];
    }
    return centerArr;
}

export async function getVaccineCenterByNameAndCost(center: IVaccineCenter[], name: string, cost: string) {
    let nameArray: string[] = name.split(",");
    let costArray: string[] = cost.split(",");
    let vaccine: object[] = [];
    let centerArr: object[] = [];
    for (let j = 0; j < center.length; j++) {
        for (let k = 0; k < center[j].vaccine.length; k++) {
            if (nameArray.includes(center[j].vaccine[k].name) && costArray.includes(center[j].cost)) {
                vaccine.push(center[j].vaccine[k]);
            }
        }
        let centerObj: ICenter = getCenter(center[j], vaccine);
        if (centerObj.vaccine.length !== 0) {
            centerArr.push(centerObj);
        }
        vaccine = [];
    }
    return centerArr;
}

export async function getVaccineCenterByCostAndAgeAndName(center: IVaccineCenter[], cost: string, name: string, age: string) {
    let costArray: string[] = cost.split(",");
    let nameArray: string[] = name.split(",");
    let ageArray: string[] = age.split(",");
    let vaccine: object[] = [];
    let centerArr: object[] = [];
    for (let j = 0; j < center.length; j++) {
        for (let k = 0; k < center[j].vaccine.length; k++) {
            if (costArray.includes(center[j].cost) && nameArray.includes(center[j].vaccine[k].name) && ageArray.includes(center[j].vaccine[k].age)) {
                vaccine.push(center[j].vaccine[k]);
            }
        }
        let centerObj: ICenter = getCenter(center[j], vaccine);
        if (centerObj.vaccine.length !== 0) {
            centerArr.push(centerObj);
        }
        vaccine = [];
    }
    return centerArr;
}

export async function filterCenters(centers: IVaccineCenter[], cost: string, age: string, vaccineName: string) {
    let result: IResponse;
    if (cost === null && age === null && vaccineName === null) {
        result = checkCenterIsExists(centers);
    } else if (cost !== null && age === null && vaccineName === null) {
        let center: object[] = await getVaccineCenterByCost(centers, cost);
        result = checkCenterIsExists(center);
    } else if (cost === null && age !== null && vaccineName === null) {
        let center: object[] = await getVaccineCenterByAge(centers, age);
        result = checkCenterIsExists(center);
    } else if (cost === null && age === null && vaccineName !== null) {
        let center: object[] = await getVaccineCenterByName(centers, vaccineName);
        result = checkCenterIsExists(center);
    } else if (cost !== null && age !== null && vaccineName === null) {
        let center: object[] = await getVaccineCenterByCostAndAge(centers, cost, age);
        result = checkCenterIsExists(center);
    } else if (cost === null && age !== null && name !== null) {
        let center: object[] = await getVaccineCenterByAgeAndName(centers, cost, vaccineName);
        result = checkCenterIsExists(center);
    } else if (cost !== null && age === null && name !== null) {
        let center: object[] = await getVaccineCenterByNameAndCost(centers, vaccineName, cost);
        result = checkCenterIsExists(center);
    } else if (cost !== null && age !== null && name !== null) {
        let center: object[] = await getVaccineCenterByCostAndAgeAndName(centers, cost, vaccineName, age);
        result = checkCenterIsExists(center);
    } else {
        result = checkCenterIsExists(centers);
    }
    return result;
}

function checkCenterIsExists(center: object[]) {
    let result: IResponse;
    if (center.length === 0) {
        result = {
            meta: {
                "responseCode": responseCode.Not_Found,
                "message": "Center not found",
                "status": "Failed",
                "errors": dataArray
            },
            data: dataArray
        }
    } else {
        result = {
            meta: {
                "responseCode": responseCode.Success,
                "message": "Center Fetched Successfully",
                "status": "Success",
                "errors": dataArray
            },
            data: center
        }
    }
    return result;
}

function getCenter(center: IVaccineCenter, vaccine: object[]) {
    let centerObj: ICenter = {
        centerName: center.centerName,
        address: center.address,
        vaccine: vaccine,
        cost: center.cost,
        state: center.state,
        city: center.city,
        pinCode: center.pinCode,
        isAvailable: center.isAvailable
    }
    return centerObj;
}



