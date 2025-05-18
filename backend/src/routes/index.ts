import express from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import teacherRoutes from "./teacherRoutes";
import timeSlotsRoutes from "./timeSlotRoutes";
import scheduleRoutes from "./scheduleRoutes";
import courseRoutes from "./courseRoutes";
import teacherAvailabilityRoutes from "./teacherAvailabilityRoutes";
import disciplineTeacherRoutes from "./disciplineTeacherRoutes";
import classScheduleRoutes from "./classScheduleRoutes";
import academicPeriodRoutes from "./academicPeriodRoutes";
import moduleRoutes from "./moduleRoutes";
import disciplineRoutes from "./disciplineRoutes";
import disciplineModuleRoutes from "./disciplineModuleRoutes";
import disciplineCourseRoutes from "./disciplineCourseRoutes";
import roomRoutes from "./roomRoutes";
import { errorHandler } from "../middlewares/errorHandler";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/teachers", teacherRoutes);
router.use("/time-slots", timeSlotsRoutes);
router.use("/schedules", scheduleRoutes);
router.use("/courses", courseRoutes);
router.use("/teacher-availability", teacherAvailabilityRoutes);
router.use("/discipline-teachers", disciplineTeacherRoutes);
router.use("/class-schedules", classScheduleRoutes);
router.use("/academic-periods", academicPeriodRoutes);
router.use("/modules", moduleRoutes);
router.use("/disciplines", disciplineRoutes);
router.use("/discipline-modules", disciplineModuleRoutes);
router.use("/discipline-courses", disciplineCourseRoutes);
router.use("/rooms", roomRoutes);

router.use(errorHandler);

export default router;
