-- =====================================================
-- DLTJ2.1
-- WORKING TOOL — BATCH 14
-- FILE: database/seed.sql
-- DATE: 2026-08-31
-- =====================================================

-- =====================================================
-- IMPORTANT
-- =====================================================
-- This seed file contains only development-safe
-- structural/sample data.
--
-- Do NOT place real user passwords, production
-- tokens, API keys, or database credentials here.
-- =====================================================

INSERT INTO users
(
    id,
    name,
    mobile,
    password_hash,
    mobile_verified,
    failed_login_attempts,
    locked_until,
    role,
    created_at
)
SELECT
    'seed-admin-001',
    'Development Admin',
    '9000000000',
    'REPLACE_WITH_BACKEND_HASH',
    TRUE,
    0,
    NULL,
    'admin',
    CURRENT_TIMESTAMP
WHERE NOT EXISTS
(
    SELECT 1
    FROM users
    WHERE id = 'seed-admin-001'
);

-- =====================================================
-- SAMPLE PROJECT
-- =====================================================

INSERT INTO projects
(
    id,
    name,
    owner_id,
    technology_id,
    created_at,
    updated_at
)
SELECT
    'seed-project-001',
    'Sample Working Tool Project',
    'seed-admin-001',
    'html',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS
(
    SELECT 1
    FROM projects
    WHERE id = 'seed-project-001'
);

-- =====================================================
-- SAMPLE SHARE RECORD
-- =====================================================

INSERT INTO project_shares
(
    id,
    project_id,
    owner_id,
    permission,
    token,
    active,
    created_at,
    expires_at
)
SELECT
    'seed-share-001',
    'seed-project-001',
    'seed-admin-001',
    'view',
    'DEVELOPMENT_ONLY_REPLACE_TOKEN',
    TRUE,
    CURRENT_TIMESTAMP,
    NULL
WHERE NOT EXISTS
(
    SELECT 1
    FROM project_shares
    WHERE id = 'seed-share-001'
);