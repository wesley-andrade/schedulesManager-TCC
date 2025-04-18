import { Router } from "express";
import { authenticate, isAdmin } from "../middlewares/authMiddleware";
import usersController from "../controllers/usersController";

const router = Router();

router.get("/", authenticate, isAdmin, usersController.index);
router.get("/:id", authenticate, isAdmin, usersController.show);
router.put("/:id", authenticate, isAdmin, usersController.update);
router.delete("/:id", authenticate, isAdmin, usersController.delete);

export default router;
