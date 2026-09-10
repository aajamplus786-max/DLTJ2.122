// =====================================================
// DLTJ2.10
// FRONTEND LEARNING SERVICE
// FILE: src/services/learningService.ts
// =====================================================

import {
  getTechnologies,
  getTechnology,
  type Technology,
} from "./technologyService";

import {
  getChaptersByTechnology,
  getChapter,
  type Chapter,
} from "./chapterService";

import {
  getLessonsByChapter,
  getLesson,
  type Lesson,
} from "./lessonService";

export interface LearningTechnology
  extends Technology {
  chapters?: Chapter[];
}

export interface LearningChapter
  extends Chapter {
  lessons?: Lesson[];
}

export async function getLearningTechnologies(): Promise<
  Technology[]
> {
  return getTechnologies(false);
}

export async function getLearningTechnology(
  technologyId: string | number,
): Promise<Technology | null> {
  return getTechnology(technologyId);
}

export async function getLearningChapters(
  technologyId: string | number,
): Promise<Chapter[]> {
  return getChaptersByTechnology(
    technologyId,
  );
}

export async function getLearningChapter(
  chapterId: string | number,
): Promise<Chapter | null> {
  return getChapter(chapterId);
}

export async function getLearningLessons(
  chapterId: string | number,
): Promise<Lesson[]> {
  return getLessonsByChapter(chapterId);
}

export async function getLearningLesson(
  lessonId: string | number,
): Promise<Lesson | null> {
  return getLesson(lessonId);
}

export async function getCompleteLearningTechnology(
  technologyId: string | number,
): Promise<LearningTechnology | null> {
  const technology =
    await getTechnology(technologyId);

  if (!technology) {
    return null;
  }

  const chapters =
    await getChaptersByTechnology(
      technologyId,
    );

  return {
    ...technology,
    chapters,
  };
}

export async function getCompleteLearningChapter(
  chapterId: string | number,
): Promise<LearningChapter | null> {
  const chapter =
    await getChapter(chapterId);

  if (!chapter) {
    return null;
  }

  const lessons =
    await getLessonsByChapter(
      chapterId,
    );

  return {
    ...chapter,
    lessons,
  };
}

const learningService = {
  getLearningTechnologies,
  getLearningTechnology,
  getLearningChapters,
  getLearningChapter,
  getLearningLessons,
  getLearningLesson,
  getCompleteLearningTechnology,
  getCompleteLearningChapter,
};

export default learningService;