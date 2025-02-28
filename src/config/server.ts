import express, { NextFunction, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";

const app = express();

const corsOptions: CorsOptions = {
  origin: "http://127.0.0.1",
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ["GET", "POST"],
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello World");
});

export default app;
