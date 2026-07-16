import { Router } from "express";
import { AccountController } from "../controller/accounts.controller";

const route = Router()

route.post("/", AccountController.createAccount)
route.post("/login", AccountController.login)


export default route