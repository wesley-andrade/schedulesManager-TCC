import { Router } from "express";
import { authenticate, isAdmin } from "../middlewares/authMiddleware";
import academicPeriodController from "../controllers/academicPeriodController";

const router = Router();

router.get("/", authenticate, academicPeriodController.index);
router.get("/:id", authenticate, academicPeriodController.show);
router.post("/", authenticate, isAdmin, academicPeriodController.create);
router.put("/:id", authenticate, isAdmin, academicPeriodController.update);
router.delete("/:id", authenticate, isAdmin, academicPeriodController.remove);

export default router;
