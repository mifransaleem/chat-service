import { Router } from "express";
import * as chatController from "../../controllers/chat/chat.controller";

const chat = Router();

chat.post("/createChat", chatController.createChat);

export default chat;
