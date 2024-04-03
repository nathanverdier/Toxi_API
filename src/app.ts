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


const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');

// auth0 middleware
const checkJwt = auth({
    audience: '{yourApiIdentifier}',
    issuerBaseURL: `https://{yourDomain}/`,
  });
  

// exemple d'utilisation des routes avec auth0

// // This route doesn't need authentication
// app.get('/api/public', function(req, res) {
//     res.json({
//       message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
//     });
//   });
  
//   // This route needs authentication
//   app.get('/api/private', checkJwt, function(req, res) {
//     res.json({
//       message: 'Hello from a private endpoint! You need to be authenticated to see this.'
//     });
//   });
  
//   const checkScopes = requiredScopes('read:messages');
  
//   app.get('/api/private-scoped', checkJwt, checkScopes, function(req, res) {
//     res.json({
//       message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
//     });
//   });

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