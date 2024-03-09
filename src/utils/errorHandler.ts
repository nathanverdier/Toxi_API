import Boom from "@hapi/boom";
import { NextFunction, Request, Response } from "express";

/**
 * Format errors passed down the middleware chain using `Boom.boomify`.
 * Error stack trace will also be logged for programming errors.
 * If the `err` variable is not a Boom error, the status code will defaults to 500.
 * Otherwise, the status code associated with the Boom error will be used.
 */
export const errorHandler = (
  err: Error | undefined,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err) {
    return next();
  }
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== "test" && !Boom.isBoom(err)) {
    console.error(err.stack);
  }
  const { output, data } = Boom.boomify(err);
  return (
    res
      .set(output.headers)
      .status(output.statusCode)
      // @ts-ignore
      .json({ ...output.payload, ...data })
  );
};