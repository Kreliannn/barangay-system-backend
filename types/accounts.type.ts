export interface accountInterfaceInput {
    name: string,
    role: string,
    username: string,
    password: string,
}

export interface accountInterface extends accountInterfaceInput {
    _id : string,
}