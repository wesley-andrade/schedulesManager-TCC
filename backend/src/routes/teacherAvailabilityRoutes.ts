import { Router } from "express";
import { authenticate, isAdmin } from "../middlewares/authMiddleware";
import teacherAvailabilityController from "../controllers/teacherAvailabilityController";

const router = Router();

router.get("/", authenticate, isAdmin, teacherAvailabilityController.index);
router.get("/:id", authenticate, isAdmin, teacherAvailabilityController.show);
router.post("/", authenticate, isAdmin, teacherAvailabilityController.create);
router.put("/:id", authenticate, isAdmin, teacherAvailabilityController.update);
router.delete(
  "/:id",
  authenticate,
  isAdmin,
  teacherAvailabilityController.remove
);

export default router;
