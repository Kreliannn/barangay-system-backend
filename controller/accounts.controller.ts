import { Response, response } from "express";
import { AuthRequest } from "../types/request.type";
import { accountInterface, accountInterfaceInput } from "../types/accounts.type";
import { AccountService } from "../services/acccount.service";

export class AccountController {

  static createAccount = async (request : AuthRequest , response : Response) => {
    const accountData : accountInterfaceInput = request.body
    await AccountService.create(accountData)
    const accounts = await AccountService.getAll()
    response.send(accounts)
  }

  static login = async (request : AuthRequest , response : Response) => {
    const { username, password } = request.body
    const account = await AccountService.findByLogin(username, password)
    if(!account){
        response.status(500).send("user not found")
        return
    }
    response.send(account)
  }



}
