import AccountModel from "../model/account.model"
import { accountInterface, accountInterfaceInput } from "../types/accounts.type";


export class AccountService {

  static async create(data : accountInterfaceInput) {
    return await AccountModel.create(data)
  }

  static async getAll(filter: Record<string, any> = {}) {
    const accounts = AccountModel.find(filter).select('-password');
    return accounts
  }

  static async get(id : string) {
    const account = AccountModel.findById(id);
    return account
  }

  static async getProfile(id: string) {
    const account = AccountModel.findById(id).select('-password');
    return account
  }

  static async addSkill(id: string, skill: { skill: string; experience: number; proficiency: string }) {
    return await AccountModel.findByIdAndUpdate(
      id,
      { $push: { skills: skill } },
      { new: true }
    ).select('-password');
  }

  static async removeSkill(id: string, skillId: string) {
    return await AccountModel.findByIdAndUpdate(
      id,
      { $pull: { skills: { _id: skillId } } },
      { new: true }
    ).select('-password');
  }

  static async delete(id : string) {
    const account = AccountModel.findByIdAndDelete(id);
    return account
  }

  static async update(id : string, data : Partial<accountInterface>) {
    return await AccountModel.findByIdAndUpdate(id, data, { new: true });
  }

  static async updateStatus(id: string, status: string) {
    return await AccountModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
  }

  static async findByLogin(username : string, password : string) {
    const account = AccountModel.findOne({ username , password });
    return account
  }

  static async checkEmailIfExist(email : string) {
    const account = AccountModel.findOne({ email });
    return account
  } 


}
