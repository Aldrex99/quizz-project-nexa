/**
 * app.ts - Application for the server
 */

/* Importing modules */
import express, { Application } from "express";
import applyMiddlewares from "./middlewares/index";
import { errorHandler } from "./middlewares/errorHandler";
import authRouter from "./routes/auth";
const path = require("path");

/* Creating the application */
const app: Application = express();

/* Setting up the middleware */
applyMiddlewares(app);

/* Setting up the routes */
app.use("/api/auth", authRouter);

app.use(errorHandler);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/client", "index.html"));
});

/* Exporting the application */
export default app;
