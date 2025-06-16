import { Router } from "express";
import { isAdmin, authenticate } from "../middlewares/authMiddleware";
import roomController from "../controllers/roomController";

const router = Router();

router.get("/", authenticate, isAdmin, roomController.index);
router.get("/:id", authenticate, isAdmin, roomController.show);
router.post("/", authenticate, isAdmin, roomController.create);
router.put("/:id", authenticate, isAdmin, roomController.update);
router.delete("/:id", authenticate, isAdmin, roomController.remove);

export default router;
