import { Request, Response, NextFunction } from "express";
import { BaseError } from "../errors/base.error";
import { BadRequestError } from "../errors/badRequest.error";
import { UnauthorizedError } from "../errors/unauthorized.error";
import { ForbiddenError } from "../errors/forbidden.error";
import { NotFoundError } from "../errors/notFound.error";

export default function errHandlingMiddleware(
  error: BaseError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof BadRequestError)
    return res.status(400).json({ status: 400, message: error.message });
  if (error instanceof UnauthorizedError)
    return res.status(401).json({ status: 401, message: error.message });
  if (error instanceof ForbiddenError)
    return res.status(403).json({ status: 403, message: error.message });
  if (error instanceof NotFoundError)
    return res.status(404).json({ status: 404, message: error.message });
  res.status(500).json({ message: error });
}
