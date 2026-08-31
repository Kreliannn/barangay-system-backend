import { Router } from "express";
import accountRoute from "./account.route"
import documentRequestRoute from "./documentRequest.route"
import businessRoute from "./business.route"
import workRoute from "./work.route"

const routes = Router()

routes.use("/account", accountRoute)
routes.use("/document-request", documentRequestRoute)
routes.use("/business", businessRoute)
routes.use("/work", workRoute)

export default routes