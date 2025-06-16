import { Router } from "express";
import { authenticate, isAdmin } from "../middlewares/authMiddleware";
import disciplineTeacherController from "../controllers/disciplineTeacherController";

const router = Router();

router.get("/", authenticate, isAdmin, disciplineTeacherController.index);
router.post("/", authenticate, isAdmin, disciplineTeacherController.create);
router.delete(
  "/:id",
  authenticate,
  isAdmin,
  disciplineTeacherController.remove
);

export default router;
