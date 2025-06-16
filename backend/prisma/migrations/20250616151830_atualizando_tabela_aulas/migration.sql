/*
  Warnings:

  - Added the required column `moduleId` to the `ClassSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `classschedule` ADD COLUMN `moduleId` INTEGER NULL;

-- Atualizar registros existentes com o primeiro módulo disponível
UPDATE `classschedule` cs
JOIN `disciplineteacher` dt ON cs.disciplineTeacherId = dt.id
JOIN `disciplinemodule` dm ON dt.disciplineId = dm.disciplineId
SET cs.moduleId = dm.moduleId
WHERE cs.moduleId IS NULL;

-- Tornar o campo obrigatório
ALTER TABLE `classschedule` MODIFY COLUMN `moduleId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ClassSchedule` ADD CONSTRAINT `ClassSchedule_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `Module`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
