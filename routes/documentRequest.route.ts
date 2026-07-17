import { Router } from "express";
import { DocumentRequestController } from "../controller/documentRequest.controller";
import { authenticateJWT } from "../middleware/auth";

const route = Router()

route.post("/", authenticateJWT, DocumentRequestController.create)
route.get("/", DocumentRequestController.getAll)
route.get("/:id", DocumentRequestController.get)
route.patch("/:id/status", DocumentRequestController.updateStatus)
route.put("/:id", DocumentRequestController.update)
route.patch("/:id/payment", DocumentRequestController.updatePayment)
route.delete("/:id", DocumentRequestController.delete)
route.get("/resident/:residentId", DocumentRequestController.getByResident)

export default route
