import { Router } from "express";
import chatRouter from "./chat/chat.route";
import authRouter from "./auth/auth.route";

const chatServiceRouter = Router();

chatServiceRouter.use("/auth", authRouter)
chatServiceRouter.use("/chat", chatRouter);

export default chatServiceRouter;
