import { Router } from "express";
import { authenticate, isAdmin } from "../middlewares/authMiddleware";
import classScheduleController from "../controllers/classScheduleController";

const router = Router();

router.get("/", authenticate, classScheduleController.index);
router.post(
  "/generate",
  authenticate,
  isAdmin,
  classScheduleController.generateSchedules
);
// router.put("/:id", authenticate, isAdmin, classScheduleController.update);
router.delete(
  "/:id",
  authenticate,
  isAdmin,
  classScheduleController.deleteClassSchedule
);

export default router;
