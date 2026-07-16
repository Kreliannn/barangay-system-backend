import AccountModel from "../model/account.model"
import { accountInterface, accountInterfaceInput } from "../types/accounts.type";


export class AccountService {

  static async create(data : accountInterfaceInput) {
    await AccountModel.create(data)
  }

  static async getAll() {
    const accounts = AccountModel.find();
    return accounts
  }

  static async get(id : string) {
    const account = AccountModel.findById(id);
    return account
  }

  static async delete(id : string) {
    const account = AccountModel.findByIdAndDelete(id);
    return account
  }

  static async update(id : string, data : accountInterface) {
    await AccountModel.findByIdAndUpdate(id, data);
  }

  static async findByLogin(username : string, password : string) {
    const account = AccountModel.findOne({ username , password });
    return account
  }


}
