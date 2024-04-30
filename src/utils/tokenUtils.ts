import * as jwt from "jsonwebtoken";
import { config } from "dotenv";


config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY;
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY;

export const generateAccessToken = (
  userId: number,
) => {
  return jwt.sign(
    {
      userId,
    },
    JWT_ACCESS_SECRET,
    {
      expiresIn: JWT_ACCESS_EXPIRY,
    }
  );
};

export const generateRefreshToken = (
  userId: number,
) => {
  return jwt.sign(
    {
      userId,
    },
    JWT_REFRESH_SECRET,
    {
      expiresIn: JWT_REFRESH_EXPIRY,
    }
  );
};

export const verifyRefreshToken = (refreshToken: string) => {
  return jwt.verify(refreshToken, JWT_REFRESH_SECRET);
}
