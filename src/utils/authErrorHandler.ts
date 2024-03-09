import Boom from "@hapi/boom";
import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "express-oauth2-jwt-bearer";

/**
 * Convert authentication and authorization errors to Boom instances
 */
export const authErrorHandler = (
  err: Error | undefined,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err) {
    return next();
  }
  if (err instanceof UnauthorizedError) {
    // Boom.unauthorized supports setting the WWW-Authenticate header but Boom.forbidden does not.
    // Here we want to handle both types of error, we therefore construct the boom instance manually
    // in order to add the WWW-Authenticate header ourselves
    const boom = new Boom.Boom(err.message, { statusCode: err.statusCode });
    boom.output.headers["WWW-Authenticate"] = err.headers["WWW-Authenticate"];
    return next(boom);
  }
  return next(err);
};