import { Router } from "express";
import { BusinessController } from "../controller/business.controller";
import { uploadBusinessFiles, uploadBusinessImages } from "../utils/upload";
import { authenticateJWT } from "../middleware/auth";

const route = Router()

route.post("/", authenticateJWT, uploadBusinessFiles, BusinessController.create)
route.get("/", BusinessController.getAll)
route.get("/resident/:id", BusinessController.getByResident)
route.get("/:id", BusinessController.get)
route.put("/:id", authenticateJWT, uploadBusinessFiles, BusinessController.update)
route.delete("/:id", authenticateJWT, BusinessController.delete)
route.patch("/:id/status", BusinessController.updateStatus)
route.post("/:id/images", authenticateJWT, uploadBusinessImages, BusinessController.addImages)
route.delete("/:id/images", authenticateJWT, BusinessController.removeImage)

export default route
