import { Response } from "express";
import { AuthRequest } from "../types/request.type";
import { DocumentRequestService } from "../services/documentRequest.service";
import { documentRequestInterfaceInput } from "../types/documentRequest";
import { UserActivityService } from "../services/userActivity.service";
import { formattedDate } from "../utils/customFunc";

export class DocumentRequestController {

  static create = async (request: AuthRequest, response: Response) => {
    try {
      const documentData: documentRequestInterfaceInput = request.body;
      const document = await DocumentRequestService.create(documentData);

      const account = request.account

      await UserActivityService.create({
        accountId : account!._id.toString(),
        activity : `Request Document ${documentData.document}`,
        date : formattedDate()
      })

      response.status(201).send(document);
    } catch (error) {
      response.status(500).send("Failed to create document request");
    }
  }

  static getAll = async (request: AuthRequest, response: Response) => {
    try {
      const { status, statusNot, resident } = request.query;
      const filter: Record<string, any> = {};
      if (status) filter.status = status;
      if (statusNot) filter.status = { $ne: statusNot };
      if (resident) filter.resident = resident;
      const documents = await DocumentRequestService.getAll(filter);
      response.send(documents);
    } catch (error) {
      response.status(500).send("Failed to fetch document requests");
    }
  }

  static get = async (request: AuthRequest, response: Response) => {
    try {
      const { id } = request.params;
      const document = await DocumentRequestService.get(id);
      if (!document) {
        response.status(404).send("Document request not found");
        return;
      }
      response.send(document);
    } catch (error) {
      response.status(500).send("Failed to fetch document request");
    }
  }

  static getByResident = async (request: AuthRequest, response: Response) => {
    try {
      const { residentId } = request.params;
      const documents = await DocumentRequestService.getByResident(residentId);
      response.send(documents);
    } catch (error) {
      response.status(500).send("Failed to fetch document requests by resident");
    }
  }

  static updateStatus = async (request: AuthRequest, response: Response) => {
    try {
      const { id } = request.params;
      const { status } = request.body;

      if (!status) {
        response.status(400).send("Status is required");
        return;
      }

      const document = await DocumentRequestService.updateStatus(id, status);
      if (!document) {
        response.status(404).send("Document request not found");
        return;
      }

      response.send({ message: `Document request status updated to ${status} successfully` });
    } catch (error) {
      response.status(500).send("Failed to update document request status");
    }
  }

  static update = async (request: AuthRequest, response: Response) => {
    try {
      const { id } = request.params;
      const updateData = request.body;

      const document = await DocumentRequestService.update(id, updateData);
      if (!document) {
        response.status(404).send("Document request not found");
        return;
      }

      response.send(document);
    } catch (error) {
      response.status(500).send("Failed to update document request");
    }
  }

  static updatePayment = async (request: AuthRequest, response: Response) => {
    try {
      const { id } = request.params;
      const { isPaid } = request.body;

      if (typeof isPaid !== 'boolean') {
        response.status(400).send("isPaid must be a boolean");
        return;
      }

      const document = await DocumentRequestService.updatePayment(id, isPaid);
      if (!document) {
        response.status(404).send("Document request not found");
        return;
      }

      response.send({ message: `Payment status updated to ${isPaid ? 'paid' : 'unpaid'} successfully` });
    } catch (error) {
      response.status(500).send("Failed to update payment status");
    }
  }

  static delete = async (request: AuthRequest, response: Response) => {
    try {
      const { id } = request.params;
      const document = await DocumentRequestService.delete(id);
      if (!document) {
        response.status(404).send("Document request not found");
        return;
      }
      response.send({ message: "Document request deleted successfully" });
    } catch (error) {
      response.status(500).send("Failed to delete document request");
    }
  }



    static  onlinePayment = async (request : AuthRequest , response : Response) => {
        try{
            const { sender,  documentID, amount, refId  } = request.body
            await DocumentRequestService.updatePayment(documentID, true)

            const account = request.account

            await UserActivityService.create({
              accountId : account!._id.toString(),
              activity : `online payment`,
              date : formattedDate()
            })

            response.send("success")
        } catch(e) {
            console.log(e)
            response.status(500).send("error accour") 
        }
    }
}
