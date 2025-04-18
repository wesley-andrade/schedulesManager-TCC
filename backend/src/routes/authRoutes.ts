import { Router } from "express";
import { authenticate, isAdmin } from "../middlewares/authMiddleware";
import authController from "../controllers/authController";

const router = Router();

router.post("/register", authenticate, isAdmin, authController.register);
router.post("/login", authController.login);
router.get("/profile", authenticate, authController.profile);

export default router;
