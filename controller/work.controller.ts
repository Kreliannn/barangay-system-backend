import { Response } from "express";
import { AuthRequest } from "../types/request.type";
import { WorkService } from "../services/work.service";

export class WorkController {

  static getByClient = async (request: AuthRequest, response: Response) => {
    try {
      const { clientId } = request.params;
      const works = await WorkService.getByClient(clientId);
      response.send(works);
    } catch (error) {
      response.status(500).send("Failed to fetch work records");
    }
  }

  static getByWorker = async (request: AuthRequest, response: Response) => {
    try {
      const { workerId } = request.params;
      const works = await WorkService.getByWorker(workerId);
      response.send(works);
    } catch (error) {
      response.status(500).send("Failed to fetch work records");
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

      const allowed = ['pending', 'rejected', 'active', 'to review', 'completed'];
      if (!allowed.includes(status)) {
        response.status(400).send("Invalid status");
        return;
      }

      const work = await WorkService.updateStatus(id, status);
      if (!work) {
        response.status(404).send("Work record not found");
        return;
      }

      response.send(work);
    } catch (error) {
      response.status(500).send("Failed to update work status");
    }
  }
}
