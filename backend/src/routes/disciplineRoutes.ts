import { Router } from "express";
import { authenticate, isAdmin } from "../middlewares/authMiddleware";
import disciplineController from "../controllers/disciplineController";

const router = Router();
router.get("/", authenticate, isAdmin, disciplineController.index);
router.get("/:id", authenticate, isAdmin, disciplineController.show);
router.post("/", authenticate, isAdmin, disciplineController.create);
router.put("/:id", authenticate, isAdmin, disciplineController.update);
router.delete("/:id", authenticate, isAdmin, disciplineController.delete);
