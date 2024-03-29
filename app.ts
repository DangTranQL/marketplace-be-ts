import cors from "cors";
import express, { Express, Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import mongoose from "mongoose";
import dotenv from 'dotenv'; 
dotenv.config();
import { sendResponse, AppError } from "./src/helpers/utils";
import indexRouter from "./src/routes/index";

const app: Express = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

/* DB connection*/
const mongoURI: string | undefined = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error("MongoDB URI not provided in the environment variables.");
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => console.log(`DB connected ${mongoURI}`))
  .catch((err) => console.error(err));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new AppError(404, "Not Found", "Bad Request");
  next(err);
});

/* Initialize Error Handling */
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  console.error("ERROR", err);
  return sendResponse(
    res,
    err.statusCode ? err.statusCode : 500,
    false,
    null,
    { message: err.message },
    err.isOperational ? err.errorType : "Internal Server Error"
  );
});

export default app;