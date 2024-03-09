import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./utils/errorHandler";
import { notFoundHandler } from "./utils/notFoundHandler";
import { authErrorHandler } from "./utils/authErrorHandler";
import { bodyParserErrorHandler } from "./utils/bodyParserErrorHandler";

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
app.use(express.json({ limit: "30mb" }));


//#region Application routes
/**
 * ⚠️ Routers are logically decoupled but applying a middleware to one will also apply it to the other. This is because they are mounted
 * at the same path and middlewares are tied to a path, not a router.
 * If you wish to apply middlewares, do it at the request level.
 *
 * This is documented in https://github.com/pillarjs/router/issues/38
 */

// Declare routes here, do not forget to add some versioning to the API
app.get('/', (req, res) => {
    res.send("Hello world");
});

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