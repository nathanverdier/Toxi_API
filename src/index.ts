// Inject environment variables defined in the `.env` file placed at the root of the project.
import "dotenv-defaults/config";

import { createTerminus, HealthCheckError } from "@godaddy/terminus";
import http from "http";
import mongoose from "mongoose";

import "reflect-metadata";

import app from "./app";

const connectToDatabase = async (
  url: string,
  options: mongoose.ConnectOptions
) => {
  console.log(`♻️  Connecting to database "${url}"`);
  try {
    mongoose.set("strictQuery", true); // Set to prevent a console warning
    await mongoose.connect(url, options);
    console.log(`✨ Connected to database "${url}"`);
  } catch (error) {
    console.log(`❌  Failed to connect to database "${url}"`);
    throw error;
  }
};

const startHTTPServer = async (
  server: http.Server,
  options: { host: string; port: number }
) => {
  const address = `http://${options.host}:${options.port}`;
  console.log(`♻️  Starting HTTP server on "${address}"`);
  return new Promise<void>((resolve, reject) => {
    server
      .listen(options, () => {
        console.log(`✨ HTTP server started on "${address}"`);
        return resolve();
      })
      .on("error", (error) => {
        console.log(`❌  Failed to start HTTP server on "${address}"`);
        return reject(error);
      })
      .on("SIGTERM", () => process.exit(0))
      .on("SIGINT", () => process.exit(0))
      .on("uncaughtException", () => process.exit(0));
  });
};

const server = http.createServer(app);

createTerminus(server, {
  onSignal: async () => {
    await mongoose.connection.close();
  },
  healthChecks: {
    "/healthcheck": async () => {
      return mongoose.connection.readyState === 1
        ? Promise.resolve()
        : Promise.reject(new HealthCheckError("Database not connected", null));
    },
  },
});

console.log(`🚀 Starting backend v${process.env.npm_package_version}\n`);

// Retrieve mongodb information from environement variables and connect to the database.
// While the connection is being established, mongoose will buffer operations.
// See: https://mongoosejs.com/docs/connections.html#buffering
connectToDatabase(process.env.MONGO_URL as string, {
    dbName: 'ToxyReality'
  });

// Retrieve HTTP server host and port from environment variables,
// create HTTP server and listen to connections.
startHTTPServer(server, {
  host: process.env.HOST as string,
  port: Number(process.env.PORT),
});

export default app;