import { Router } from "express";
import { authenticate, isAdmin } from "../middlewares/authMiddleware";
import disciplineCourseController from "../controllers/disciplineCourseController";

const router = Router();

router.get("/", authenticate, isAdmin, disciplineCourseController.index);
router.post("/", authenticate, isAdmin, disciplineCourseController.create);
router.delete("/:id", authenticate, isAdmin, disciplineCourseController.remove);

export default router;
