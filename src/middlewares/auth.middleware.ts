import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import { sendApiResponse } from "../utils/apiResponse";

config();

declare global {
  namespace Express {
    interface UserPayload extends JwtPayload {
      id: number;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_ACCESS_SECRET!, (err, user) => {
      if (err) {
        return sendApiResponse(res, true, 404, "Please provide valid access token",null);
      }
      req.user = user as Express.UserPayload;      
      next();
    });
  } else {
    return sendApiResponse(res, true, 401, "Access token not provided",null);
  }
};
