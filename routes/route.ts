import { Router } from "express";
import accountRoute from "./account.route"
import documentRequestRoute from "./documentRequest.route"
import businessRoute from "./business.route"

const routes = Router()

routes.use("/account", accountRoute)
routes.use("/document-request", documentRequestRoute)
routes.use("/business", businessRoute)

export default routes