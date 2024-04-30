import { Router } from "express";
import * as authController from "../../controllers/auth/auth.controller";

const authRouter = Router();

authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login);
authRouter.post("/refreshToken", authController.refreshToken);

export default authRouter;
