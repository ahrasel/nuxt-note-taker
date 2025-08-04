-- AlterTable
ALTER TABLE `notes` ADD COLUMN `category` VARCHAR(191) NOT NULL DEFAULT 'Personal',
    ADD COLUMN `color` VARCHAR(191) NOT NULL DEFAULT 'bg-gray-100 dark:bg-gray-900/20',
    ADD COLUMN `pinned` BOOLEAN NOT NULL DEFAULT false;
