import { UserRepository } from "../../repositories";
import { Signup } from "../../types/auth.type";
import { BadRequestError } from "../../errors/badRequest.error";
import { generateHashedPassword } from "../../utils/generateHash";
import { comparePassword } from "../../utils/comparePassword";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/tokenUtils";
import { UnauthorizedError } from "../../errors/unauthorized.error";

export const signupUser = async (signUpObject: Signup) => {
  const {
    name,
    email,
    password
  } = signUpObject;

  const user = await UserRepository.findOne({
    where: { email: email },
  });
  if (user) throw new BadRequestError("User already exists");

  // hash password
  const hashedPassword = await generateHashedPassword(password);

  // save user
  const newUser = await UserRepository.save({
    name,
    email,
    password: hashedPassword,
  });

  return { user: newUser };
};

export const loginUser = async (email: string, password: string) => {
  const user = await UserRepository.findOne({
    where: { email: email },
  });
  if (!user) throw new BadRequestError("User not found");

  // compare password
  const isPasswordMatched = await comparePassword(password, user.password);
  if (!isPasswordMatched) throw new UnauthorizedError("Invalid password");

  const token = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  const data = {
    ...user,
    token: "Bearer " + token,
    refreshToken: refreshToken,
  };

  return data;
}

export const refreshAccessToken = async (refreshToken: string) => {
  // verify refresh token
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) throw new UnauthorizedError("Invalid refresh token");

  // Check if the decoded token is a JwtPayload
  if (typeof decoded !== "object" || !("userId" in decoded)) {
    throw new BadRequestError("Invalid refresh token");
  }

  const user = await UserRepository.findOne({
    where: { id: decoded.userId },
  });
  if (!user) throw new UnauthorizedError("User not found");

  const token = generateAccessToken(user.id);
  const newRefreshToken = generateRefreshToken(user.id);

  const data = {
    ...user,
    token: "Bearer " + token,
    refreshToken: newRefreshToken,
  };

  return data;
}
