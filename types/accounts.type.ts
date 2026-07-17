export interface accountInterfaceInput {
    profile: string,
    name: string,
    address: string,
    contact: string,
    email: string,
    password: string,
    status :  string,
    idImg : {
        idFront  :  string,
        idBack :  string,
        idSelfie :  string,
    },
    skills : {
        skill  :  string,
        experience : number,
        proficiency :  string,
    }[],
    reviews : {
        user :   string,
        userProfile : string,
        star  :  number,
        skill :  string,
        message :  string,
    }[],
}

export interface accountInterface extends accountInterfaceInput {
    _id : string,
}