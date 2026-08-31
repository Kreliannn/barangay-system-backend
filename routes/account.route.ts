import { Router } from "express";
import { AccountController } from "../controller/accounts.controller";
import { uploadIdImages, uploadProfilePicMiddleware } from "../utils/upload";
import { authenticateJWT } from "../middleware/auth";

const route = Router()

route.post("/book", authenticateJWT, AccountController.bookWork)
route.post("/ai", AccountController.aiChatBot)
route.post("/ai-suggestion", AccountController.aiSuggestions)
route.get("/ai-context", AccountController.getAiContext)
route.put("/ai-context", AccountController.upsertAiContext)
route.post("/", uploadIdImages, AccountController.register)
route.post("/login", AccountController.login)
route.get("/", AccountController.getAll)
route.get("/activity/:id", AccountController.getActivityByResident)
route.get("/residents/skills", AccountController.getResidentsWithSkills)
route.patch("/:id/status", AccountController.updateStatus)
route.put("/:id/resubmit", uploadIdImages, AccountController.resubmitImages)
route.get("/:id",authenticateJWT, AccountController.getProfile)
route.post("/:id/skills", authenticateJWT, AccountController.addSkill)
route.patch("/:id/skills/:skillId", authenticateJWT, AccountController.updateSkillAvailability)
route.delete("/:id/skills/:skillId", authenticateJWT, AccountController.removeSkill)
route.post("/:id/reviews", authenticateJWT, AccountController.addReview)

route.put("/:id/profile-pic", authenticateJWT, uploadProfilePicMiddleware, AccountController.uploadProfilePic)
route.patch("/:id/info", authenticateJWT, AccountController.updateInfo)
route.patch("/:id/password",authenticateJWT, AccountController.changePassword)


export default route