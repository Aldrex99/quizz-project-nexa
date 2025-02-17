import logger from "morgan";
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "./cors";

const middlewares = [
  logger("dev"), // Logs requests to the console
  express.json(), // Parses JSON requests
  express.urlencoded({ extended: true }), // Parses URL encoded requests
  express.static("public"), // Serves static files
  cookieParser(), // Parses cookies
  cors.handle, // Handles CORS requests
];

export default function (app: Application) {
  middlewares.forEach((middleware) => {
    app.use(middleware as any);
  });
}
