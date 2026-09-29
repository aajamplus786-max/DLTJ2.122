-- =====================================================
-- DLTJ2.10
-- DATABASE SCHEMA
-- Hostinger / MySQL
-- =====================================================

-- IMPORTANT:
-- Do NOT use CREATE DATABASE here.
-- Do NOT use USE here.
-- The database is selected from phpMyAdmin / backend config.

SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- USERS
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) NOT NULL,
    name VARCHAR(150) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at VARCHAR(50) NOT NULL,
    mobile_verified TINYINT(1) NOT NULL DEFAULT 0,
    failed_login_attempts INT NOT NULL DEFAULT 0,
    locked_until BIGINT DEFAULT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY mobile (mobile)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- ADMINS
-- =====================================================

CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR(100) NOT NULL,
    name VARCHAR(150) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at VARCHAR(50) NOT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY mobile (mobile)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- AUTH SESSIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS auth_sessions (
    id VARCHAR(100) NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at BIGINT NOT NULL,
    created_at BIGINT NOT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY token (token),
    KEY idx_auth_user (user_id)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- ADMIN SESSIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS admin_sessions (
    id VARCHAR(100) NOT NULL,
    admin_id VARCHAR(100) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at BIGINT NOT NULL,
    created_at BIGINT NOT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY token (token),
    KEY idx_admin_session_admin (admin_id)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- TECHNOLOGIES
-- =====================================================

CREATE TABLE IF NOT EXISTS technologies (
    id VARCHAR(100) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,

    PRIMARY KEY (id)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- CHAPTERS
-- =====================================================

CREATE TABLE IF NOT EXISTS chapters (
    id VARCHAR(100) NOT NULL,
    technology_id VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    chapter_number INT NOT NULL,
    created_at VARCHAR(50) NOT NULL,

    PRIMARY KEY (id),
    KEY idx_chapters_technology (technology_id)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- LESSONS
-- =====================================================

CREATE TABLE IF NOT EXISTS lessons (
    id VARCHAR(100) NOT NULL,
    chapter_id VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    lesson_number INT NOT NULL,
    created_at VARCHAR(50) NOT NULL,

    PRIMARY KEY (id),
    KEY idx_lessons_chapter (chapter_id)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- QUESTIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(100) NOT NULL,
    lesson_id VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    option_a TEXT NULL,
    option_b TEXT NULL,
    option_c TEXT NULL,
    option_d TEXT NULL,
    correct_answer VARCHAR(10) NULL,
    explanation TEXT NULL,

    PRIMARY KEY (id),
    KEY idx_questions_lesson (lesson_id)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- TESTS
-- =====================================================

CREATE TABLE IF NOT EXISTS tests (
    id VARCHAR(100) NOT NULL,
    technology_id VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    created_at VARCHAR(50) NOT NULL,

    PRIMARY KEY (id),
    KEY idx_tests_technology (technology_id)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- TEST QUESTIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS test_questions (
    id VARCHAR(100) NOT NULL,
    test_id VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    option_a TEXT NULL,
    option_b TEXT NULL,
    option_c TEXT NULL,
    option_d TEXT NULL,
    correct_answer VARCHAR(10) NULL,
    explanation TEXT NULL,

    PRIMARY KEY (id),
    KEY idx_test_questions_test (test_id)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- USER PROGRESS
-- =====================================================

CREATE TABLE IF NOT EXISTS user_progress (
    id VARCHAR(100) NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    technology_id VARCHAR(100) NOT NULL,
    chapter_id VARCHAR(100) NULL,
    lesson_id VARCHAR(100) NULL,
    progress INT NOT NULL DEFAULT 0,
    completed TINYINT(1) NOT NULL DEFAULT 0,
    updated_at VARCHAR(50) NOT NULL,

    PRIMARY KEY (id),
    KEY idx_progress_user (user_id),
    KEY idx_progress_technology (technology_id)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- WORKING TOOL - PROJECTS
-- =====================================================

CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    spring_url VARCHAR(500) NULL,
    mysql_host VARCHAR(255) NULL,
    mysql_port INT NULL,
    mysql_database VARCHAR(255) NULL,
    mysql_user VARCHAR(255) NULL,
    mysql_password VARCHAR(255) NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,

    PRIMARY KEY (id),
    INDEX idx_projects_name (name)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- WORKING TOOL - WORKSPACE FILES
-- =====================================================

CREATE TABLE IF NOT EXISTS workspace_files (
    file_id VARCHAR(100) NOT NULL,
    project_id VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(1000) NOT NULL,
    content LONGTEXT NOT NULL,
    language VARCHAR(50) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (file_id),
    INDEX idx_workspace_project (project_id),
    INDEX idx_workspace_file_path (project_id, path(255))
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


SET FOREIGN_KEY_CHECKS = 1;