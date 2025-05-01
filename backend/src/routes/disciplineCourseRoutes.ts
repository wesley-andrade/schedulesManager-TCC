import { Router } from "express";
import { authenticate, isAdmin } from "../middlewares/authMiddleware";
import disciplineCourseController from "../controllers/disciplineCourseController";

const router = Router();
router.get("/", authenticate, disciplineCourseController.index);
router.post("/", authenticate, isAdmin, disciplineCourseController.create);
router.post("/:id", authenticate, isAdmin, disciplineCourseController.delete);

export default router;