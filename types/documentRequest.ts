import { accountInterface } from "./accounts.type";

export interface documentRequestInterfaceInput {
    resident: string,
    document: string,
    status: string,
    isPaid : boolean,
    price : number,
    
    fullName : string | null,
    contact: string | null,
    address: string | null,
    dateOfBirth: string | null,
    civilStatus: string | null,
    nationality: string | null, 
    occupation: string | null,
    yrsOfResidency: number | null,

    purpose : string | null,
    documentNumber : string | null,
    dateIssued : string | null,
    
    businessName : string | null,
    businessAddress : string | null,
    businessType : string | null,
    businessNature : string | null,


    
    sqrmtr : number | null,
    partner :string | null,
    child :string | null,
    Purpose :string | null,
    Activity :string | null,

    age : number | null,
    monthlyIncome : number | null,
    monthlyExpences : number | null,
}

export interface documentRequestInterface {
    _id : string,
    resident: accountInterface,
    document: string,
    status : string,
    isPaid : boolean,
    
    fullName : string | null,
    contact: string | null,
    address: string | null,
    dateOfBirth: string | null,
    civilStatus: string | null,
    nationality: string | null, 
    occupation: string | null,
    yrsOfResidency: number | null,

    purpose : string | null,
    documentNumber : string | null,
    dateIssued : string | null,
    
    businessName : string | null,
    businessAddress : string | null,
    businessType : string | null,
    businessNature : string | null,



    sqrmtr : number | null,
    partner :string | null,
    child :string | null,
    Purpose :string | null,
    Activity :string | null,

    age : number | null,
    monthlyIncome : number | null,
    monthlyExpences : number | null,
}
