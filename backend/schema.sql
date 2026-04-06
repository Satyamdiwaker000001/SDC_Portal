-- SDC Portal Normalized Schema (MySQL Workbench Compatible - FIXED COLLATION)
-- Generation Date: 2026-04-06

CREATE DATABASE IF NOT EXISTS sdc_portal;
USE sdc_portal;

-- Set default collation for the whole session
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. USER: Authentication Layer
CREATE TABLE `user` (
    `id` VARCHAR(255) PRIMARY KEY,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL COMMENT 'admin, developer',
    `image` VARCHAR(500) DEFAULT 'N/A',
    `hashed_password` VARCHAR(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. MEMBER: Detailed Identity Layer
CREATE TABLE `member` (
    `id` VARCHAR(255) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `spec` VARCHAR(255) NOT NULL COMMENT 'e.g. Frontend Lead, etc.',
    `joinDate` VARCHAR(50) NOT NULL,
    `retirementDate` VARCHAR(50) DEFAULT NULL,
    `status` VARCHAR(50) NOT NULL COMMENT 'ACTIVE, PASSOUT, RETIRED',
    `image` VARCHAR(500) DEFAULT 'N/A',
    `techStack` JSON NOT NULL DEFAULT (json_array('N/A'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TEAM: Strategic Unit
CREATE TABLE `team` (
    `id` VARCHAR(255) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `leaderId` VARCHAR(255) NOT NULL,
    FOREIGN KEY (`leaderId`) REFERENCES `member`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. PROJECT: High-Level Forge Project
CREATE TABLE `project` (
    `id` VARCHAR(255) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `type` VARCHAR(100) NOT NULL COMMENT 'Cybersecurity, Web_App etc.',
    `status` VARCHAR(50) NOT NULL COMMENT 'LIVE, PENDING, COMPLETED, PENDING_ADMIN',
    `deadline` VARCHAR(50) NOT NULL,
    `progress` INT DEFAULT 0,
    `teamId` VARCHAR(255),
    FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. TASK: Operational Module Layer
CREATE TABLE `task` (
    `id` VARCHAR(255) PRIMARY KEY,
    `moduleName` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `assignedTo` VARCHAR(255),
    `status` VARCHAR(50) NOT NULL COMMENT 'TODO, IN_PROGRESS, REVIEW_PENDING, DONE',
    `project_id` VARCHAR(255) NOT NULL,
    `reviewFeedback` TEXT DEFAULT NULL,
    FOREIGN KEY (`assignedTo`) REFERENCES `member`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. APPLICATION: Recruitment Layer
CREATE TABLE `application` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `contact` VARCHAR(50) NOT NULL,
    `class_name` VARCHAR(100) NOT NULL,
    `interested` TEXT NOT NULL,
    `status` VARCHAR(50) DEFAULT 'PENDING',
    `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. ANNOUNCEMENT: Communication Layer
CREATE TABLE `announcement` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `body` TEXT NOT NULL,
    `priority` VARCHAR(50) NOT NULL COMMENT 'Normal, Important, Urgent',
    `is_global` BOOLEAN DEFAULT TRUE,
    `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. LINK_TABLES: Many-To-Many Relationships
CREATE TABLE `teammemberlink` (
    `team_id` VARCHAR(255),
    `member_id` VARCHAR(255),
    PRIMARY KEY (`team_id`, `member_id`),
    FOREIGN KEY (`team_id`) REFERENCES `team`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`member_id`) REFERENCES `member`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `announcementteamlink` (
    `announcement_id` INT,
    `team_id` VARCHAR(255),
    PRIMARY KEY (`announcement_id`, `team_id`),
    FOREIGN KEY (`announcement_id`) REFERENCES `announcement`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`team_id`) REFERENCES `team`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- 9. INITIAL ROOT DATA
INSERT INTO `user` (`id`, `email`, `name`, `role`, `hashed_password`) 
VALUES ('ROOT-ADMIN', 'admin@sdc.com', 'SDC_ROOT_ADMIN', 'admin', '$2b$12$Z.v7X4X.G4q.v7X4X.G4q.v7X4X.G4q.v7X4X.G4q.v7X4X.G4q.v7X4X.G4q.');
