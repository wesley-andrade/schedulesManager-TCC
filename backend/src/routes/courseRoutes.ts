import { Router } from "express";
import { authenticate, isAdmin } from "../middlewares/authMiddleware";
import courseController from "../controllers/courseController";

const router = Router();
router.get("/", authenticate, courseController.index);
router.get("/:id", authenticate, courseController.show);
router.post("/", authenticate, isAdmin, courseController.create);
router.put("/:id", authenticate, isAdmin, courseController.update);
router.delete("/:id", authenticate, isAdmin, courseController.delete);

export default router;