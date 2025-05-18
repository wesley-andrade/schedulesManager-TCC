import { Router } from "express";
import { authenticate, isAdmin } from "../middlewares/authMiddleware";
import teacherController from "../controllers/teachersController";

const router = Router();

router.get("/", authenticate, isAdmin, teacherController.index);
router.get("/:id", authenticate, isAdmin, teacherController.show);
router.post("/", authenticate, isAdmin, teacherController.create);
router.put("/:id", authenticate, isAdmin, teacherController.update);
router.delete("/:id", authenticate, isAdmin, teacherController.remove);

export default router;
