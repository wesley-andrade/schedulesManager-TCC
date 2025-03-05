import express from "express";
import usersController from "../controllers/usersController";
import authController from "../controllers/authController";
import { authenticate, isAdmin } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/auth/register", authenticate, isAdmin, authController.register);
router.post("/auth/login", authController.login);

router.get("/users", authenticate, isAdmin, usersController.index);
router.get("/users/:id", authenticate, isAdmin, usersController.show);
router.put("/users/:id", authenticate, isAdmin, usersController.update);
router.delete("/users/:id", authenticate, isAdmin, usersController.delete);

export default router;
