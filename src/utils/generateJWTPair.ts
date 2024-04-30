import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

type JWTPair = {
  accessToken: string;
  refreshToken: string;
};

export function generateJWT(payload: object, secret: string, expiry: string): string {
  const token = jwt.sign(payload, secret, {
    expiresIn: expiry,
  });
  return token;
}

export default function generateJWTPair(payload: object): JWTPair {
  const accessToken = generateJWT(payload, process.env.JWT_ACCESS_SECRET!, process.env.JWT_ACCESS_EXPIRY!);
  const refreshToken = generateJWT(payload, process.env.JWT_REFRESH_SECRET!, process.env.JWT_REFRESH_EXPIRY!);
  return { accessToken, refreshToken };
}
