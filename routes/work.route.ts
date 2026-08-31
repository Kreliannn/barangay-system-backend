import { Router } from "express";
import { WorkController } from "../controller/work.controller";
import { authenticateJWT } from "../middleware/auth";

const route = Router()

route.get("/client/:clientId", authenticateJWT, WorkController.getByClient)
route.get("/worker/:workerId", authenticateJWT, WorkController.getByWorker)
route.patch("/:id/status", authenticateJWT, WorkController.updateStatus)

export default route
