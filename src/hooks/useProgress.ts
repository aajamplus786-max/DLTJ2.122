// =====================================================
// DLTJ2.10
// LEARNING SYSTEM
// FILE: src/hooks/useProgress.ts
// UPDATED: 2026-09-07
// LOCATION: E:\DLTJ2.122\src\hooks\useProgress.ts
// =====================================================

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getProgress,
  getCurrentUserId,
  saveProgress,
} from "../services/progressService";

// =====================================================
// HOOK RESULT
// =====================================================

export interface UseProgressResult {
  completedLessons: string[];

  completedChapters: string[];

  loading: boolean;

  isLessonCompleted: (
    lessonId: string,
  ) => boolean;

  isChapterCompleted: (
    chapterId: string,
  ) => boolean;

  completeLesson: (
    lessonId: string,
  ) => void;

  completeChapter: (
    chapterId: string,
  ) => void;

  refreshProgress: () => void;
}

// =====================================================
// HOOK
// =====================================================

export default function useProgress(
  technologyId?: string,
): UseProgressResult {
  // ===================================================
  // STATE
  // ===================================================

  const [
    completedLessons,
    setCompletedLessons,
  ] = useState<string[]>([]);

  const [
    completedChapters,
    setCompletedChapters,
  ] = useState<string[]>([]);

  const [
    loading,
    setLoading,
  ] = useState<boolean>(true);

  // ===================================================
  // LOAD PROGRESS
  // ===================================================

  const loadProgress =
    useCallback(async () => {
      setLoading(true);

      try {
        const userId =
          getCurrentUserId();

        // ---------------------------------------------
        // No logged-in user
        // ---------------------------------------------

        if (
          !userId
        ) {
          setCompletedLessons([]);
          setCompletedChapters([]);
          return;
        }

        // ---------------------------------------------
        // Get progress from API / local fallback
        // ---------------------------------------------

        const progress =
          await getProgress(
            userId,
          );

        // ---------------------------------------------
        // Filter current technology
        // ---------------------------------------------

        const technologyProgress =
          technologyId
            ? progress.filter(
                (item) =>
                  item.technologyId ===
                  technologyId,
              )
            : progress;

        // ---------------------------------------------
        // Completed lessons
        // ---------------------------------------------

        const lessons =
          technologyProgress
            .filter(
              (item) =>
                item.progressType ===
                  "lesson" &&
                item.completed &&
                item.lessonId,
            )
            .map(
              (item) =>
                String(
                  item.lessonId,
                ),
            );

        // ---------------------------------------------
        // Completed chapters
        // ---------------------------------------------

        const chapters =
          technologyProgress
            .filter(
              (item) =>
                item.progressType ===
                  "chapter" &&
                item.completed &&
                item.chapterId,
            )
            .map(
              (item) =>
                String(
                  item.chapterId,
                ),
            );

        // ---------------------------------------------
        // Remove duplicates
        // ---------------------------------------------

        setCompletedLessons(
          Array.from(
            new Set(
              lessons,
            ),
          ),
        );

        setCompletedChapters(
          Array.from(
            new Set(
              chapters,
            ),
          ),
        );
      } catch (error) {
        console.error(
          "[useProgress] Failed to load progress:",
          error,
        );

        setCompletedLessons([]);
        setCompletedChapters([]);
      } finally {
        setLoading(false);
      }
    }, [
      technologyId,
    ]);

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    void loadProgress();
  }, [
    loadProgress,
  ]);

  // ===================================================
  // CHECK LESSON
  // ===================================================

  const checkLessonCompleted =
    useCallback(
      (
        lessonId: string,
      ): boolean => {
        return completedLessons.includes(
          String(
            lessonId,
          ),
        );
      },
      [
        completedLessons,
      ],
    );

  // ===================================================
  // CHECK CHAPTER
  // ===================================================

  const checkChapterCompleted =
    useCallback(
      (
        chapterId: string,
      ): boolean => {
        return completedChapters.includes(
          String(
            chapterId,
          ),
        );
      },
      [
        completedChapters,
      ],
    );

  // ===================================================
  // COMPLETE LESSON
  // ===================================================

  const completeLesson =
    useCallback(
      (
        lessonId: string,
      ): void => {
        if (
          !technologyId
        ) {
          return;
        }

        const userId =
          getCurrentUserId();

        if (
          !userId
        ) {
          return;
        }

        // -------------------------------------------
        // Immediate UI update
        // -------------------------------------------

        setCompletedLessons(
          (current) =>
            current.includes(
              String(
                lessonId,
              ),
            )
              ? current
              : [
                  ...current,
                  String(
                    lessonId,
                  ),
                ],
        );

        // -------------------------------------------
        // Save to backend
        // -------------------------------------------

        void saveProgress({
          userId,

          technologyId,

          lessonId:
            String(
              lessonId,
            ),

          progressType:
            "lesson",

          completed:
            true,
        })
          .then(() => {
            void loadProgress();
          })
          .catch(
            (error) => {
              console.error(
                "[useProgress] Failed to save lesson progress:",
                error,
              );
            },
          );
      },
      [
        technologyId,
        loadProgress,
      ],
    );

  // ===================================================
  // COMPLETE CHAPTER
  // ===================================================

  const completeChapter =
    useCallback(
      (
        chapterId: string,
      ): void => {
        if (
          !technologyId
        ) {
          return;
        }

        const userId =
          getCurrentUserId();

        if (
          !userId
        ) {
          return;
        }

        // -------------------------------------------
        // Immediate UI update
        // -------------------------------------------

        setCompletedChapters(
          (current) =>
            current.includes(
              String(
                chapterId,
              ),
            )
              ? current
              : [
                  ...current,
                  String(
                    chapterId,
                  ),
                ],
        );

        // -------------------------------------------
        // Save to backend
        // -------------------------------------------

        void saveProgress({
          userId,

          technologyId,

          chapterId:
            String(
              chapterId,
            ),

          progressType:
            "chapter",

          completed:
            true,
        })
          .then(() => {
            void loadProgress();
          })
          .catch(
            (error) => {
              console.error(
                "[useProgress] Failed to save chapter progress:",
                error,
              );
            },
          );
      },
      [
        technologyId,
        loadProgress,
      ],
    );

  // ===================================================
  // RETURN
  // ===================================================

  return {
    completedLessons,

    completedChapters,

    loading,

    isLessonCompleted:
      checkLessonCompleted,

    isChapterCompleted:
      checkChapterCompleted,

    completeLesson,

    completeChapter,

    refreshProgress:
      () => {
        void loadProgress();
      },
  };
}