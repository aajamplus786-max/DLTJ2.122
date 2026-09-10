// =====================================================
// DLTJ2.0
// STEP 4
// FILE: src/utils/constants.ts
// =====================================================

export const CHAPTERS_PER_TEST = 5;

export const CHAPTER_TEST_MARKS = 20;

export const FINAL_TEST_MARKS = 50;

export const FINAL_TEST_DURATION = 60;

export const PASS_PERCENTAGE = 50;

export const getTestId = (
  technologyId: string,
  testNumber: number
) =>
  `${technologyId}-test-${testNumber}`;

export const getTestNumberForChapter = (
  chapterNumber: number
) =>
  Math.floor(
    (chapterNumber - 1) /
      CHAPTERS_PER_TEST
  ) + 1;

export const getRequiredTestForChapter = (
  chapterNumber: number
) => {
  if (chapterNumber <= 5) {
    return null;
  }

  return Math.floor(
    (chapterNumber - 1) /
      CHAPTERS_PER_TEST
  );
};