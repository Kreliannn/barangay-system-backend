import { Router } from "express";
import { AccountController } from "../controller/accounts.controller";
import { uploadIdImages, uploadProfilePicMiddleware } from "../utils/upload";

const route = Router()

route.post("/", uploadIdImages, AccountController.register)
route.post("/login", AccountController.login)
route.get("/", AccountController.getAll)
route.patch("/:id/status", AccountController.updateStatus)
route.put("/:id/resubmit", uploadIdImages, AccountController.resubmitImages)
route.get("/:id", AccountController.getProfile)
route.post("/:id/skills", AccountController.addSkill)
route.delete("/:id/skills/:skillId", AccountController.removeSkill)
route.put("/:id/profile-pic", uploadProfilePicMiddleware, AccountController.uploadProfilePic)
route.patch("/:id/info", AccountController.updateInfo)
route.patch("/:id/password", AccountController.changePassword)

export default route