/**
 * app.ts - Application for the server
 */

/* Importing modules */
import express, { Application } from "express";
import applyMiddlewares from "@middlewares/index";
import { errorHandler } from "@middlewares/errorHandler";
import authRouter from "@routes/auth";
import { CustomError } from "@utils/customError";

/* Creating the application */
const app: Application = express();

/* Setting up the middleware */
applyMiddlewares(app);

/* Setting up the routes */
app.use("/api/auth", authRouter);

app.use("*", (req, res) => {
  throw new CustomError("Route not found", 404, "NOT_FOUND", true, null);
});

app.use(errorHandler);

/* Exporting the application */
export default app;
