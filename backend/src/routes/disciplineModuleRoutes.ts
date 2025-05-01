import { Router } from "express";
import { authenticate, isAdmin } from "../middlewares/authMiddleware";
import disciplineModuleController from "../controllers/disciplineModuleController";

const router = Router();
router.get("/", authenticate, disciplineModuleController.index);
router.get("/:id", authenticate, disciplineModuleController.show);
router.post("/", authenticate, isAdmin, disciplineModuleController.create);

export default router;