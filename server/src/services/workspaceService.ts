// =====================================================
// DLTJ2.1
// WORKING TOOL
// BATCH 4 — FILE MANAGEMENT BACKEND
// FILE: server/src/services/workspaceService.ts
// DATE: 2026-08-31
// =====================================================

import {
    createFile,
    createFolder,
    getWorkspaceFiles,
    getWorkspaceFolders,
    deleteWorkspaceFiles,
  } from "./fileService";
  
  export interface WorkspaceSummary {
    id: string;
  
    technologyId: string;
  
    fileCount: number;
  
    folderCount: number;
  
    createdAt: number;
  
    updatedAt: number;
  }
  
  // =====================================================
  // WORKSPACE STORAGE
  // =====================================================
  
  const workspaces =
    new Map<
      string,
      WorkspaceSummary
    >();
  
  // =====================================================
  // ID
  // =====================================================
  
  function createId(
    prefix: string
  ): string {
    return `${prefix}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}`;
  }
  
  // =====================================================
  // CREATE WORKSPACE
  // =====================================================
  
  export function createWorkspace(
    technologyId: string
  ): WorkspaceSummary {
    const now =
      Date.now();
  
    const workspace: WorkspaceSummary = {
      id:
        createId("workspace"),
  
      technologyId,
  
      fileCount: 0,
  
      folderCount: 0,
  
      createdAt:
        now,
  
      updatedAt:
        now,
    };
  
    workspaces.set(
      workspace.id,
      workspace
    );
  
    return workspace;
  }
  
  // =====================================================
  // GET
  // =====================================================
  
  export function getWorkspace(
    workspaceId: string
  ): WorkspaceSummary | null {
    return (
      workspaces.get(
        workspaceId
      ) ?? null
    );
  }
  
  // =====================================================
  // GET CONTENT
  // =====================================================
  
  export function getWorkspaceContent(
    workspaceId: string
  ) {
    const workspace =
      workspaces.get(
        workspaceId
      );
  
    if (!workspace) {
      return null;
    }
  
    return {
      workspace,
  
      files:
        getWorkspaceFiles(
          workspaceId
        ),
  
      folders:
        getWorkspaceFolders(
          workspaceId
        ),
    };
  }
  
  // =====================================================
  // CREATE DEFAULT FILE
  // =====================================================
  
  export function createDefaultWorkspaceFile(
    workspaceId: string
  ) {
    const workspace =
      workspaces.get(
        workspaceId
      );
  
    if (!workspace) {
      return null;
    }
  
    const fileName =
      getDefaultFileName(
        workspace.technologyId
      );
  
    const file =
      createFile({
        workspaceId,
  
        name:
          fileName,
  
        content:
          getDefaultContent(
            workspace.technologyId
          ),
      });
  
    refreshWorkspace(
      workspaceId
    );
  
    return file;
  }
  
  // =====================================================
  // CREATE FOLDER
  // =====================================================
  
  export function addFolder(
    workspaceId: string,
    name: string,
    parentId: string | null = null
  ) {
    if (
      !workspaces.has(
        workspaceId
      )
    ) {
      return null;
    }
  
    const folder =
      createFolder(
        workspaceId,
        name,
        parentId
      );
  
    refreshWorkspace(
      workspaceId
    );
  
    return folder;
  }
  
  // =====================================================
  // DELETE WORKSPACE
  // =====================================================
  
  export function deleteWorkspace(
    workspaceId: string
  ): boolean {
    if (
      !workspaces.has(
        workspaceId
      )
    ) {
      return false;
    }
  
    deleteWorkspaceFiles(
      workspaceId
    );
  
    return workspaces.delete(
      workspaceId
    );
  }
  
  // =====================================================
  // REFRESH COUNTS
  // =====================================================
  
  export function refreshWorkspace(
    workspaceId: string
  ): WorkspaceSummary | null {
    const workspace =
      workspaces.get(
        workspaceId
      );
  
    if (!workspace) {
      return null;
    }
  
    const updated: WorkspaceSummary = {
      ...workspace,
  
      fileCount:
        getWorkspaceFiles(
          workspaceId
        ).length,
  
      folderCount:
        getWorkspaceFolders(
          workspaceId
        ).length,
  
      updatedAt:
        Date.now(),
    };
  
    workspaces.set(
      workspaceId,
      updated
    );
  
    return updated;
  }
  
  // =====================================================
  // DEFAULT FILE NAME
  // =====================================================
  
  function getDefaultFileName(
    technologyId: string
  ): string {
    switch (
      technologyId.toLowerCase()
    ) {
      case "html":
        return "index.html";
  
      case "css":
        return "style.css";
  
      case "javascript":
        return "script.js";
  
      case "typescript":
        return "main.ts";
  
      case "python":
        return "main.py";
  
      case "java":
        return "Main.java";
  
      case "c":
        return "main.c";
  
      case "cpp":
        return "main.cpp";
  
      case "mysql":
        return "query.sql";
  
      case "react":
        return "App.tsx";
  
      case "spring":
        return "Application.java";
  
      default:
        return "main.txt";
    }
  }
  
  // =====================================================
  // DEFAULT CONTENT
  // =====================================================
  
  function getDefaultContent(
    technologyId: string
  ): string {
    switch (
      technologyId.toLowerCase()
    ) {
      case "html":
        return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DLTJ2.1</title>
  </head>
  <body>
    <h1>Hello DLTJ2.1</h1>
  </body>
  </html>`;
  
      case "css":
        return `body {
    margin: 0;
    font-family: Arial, sans-serif;
  }`;
  
      case "javascript":
        return `console.log("Hello DLTJ2.1");`;
  
      case "typescript":
        return `const message: string = "Hello DLTJ2.1";
  
  console.log(message);`;
  
      case "python":
        return `print("Hello DLTJ2.1")`;
  
      case "java":
        return `public class Main {
      public static void main(String[] args) {
          System.out.println("Hello DLTJ2.1");
      }
  }`;
  
      case "c":
        return `#include <stdio.h>
  
  int main(void) {
      printf("Hello DLTJ2.1\\n");
      return 0;
  }`;
  
      case "cpp":
        return `#include <iostream>
  
  int main() {
      std::cout << "Hello DLTJ2.1";
      return 0;
  }`;
  
      case "mysql":
        return `SELECT 'Hello DLTJ2.1' AS message;`;
  
      case "react":
        return `export default function App() {
    return <h1>Hello DLTJ2.1</h1>;
  }`;
  
      case "spring":
        return `import org.springframework.boot.SpringApplication;
  import org.springframework.boot.autoconfigure.SpringBootApplication;
  
  @SpringBootApplication
  public class Application {
      public static void main(String[] args) {
          SpringApplication.run(Application.class, args);
      }
  }`;
  
      default:
        return "";
    }
  }