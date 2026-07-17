import DocumentRequestModel from "../model/documentRequest.model"
import { documentRequestInterface, documentRequestInterfaceInput } from "../types/documentRequest";

export class DocumentRequestService {

  static async create(data: documentRequestInterfaceInput) {
    return await DocumentRequestModel.create(data)
  }

  static async getAll(filter: Record<string, any> = {}) {
    const documents = DocumentRequestModel.find(filter).populate("resident", "-password");
    return documents
  }

  static async get(id: string) {
    const document = DocumentRequestModel.findById(id).populate("resident", "-password");
    return document
  }

  static async delete(id: string) {
    const document = DocumentRequestModel.findByIdAndDelete(id);
    return document
  }

  static async update(id: string, data: Partial<documentRequestInterface>) {
    return await DocumentRequestModel.findByIdAndUpdate(id, data, { new: true }).populate("resident", "-password");
  }

  static async updateStatus(id: string, status: string) {
    return await DocumentRequestModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("resident", "-password");
  }

  static async getByResident(residentId: string) {
    const documents = DocumentRequestModel.find({ resident: residentId }).populate("resident", "-password");
    return documents
  }

  static async updatePayment(id: string, isPaid: boolean) {
    return await DocumentRequestModel.findByIdAndUpdate(
      id,
      { isPaid },
      { new: true }
    ).populate("resident", "-password");
  }
}
