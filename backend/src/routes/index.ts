import express from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import teacherRoutes from "./teacherRoutes";
import timeSlotsRoutes from "./timeSlotRoutes";
import scheduleRoutes from "./scheduleRoutes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/teachers", teacherRoutes);
router.use("/time-slots", timeSlotsRoutes);
router.use("/schedules", scheduleRoutes);

export default router;
