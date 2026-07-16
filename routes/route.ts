import { Router } from "express";
import accountRoute from "./account.route"

const routes = Router()

routes.use("/account", accountRoute)


export default routes