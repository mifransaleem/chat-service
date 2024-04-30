import { Request, Response, NextFunction } from "express";
import { sendApiResponse } from "../../utils/apiResponse";
import { loginUser, refreshAccessToken, signupUser } from "../../services/auth/auth.service";
import { config } from "dotenv";
import { loginSchema, signupSchema } from "../../types/auth.type";
import { HTTPResponseCodes } from "../../constants/constants";


config();

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const signupUserData = signupSchema.parse(req.body);
    const userData = await signupUser(signupUserData);

    const loginResponse = await loginUser(signupUserData.email, signupUserData.password);

    return sendApiResponse(res, false, HTTPResponseCodes.CREATED, 'User registered successfully', loginResponse);
  } catch (error) {
    sendApiResponse(res, true, 400, error, null);
    next(error)
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const loginResponse = await loginUser(email, password);

    return sendApiResponse(res, false, HTTPResponseCodes.OK, 'User logged in successfully', loginResponse);
  } catch (error) {
    sendApiResponse(res, true, HTTPResponseCodes.BAD_REQUEST, error, null);
    next(error)
  }
}

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    const loginResponse = await refreshAccessToken(refreshToken);
    return sendApiResponse(res, false, HTTPResponseCodes.OK, 'Token verified successfully', loginResponse);
  } catch (error) {
    sendApiResponse(res, true, HTTPResponseCodes.BAD_REQUEST, error, null);
    next(error)
  }
}
