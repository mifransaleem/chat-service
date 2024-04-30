import { Request, Response, NextFunction } from "express";
import { sendApiResponse } from "../../utils/apiResponse";
import { createChatService as createChatService } from "../../services/chat/chat.service";

export const createChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await createChatService(res, "some data");
  } catch (error) {
    sendApiResponse(res, true, 400, error, null);
    next(error)
  }
};
