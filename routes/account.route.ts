import { Router } from "express";
import { AccountController } from "../controller/accounts.controller";
import { uploadIdImages } from "../utils/upload";

const route = Router()

route.post("/", uploadIdImages, AccountController.register)
route.post("/login", AccountController.login)
route.get("/", AccountController.getAll)
route.patch("/:id/status", AccountController.updateStatus)
route.put("/:id/resubmit", uploadIdImages, AccountController.resubmitImages)

export default route