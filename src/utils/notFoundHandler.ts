import Boom from "@hapi/boom";
import { RequestHandler } from "express";

/**
 * Forwards a `Boom.notFound` error (404) if no middleware handled the request.
 */
export const notFoundHandler: RequestHandler = (req, res, next) => {
  return next(Boom.notFound(`Cannot ${req.method} ${req.path}`));
};

/**
 * Throws a `Boom.notFound` error (404) if the entity is not found
 * when searching for an entity
 */
export const notFoundEntity = (
  modelName: string,
  entityName: string,
  value: any
) => {
  throw Boom.notFound(
    `${modelName} with \`${entityName}\` matching \`${value}\` not found.`
  );
};