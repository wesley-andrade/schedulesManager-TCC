import express from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import teacherRoutes from "./teacherRoutes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/teachers", teacherRoutes);

export default router;
