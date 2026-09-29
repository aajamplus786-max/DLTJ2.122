-- =====================================================
-- DLTJ2.10 DATABASE MIGRATIONS
-- =====================================================
-- Target database:
-- u547248075_dltj210
--
-- Do NOT use CREATE DATABASE.
-- Do NOT use USE.
-- =====================================================

CREATE TABLE IF NOT EXISTS `projects` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `spring_url` VARCHAR(500) NULL,
    `mysql_host` VARCHAR(255) NULL,
    `mysql_port` INT NULL,
    `mysql_database` VARCHAR(255) NULL,
    `mysql_user` VARCHAR(255) NULL,
    `mysql_password` VARCHAR(255) NULL,
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME NOT NULL,

    PRIMARY KEY (`id`),
    INDEX `idx_projects_name` (`name`)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `workspace_files` (
    `file_id` VARCHAR(100) NOT NULL,
    `project_id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `path` VARCHAR(1000) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `language` VARCHAR(50) NULL,

    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`file_id`),

    INDEX `idx_workspace_project` (`project_id`),

    INDEX `idx_workspace_file_path` (
        `project_id`,
        `path`(255)
    )
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;