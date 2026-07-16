export interface accountInterfaceInput {
    name: string,
    address: string,
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
    }[]
}

export interface accountInterface extends accountInterfaceInput {
    _id : string,
}