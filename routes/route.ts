import { Router } from "express";
import accountRoute from "./account.route"
import documentRequestRoute from "./documentRequest.route"

const routes = Router()

routes.use("/account", accountRoute)
routes.use("/document-request", documentRequestRoute)

export default routes