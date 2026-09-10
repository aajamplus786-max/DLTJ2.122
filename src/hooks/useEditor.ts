// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 5
// FILE: src/hooks/useEditor.ts
// =====================================================

import {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  getLanguageFromFileName,
  type SupportedLanguage,
} from "../services/language/languageService";

export interface EditorDocument {
  id: string;
  name: string;
  path: string;
  content: string;
  language: SupportedLanguage;
  savedContent: string;
}

export interface OpenEditorFile {
  id: string;
  name: string;
  path: string;
  content?: string;
  language?: SupportedLanguage;
}

export interface UseEditorReturn {
  documents: EditorDocument[];
  activeDocumentId: string | null;
  activeDocument: EditorDocument | null;
  isDirty: boolean;

  openFile: (
    file: OpenEditorFile,
  ) => void;

  closeFile: (
    id: string,
  ) => void;

  selectFile: (
    id: string,
  ) => void;

  updateContent: (
    content: string,
  ) => void;

  saveCurrentFile: () => EditorDocument | null;

  saveFile: (
    id: string,
  ) => EditorDocument | null;

  renameCurrentFile: (
    name: string,
  ) => void;

  getDocument: (
    id: string,
  ) => EditorDocument | null;

  closeAll: () => void;

  closeOthers: (
    id: string,
  ) => void;
}

export function useEditor(
  initialFiles: OpenEditorFile[] = [],
): UseEditorReturn {
  const initialDocuments =
    useMemo<EditorDocument[]>(
      () =>
        initialFiles.map((file) => ({
          id: file.id,
          name: file.name,
          path: file.path,
          content: file.content ?? "",
          language:
            file.language ??
            getLanguageFromFileName(
              file.name,
            ),
          savedContent:
            file.content ?? "",
        })),
      [initialFiles],
    );

  const [documents, setDocuments] =
    useState<EditorDocument[]>(
      initialDocuments,
    );

  const [
    activeDocumentId,
    setActiveDocumentId,
  ] = useState<string | null>(
    initialDocuments[0]?.id ?? null,
  );

  const openFile = useCallback(
    (file: OpenEditorFile) => {
      setDocuments((current) => {
        const existing =
          current.find(
            (document) =>
              document.id === file.id,
          );

        if (existing) {
          return current;
        }

        const newDocument: EditorDocument = {
          id: file.id,
          name: file.name,
          path: file.path,
          content: file.content ?? "",
          language:
            file.language ??
            getLanguageFromFileName(
              file.name,
            ),
          savedContent:
            file.content ?? "",
        };

        return [
          ...current,
          newDocument,
        ];
      });

      setActiveDocumentId(file.id);
    },
    [],
  );

  const closeFile = useCallback(
    (id: string) => {
      setDocuments((current) => {
        const index =
          current.findIndex(
            (document) =>
              document.id === id,
          );

        if (index === -1) {
          return current;
        }

        const remaining =
          current.filter(
            (document) =>
              document.id !== id,
          );

        if (
          activeDocumentId === id
        ) {
          const nextDocument =
            remaining[index] ??
            remaining[index - 1] ??
            null;

          setActiveDocumentId(
            nextDocument?.id ?? null,
          );
        }

        return remaining;
      });
    },
    [activeDocumentId],
  );

  const selectFile = useCallback(
    (id: string) => {
      const exists =
        documents.some(
          (document) =>
            document.id === id,
        );

      if (exists) {
        setActiveDocumentId(id);
      }
    },
    [documents],
  );

  const updateContent = useCallback(
    (content: string) => {
      if (!activeDocumentId) {
        return;
      }

      setDocuments((current) =>
        current.map((document) =>
          document.id ===
          activeDocumentId
            ? {
                ...document,
                content,
              }
            : document,
        ),
      );
    },
    [activeDocumentId],
  );

  const saveFile = useCallback(
    (id: string) => {
      let saved:
        | EditorDocument
        | null = null;

      setDocuments((current) =>
        current.map((document) => {
          if (document.id !== id) {
            return document;
          }

          saved = {
            ...document,
            savedContent:
              document.content,
          };

          return saved;
        }),
      );

      return saved;
    },
    [],
  );

  const saveCurrentFile =
    useCallback(() => {
      if (!activeDocumentId) {
        return null;
      }

      return saveFile(
        activeDocumentId,
      );
    }, [
      activeDocumentId,
      saveFile,
    ]);

  const renameCurrentFile =
    useCallback(
      (name: string) => {
        if (!activeDocumentId) {
          return;
        }

        setDocuments((current) =>
          current.map((document) =>
            document.id ===
            activeDocumentId
              ? {
                  ...document,
                  name,
                  language:
                    getLanguageFromFileName(
                      name,
                    ),
                }
              : document,
          ),
        );
      },
      [activeDocumentId],
    );

  const getDocument =
    useCallback(
      (id: string) =>
        documents.find(
          (document) =>
            document.id === id,
        ) ?? null,
      [documents],
    );

  const closeAll =
    useCallback(() => {
      setDocuments([]);
      setActiveDocumentId(null);
    }, []);

  const closeOthers =
    useCallback(
      (id: string) => {
        const selected =
          documents.find(
            (document) =>
              document.id === id,
          );

        if (!selected) {
          return;
        }

        setDocuments([selected]);
        setActiveDocumentId(id);
      },
      [documents],
    );

  const activeDocument =
    documents.find(
      (document) =>
        document.id ===
        activeDocumentId,
    ) ?? null;

  const isDirty =
    activeDocument
      ? activeDocument.content !==
        activeDocument.savedContent
      : false;

  return {
    documents,
    activeDocumentId,
    activeDocument,
    isDirty,
    openFile,
    closeFile,
    selectFile,
    updateContent,
    saveCurrentFile,
    saveFile,
    renameCurrentFile,
    getDocument,
    closeAll,
    closeOthers,
  };
}

export default useEditor;