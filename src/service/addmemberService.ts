import User, { IMembers, IUser } from "../model/User";

function createMemberObject(photoIdProof:string,photoIdNumber:string,name:string,gender:string,yearOfBirth:number) {
    const refId: string = new Date().valueOf().toString();
    const secretCode: string = refId.substr(-4);
    const vaccinatedType: string = "Not Vaccinated";
    const memberFields: IMembers = {
        photoIdProof,
        photoIdNumber,
        name,
        gender,
        yearOfBirth,
        refId: refId,
        secretCode: secretCode,
        vaccinatedType: vaccinatedType,
        firstDose: {},
        secondDose: {}
    };
    return memberFields;
}

export async function addMemberService(userId: string,photoIdProof:string,photoIdNumber:string,name:string,gender:string,yearOfBirth:number) {
    await User.updateOne(
        { _id: userId },
        { $push: { members: createMemberObject(photoIdProof,photoIdNumber,name,gender,yearOfBirth) } }
    );
    const user: IUser = await User.findById(userId);
    return user;
}


export async function deleteMemberService(userId: string, refId: string) {
        await User.updateOne(
            { "_id": userId },
            { $pull: { members: { refId: refId } } }
        );
}

export async function getMember(photoIdNumber: number) {
    const member: object[] = await User.find({ members: { $elemMatch: { photoIdNumber: photoIdNumber } } });
    return member;
}