import app from "./config/server";
import dotenv from "dotenv";
import customError from "./error/custom-error";
import errorMiddleware from "./middleware/error-middleware";
import webRouter from "./router/web.router";
import userRouter from "./router/user-router";

const dotenvConfig = dotenv.config();

if (dotenvConfig.error) {
  throw new customError(500, dotenvConfig.error.message);
}

app.use(webRouter);
app.use(userRouter);
app.use(errorMiddleware);

const port: string = process.env.APP_PORT!;

app.listen(port, () => {
  console.log(`Server running in port ${port} : http://127.0.0.1:${port}`);
});
