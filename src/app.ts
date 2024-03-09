import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./utils/errorHandler";
import { notFoundHandler } from "./utils/notFoundHandler";
import { authErrorHandler } from "./utils/authErrorHandler";
import { bodyParserErrorHandler } from "./utils/bodyParserErrorHandler";
import PersonRouter from "./person/PersonRouter";

const app = express();

// Log HTTP requests
app.use(morgan("dev"));

// Add CORS headers.
app.use(
    cors({
        exposedHeaders: ["X-Total-Count"],
        maxAge: 600,
    })
);

// Add security headers to every requests.
app.use(helmet());

// Allow express to parse JSON bodies.
app.use(express.json());


//#region Application routes
/**
 * ⚠️ Routers are logically decoupled but applying a middleware to one will also apply it to the other. This is because they are mounted
 * at the same path and middlewares are tied to a path, not a router.
 * If you wish to apply middlewares, do it at the request level.
 *
 * This is documented in https://github.com/pillarjs/router/issues/38
 */
app.use('/v1/person', PersonRouter);
//#endregion Application routes

// Handle requests matching no routes.
app.use(notFoundHandler);

// Handle errors passed using `next(error)`.
app.use(errorHandler);

// Handle Unauthorized and Forbidden requests
app.use(authErrorHandler);

// Handle body parser syntax errors
app.use(bodyParserErrorHandler);


export default app;