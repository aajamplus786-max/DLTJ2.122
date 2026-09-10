// =====================================================
// DLTJ2.1 — PROJECT HOOK
// FILE: src/hooks/useProject.ts
// =====================================================

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
} from "../types/Project";

const PROJECTS_KEY =
  "dltj2.1-working-tool-projects";

export default function useProject() {
  const [projects, setProjects] =
    useState<Project[]>(() =>
      loadProjects()
    );

  const [activeProjectId, setActiveProjectId] =
    useState<string | null>(null);

  // ===================================================
  // SAVE
  // ===================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        PROJECTS_KEY,
        JSON.stringify(projects)
      );
    } catch {
      // Ignore storage errors.
    }
  }, [projects]);

  // ===================================================
  // ACTIVE PROJECT
  // ===================================================

  const activeProject =
    projects.find(
      (project) =>
        project.id ===
        activeProjectId
    ) ?? null;

  // ===================================================
  // CREATE
  // ===================================================

  const createProject =
    useCallback(
      (
        input: CreateProjectInput
      ) => {
        const now = Date.now();

        const project: Project = {
          id: createId("project"),
          name:
            input.name.trim() ||
            "Untitled Project",

          technologyId:
            input.technologyId,

          workspaceId:
            createId("workspace"),

          description:
            input.description?.trim(),

          status: "local",

          createdAt: now,
          updatedAt: now,
          lastOpenedAt: now,
        };

        setProjects(
          (current) => [
            ...current,
            project,
          ]
        );

        setActiveProjectId(
          project.id
        );

        return project;
      },
      []
    );

  // ===================================================
  // OPEN
  // ===================================================

  const openProject =
    useCallback(
      (projectId: string) => {
        setProjects(
          (current) =>
            current.map(
              (project) =>
                project.id ===
                projectId
                  ? {
                      ...project,
                      lastOpenedAt:
                        Date.now(),
                      updatedAt:
                        Date.now(),
                    }
                  : project
            )
        );

        setActiveProjectId(
          projectId
        );
      },
      []
    );

  // ===================================================
  // UPDATE
  // ===================================================

  const updateProject =
    useCallback(
      (
        projectId: string,
        updates: UpdateProjectInput
      ) => {
        setProjects(
          (current) =>
            current.map(
              (project) =>
                project.id ===
                projectId
                  ? {
                      ...project,
                      ...updates,
                      name:
                        updates.name !==
                        undefined
                          ? updates.name.trim()
                          : project.name,
                      updatedAt:
                        Date.now(),
                    }
                  : project
            )
        );
      },
      []
    );

  // ===================================================
  // DELETE
  // ===================================================

  const deleteProject =
    useCallback(
      (projectId: string) => {
        setProjects(
          (current) =>
            current.filter(
              (project) =>
                project.id !==
                projectId
            )
        );

        setActiveProjectId(
          (current) =>
            current === projectId
              ? null
              : current
        );
      },
      []
    );

  // ===================================================
  // CLOSE
  // ===================================================

  const closeProject =
    useCallback(() => {
      setActiveProjectId(null);
    }, []);

  // ===================================================
  // DUPLICATE
  // ===================================================

  const duplicateProject =
    useCallback(
      (projectId: string) => {
        const source =
          projects.find(
            (project) =>
              project.id ===
              projectId
          );

        if (!source) {
          return null;
        }

        const now = Date.now();

        const duplicate: Project = {
          ...source,

          id: createId("project"),

          name:
            `${source.name} Copy`,

          workspaceId:
            createId("workspace"),

          createdAt: now,
          updatedAt: now,
          lastOpenedAt: now,
        };

        setProjects(
          (current) => [
            ...current,
            duplicate,
          ]
        );

        setActiveProjectId(
          duplicate.id
        );

        return duplicate;
      },
      [projects]
    );

  // ===================================================
  // RESET
  // ===================================================

  const clearProjects =
    useCallback(() => {
      setProjects([]);
      setActiveProjectId(null);

      try {
        localStorage.removeItem(
          PROJECTS_KEY
        );
      } catch {
        // Ignore storage errors.
      }
    }, []);

  // ===================================================
  // RETURN
  // ===================================================

  return {
    projects,

    activeProject,
    activeProjectId,

    createProject,
    openProject,
    updateProject,
    deleteProject,
    closeProject,
    duplicateProject,
    clearProjects,
  };
}

// =====================================================
// HELPERS
// =====================================================

function createId(
  prefix: string
): string {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function loadProjects(): Project[] {
  try {
    const saved =
      localStorage.getItem(
        PROJECTS_KEY
      );

    if (!saved) {
      return [];
    }

    const parsed =
      JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}