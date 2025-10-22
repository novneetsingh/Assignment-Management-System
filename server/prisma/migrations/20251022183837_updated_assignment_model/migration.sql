/*
  Warnings:

  - You are about to drop the column `targetType` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the `AssignmentGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Assignment_Management_System"."AssignmentGroup" DROP CONSTRAINT "AssignmentGroup_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "Assignment_Management_System"."AssignmentGroup" DROP CONSTRAINT "AssignmentGroup_groupId_fkey";

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "targetType";

-- DropTable
DROP TABLE "Assignment_Management_System"."AssignmentGroup";

-- DropEnum
DROP TYPE "Assignment_Management_System"."AssignmentTarget";
