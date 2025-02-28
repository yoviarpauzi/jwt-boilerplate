import express from "express";
import userController from "../controller/user-controller";
import authMiddleware from "../middleware/auth-middleware";

const router = express.Router();

router.use(authMiddleware);
router.get("/profile", userController.profile);

export default router;
