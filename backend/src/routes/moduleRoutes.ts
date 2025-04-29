import { Router } from "express";
import moduleController from "../controllers/moduleController";
import { authenticate, isAdmin } from "../middlewares/authMiddleware";

const router = Router();
router.get("/", authenticate, moduleController.index);
router.get("/:id", authenticate, moduleController.show);
router.post("/", authenticate, isAdmin, moduleController.create);
router.put("/:id", authenticate, isAdmin, moduleController.update);
