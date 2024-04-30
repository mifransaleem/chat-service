import { Response } from "express";

export interface ApiResponse<T> {
  error: boolean;
  message: string;
  data?: T;
}

export const sendApiResponse = async <T>(
  res: Response,
  error: boolean,
  status: number,
  message: string,
  data?: T
) => {
  const responseBody: ApiResponse<T> = {
    error,
    message,
    data,
  };

  res.status(status).json(responseBody);
};
