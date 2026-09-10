-- =====================================================
-- DLTJ2.1
-- WORKING TOOL — BATCH 13
-- FILE: database/schema.sql
-- DATE: 2026-08-31
-- =====================================================

CREATE DATABASE IF NOT EXISTS dltj2;

USE dltj2;

CREATE TABLE IF NOT EXISTS user_projects (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workspace_files (
    file_id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(1000) NOT NULL,
    content LONGTEXT NOT NULL,
    language VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_workspace_project (
        project_id
    ),

    CONSTRAINT fk_workspace_project
        FOREIGN KEY (project_id)
        REFERENCES user_projects(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS workspace_folders (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(1000) NOT NULL,
    parent_id VARCHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_folder_project (
        project_id
    ),

    CONSTRAINT fk_folder_project
        FOREIGN KEY (project_id)
        REFERENCES user_projects(id)
        ON DELETE CASCADE
);