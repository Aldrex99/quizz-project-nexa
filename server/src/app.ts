/**
 * app.ts - Application for the server
 */

/* Importing modules */
import express, { Application } from "express";
import applyMiddlewares from "./middlewares/index";
import { checkAccessToken } from "./middlewares/token";
import { errorHandler } from "./middlewares/errorHandler";
import { CustomError } from "./utils/customError";
const path = require("path");

import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import categoryRouter from "./routes/category";

/* Creating the application */
const app: Application = express();

/* Setting up the middleware */
applyMiddlewares(app);

/* Setting up the API routes */
app.use("/api/auth", authRouter);
app.use("/api/user", checkAccessToken, userRouter);
app.use("/api/category", checkAccessToken, categoryRouter);

app.use("/api/*", (req, res) => {
  throw new CustomError("Route not found", 404, "NOT_FOUND", true, null);
});

app.use(errorHandler);

/* Route for public files */
app.use("/public", checkAccessToken, express.static("public"));

app.use(express.static(path.join(__dirname, "../../client/dist")));

/* Setting up the client */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist", "index.html"));
});

/* Exporting the application */
export default app;
