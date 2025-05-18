import { Router } from "express";
import { authenticate, isAdmin } from "../middlewares/authMiddleware";
import scheduleController from "../controllers/scheduleController";

const router = Router();

router.get("/", authenticate, scheduleController.index);
router.get("/:id", authenticate, scheduleController.show);
router.post("/", authenticate, isAdmin, scheduleController.create);
router.put("/:id", authenticate, isAdmin, scheduleController.update);
router.delete("/:id", authenticate, isAdmin, scheduleController.remove);

export default router;
