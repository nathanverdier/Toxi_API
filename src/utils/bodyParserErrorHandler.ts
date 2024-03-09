import Boom from "@hapi/boom";
import { NextFunction } from "express";

/**
 * Forwards `SyntaxError` as a `Boom.badRequest` error (400).
 */
export const bodyParserErrorHandler = (
  err: SyntaxError | undefined,
  _req: unknown,
  _res: unknown,
  next: NextFunction
) => {
  if (!err) {
    return next();
  }
  if (!(err instanceof SyntaxError)) {
    return next(err);
  }
  return next(Boom.badRequest(err.message));
};