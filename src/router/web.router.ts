import authController from "../controller/auth-controller";
import express from "express";
import errorMiddleware from "../middleware/error-middleware";

const router = express.Router();

router.post("/login", authController.authenticate);
router.get("/refresh-token", authController.refreshAccessToken);
router.get("/logout", authController.logout);
router.use(errorMiddleware);

export default router;
