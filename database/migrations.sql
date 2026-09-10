-- =====================================================
-- DLTJ2.1
-- WORKING TOOL — BATCH 13
-- FILE: database/migrations.sql
-- DATE: 2026-08-31
-- =====================================================

USE dltj2;

ALTER TABLE workspace_files
    ADD INDEX IF NOT EXISTS idx_workspace_file_path (
        project_id,
        path(255)
    );

ALTER TABLE workspace_folders
    ADD INDEX IF NOT EXISTS idx_workspace_folder_path (
        project_id,
        path(255)
    );