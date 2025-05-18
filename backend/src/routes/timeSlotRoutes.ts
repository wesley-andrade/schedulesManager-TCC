import { Router } from "express";
import { authenticate, isAdmin } from "../middlewares/authMiddleware";
import timeSlotsController from "../controllers/timeSlotsController";

const router = Router();

router.get("/", authenticate, isAdmin, timeSlotsController.index);
router.get("/:id", authenticate, isAdmin, timeSlotsController.show);
router.post("/", authenticate, isAdmin, timeSlotsController.create);
router.put("/:id", authenticate, isAdmin, timeSlotsController.update);
router.delete("/:id", authenticate, isAdmin, timeSlotsController.remove);

export default router;
