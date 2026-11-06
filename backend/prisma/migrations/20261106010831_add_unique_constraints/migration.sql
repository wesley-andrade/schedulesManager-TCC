/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `AcademicPeriod` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[moduleId,date,scheduleId]` on the table `ClassSchedule` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roomId,date,scheduleId]` on the table `ClassScheduleRoom` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Discipline` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[disciplineId,courseId]` on the table `DisciplineCourse` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[disciplineId,moduleId]` on the table `DisciplineModule` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[disciplineId,teacherId]` on the table `DisciplineTeacher` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dayOfWeek,timeSlotId]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teacherId,scheduleId]` on the table `TeacherAvailability` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[startTime,endTime]` on the table `TimeSlot` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `AcademicPeriod_name_key` ON `AcademicPeriod`(`name`);

-- CreateIndex
CREATE INDEX `ClassSchedule_date_scheduleId_idx` ON `ClassSchedule`(`date`, `scheduleId`);

-- CreateIndex
CREATE UNIQUE INDEX `ClassSchedule_moduleId_date_scheduleId_key` ON `ClassSchedule`(`moduleId`, `date`, `scheduleId`);

-- CreateIndex
CREATE INDEX `ClassScheduleRoom_date_scheduleId_idx` ON `ClassScheduleRoom`(`date`, `scheduleId`);

-- CreateIndex
CREATE UNIQUE INDEX `ClassScheduleRoom_roomId_date_scheduleId_key` ON `ClassScheduleRoom`(`roomId`, `date`, `scheduleId`);

-- CreateIndex
CREATE UNIQUE INDEX `Course_name_key` ON `Course`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Discipline_name_key` ON `Discipline`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `DisciplineCourse_disciplineId_courseId_key` ON `DisciplineCourse`(`disciplineId`, `courseId`);

-- CreateIndex
CREATE UNIQUE INDEX `DisciplineModule_disciplineId_moduleId_key` ON `DisciplineModule`(`disciplineId`, `moduleId`);

-- CreateIndex
CREATE UNIQUE INDEX `DisciplineTeacher_disciplineId_teacherId_key` ON `DisciplineTeacher`(`disciplineId`, `teacherId`);

-- CreateIndex
CREATE UNIQUE INDEX `Schedule_dayOfWeek_timeSlotId_key` ON `Schedule`(`dayOfWeek`, `timeSlotId`);

-- CreateIndex
CREATE UNIQUE INDEX `TeacherAvailability_teacherId_scheduleId_key` ON `TeacherAvailability`(`teacherId`, `scheduleId`);

-- CreateIndex
CREATE UNIQUE INDEX `TimeSlot_startTime_endTime_key` ON `TimeSlot`(`startTime`, `endTime`);
