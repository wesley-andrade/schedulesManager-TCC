ALTER TABLE `ClassSchedule` ADD COLUMN `moduleId` INTEGER NULL;

UPDATE `ClassSchedule` cs
JOIN `DisciplineTeacher` dt ON cs.disciplineTeacherId = dt.id
JOIN `DisciplineModule` dm ON dt.disciplineId = dm.disciplineId
SET cs.moduleId = dm.moduleId
WHERE cs.moduleId IS NULL;

ALTER TABLE `ClassSchedule` MODIFY COLUMN `moduleId` INTEGER NOT NULL;

ALTER TABLE `ClassSchedule` ADD CONSTRAINT `ClassSchedule_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `Module`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
