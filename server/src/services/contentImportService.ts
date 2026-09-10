
// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// CONTENT IMPORT SERVICE
// FILE: server/src/services/contentImportService.ts
// DATE: 2026-09-07
// =====================================================

import {
    databasePool,
} from "../config/database";

import {
    createChapter,
} from "./chapterContentService";

import {
    createLesson,
} from "./lessonContentService";

import {
    createQuestion,
} from "./questionContentService";

import {
    createTest,
    addQuestionToTest,
} from "./testContentService";

// =====================================================
// RESULT
// =====================================================

export interface ImportResult {
    technologyId: string;
    technologyName: string;

    chaptersCreated: number;
    lessonsCreated: number;
    practiceQuestionsCreated: number;

    testsCreated: number;
    testQuestionsCreated: number;

    finalQuestionsCreated: number;
}

// =====================================================
// PARSED TYPES
// =====================================================

interface ParsedLesson {
    number: number;
    title: string;
    content: string;
}

interface ParsedPractice {
    type: string;
    question: string;

    optionA: string | null;
    optionB: string | null;
    optionC: string | null;
    optionD: string | null;

    answer: string;
    explanation: string | null;

    marks: number;
}

interface ParsedChapter {
    number: number;
    title: string;
    description: string | null;

    lessons: ParsedLesson[];
    practices: ParsedPractice[];
}

interface ParsedTestQuestion {
    question: string;

    optionA: string | null;
    optionB: string | null;
    optionC: string | null;
    optionD: string | null;

    answer: string;
    explanation: string | null;

    marks: number;
}

interface ParsedTest {
    type: string;
    title: string;

    startChapter: number | null;
    endChapter: number | null;

    passPercentage: number;

    questions: ParsedTestQuestion[];
}

interface ParsedFinalTest {
    title: string;
    passPercentage: number;
    questions: ParsedTestQuestion[];
}

// =====================================================
// IMPORT CONTENT
// =====================================================

export async function importContent(
    technologyId: string,
    rawContent: string,
): Promise<ImportResult> {
    if (!technologyId) {
        throw new Error(
            "Technology ID is required.",
        );
    }

    if (!rawContent.trim()) {
        throw new Error(
            "Content to import is required.",
        );
    }

    const [technologyRows] =
        await databasePool.execute<any[]>(
            `
            SELECT
                id,
                name
            FROM technologies
            WHERE id = ?
            LIMIT 1
            `,
            [technologyId],
        );

    if (
        !Array.isArray(
            technologyRows,
        ) ||
        technologyRows.length === 0
    ) {
        throw new Error(
            "Technology not found.",
        );
    }

    const technologyName =
        String(
            technologyRows[0].name,
        );

    const parsed =
        parseContent(rawContent);

    const result: ImportResult = {
        technologyId,
        technologyName,

        chaptersCreated: 0,
        lessonsCreated: 0,
        practiceQuestionsCreated: 0,

        testsCreated: 0,
        testQuestionsCreated: 0,

        finalQuestionsCreated: 0,
    };

    // =================================================
    // CHAPTERS
    // =================================================

    const createdChapterIds =
        new Map<number, string>();

    for (
        let chapterIndex = 0;
        chapterIndex <
        parsed.chapters.length;
        chapterIndex++
    ) {
        const chapter =
            parsed.chapters[
                chapterIndex
            ];

        const createdChapter =
            await createChapter({
                technologyId,

                chapterNumber:
                    chapter.number,

                title:
                    chapter.title,

                description:
                    chapter.description,

                displayOrder:
                    chapterIndex + 1,
            });

        if (!createdChapter) {
            throw new Error(
                `Failed to create chapter ${chapter.number}.`,
            );
        }

        createdChapterIds.set(
            chapter.number,
            createdChapter.id,
        );

        result.chaptersCreated++;

        // =============================================
        // LESSONS
        // =============================================

        for (
            let lessonIndex = 0;
            lessonIndex <
            chapter.lessons.length;
            lessonIndex++
        ) {
            const lesson =
                chapter.lessons[
                    lessonIndex
                ];

            await createLesson({
                chapterId:
                    createdChapter.id,

                lessonNumber:
                    lesson.number,

                title:
                    lesson.title,

                content:
                    lesson.content,

                displayOrder:
                    lessonIndex + 1,
            });

            result.lessonsCreated++;
        }

        // =============================================
        // PRACTICE QUESTIONS
        // =============================================

        for (
            let practiceIndex = 0;
            practiceIndex <
            chapter.practices.length;
            practiceIndex++
        ) {
            const practice =
                chapter.practices[
                    practiceIndex
                ];

            await createQuestion({
                technologyId,

                chapterId:
                    createdChapter.id,

                questionType:
                    practice.type,

                questionText:
                    practice.question,

                optionA:
                    practice.optionA,

                optionB:
                    practice.optionB,

                optionC:
                    practice.optionC,

                optionD:
                    practice.optionD,

                correctAnswer:
                    practice.answer,

                explanation:
                    practice.explanation,

                marks:
                    practice.marks,

                displayOrder:
                    practiceIndex + 1,
            });

            result.practiceQuestionsCreated++;
        }
    }

    // =================================================
    // CHAPTER TESTS
    // =================================================

    for (
        let testIndex = 0;
        testIndex <
        parsed.tests.length;
        testIndex++
    ) {
        const parsedTest =
            parsed.tests[
                testIndex
            ];

        const createdTest =
            await createTest({
                technologyId,

                title:
                    parsedTest.title,

                testType:
                    parsedTest.type,

                startChapter:
                    parsedTest.startChapter,

                endChapter:
                    parsedTest.endChapter,

                passPercentage:
                    parsedTest.passPercentage,

                displayOrder:
                    testIndex + 1,
            });

        if (!createdTest) {
            throw new Error(
                `Failed to create test: ${parsedTest.title}`,
            );
        }

        result.testsCreated++;

        for (
            let questionIndex = 0;
            questionIndex <
            parsedTest.questions.length;
            questionIndex++
        ) {
            const question =
                parsedTest.questions[
                    questionIndex
                ];

            const createdQuestion =
                await createQuestion({
                    technologyId,

                    chapterId:
                        findChapterForQuestion(
                            createdChapterIds,
                            parsedTest.startChapter,
                        ),

                    questionType:
                        "MCQ",

                    questionText:
                        question.question,

                    optionA:
                        question.optionA,

                    optionB:
                        question.optionB,

                    optionC:
                        question.optionC,

                    optionD:
                        question.optionD,

                    correctAnswer:
                        question.answer,

                    explanation:
                        question.explanation,

                    marks:
                        question.marks,

                    displayOrder:
                        questionIndex + 1,
                });

            if (!createdQuestion) {
                throw new Error(
                    "Failed to create test question.",
                );
            }

            await addQuestionToTest(
                createdTest.id,
                createdQuestion.id,
                question.marks,
                questionIndex + 1,
            );

            result.testQuestionsCreated++;
        }
    }

    // =================================================
    // FINAL TEST
    // =================================================

    if (parsed.finalTest) {
        const finalTest =
            await createTest({
                technologyId,

                title:
                    parsed.finalTest.title,

                testType:
                    "FINAL_TEST",

                startChapter:
                    null,

                endChapter:
                    null,

                passPercentage:
                    parsed.finalTest.passPercentage,

                displayOrder:
                    parsed.tests.length + 1,
            });

        if (!finalTest) {
            throw new Error(
                "Failed to create final test.",
            );
        }

        result.testsCreated++;

        for (
            let questionIndex = 0;
            questionIndex <
            parsed.finalTest.questions.length;
            questionIndex++
        ) {
            const question =
                parsed.finalTest.questions[
                    questionIndex
                ];

            const createdQuestion =
                await createQuestion({
                    technologyId,

                    chapterId:
                        null,

                    questionType:
                        "MCQ",

                    questionText:
                        question.question,

                    optionA:
                        question.optionA,

                    optionB:
                        question.optionB,

                    optionC:
                        question.optionC,

                    optionD:
                        question.optionD,

                    correctAnswer:
                        question.answer,

                    explanation:
                        question.explanation,

                    marks:
                        question.marks,

                    displayOrder:
                        questionIndex + 1,
                });

            if (!createdQuestion) {
                throw new Error(
                    "Failed to create final question.",
                );
            }

            await addQuestionToTest(
                finalTest.id,
                createdQuestion.id,
                question.marks,
                questionIndex + 1,
            );

            result.finalQuestionsCreated++;
        }
    }

    return result;
}

// =====================================================
// PARSER
// =====================================================

function parseContent(
    rawContent: string,
) {
    const technologyMatch =
        rawContent.match(
            /^TECHNOLOGY\s*:\s*(.+)$/im,
        );

    if (!technologyMatch) {
        throw new Error(
            "TECHNOLOGY field is missing.",
        );
    }

    const chapters =
        parseChapters(rawContent);

    const tests =
        parseTests(rawContent);

    const finalTest =
        parseFinalTest(rawContent);

    return {
        technology:
            technologyMatch[1].trim(),

        chapters,
        tests,
        finalTest,
    };
}

// =====================================================
// PARSE CHAPTERS
// =====================================================

function parseChapters(
    content: string,
): ParsedChapter[] {
    const chapters: ParsedChapter[] = [];

    const chapterRegex =
        /\[CHAPTER\]([\s\S]*?)\[\/CHAPTER\]/gi;

    let chapterMatch:
        RegExpExecArray | null;

    while (
        (chapterMatch =
            chapterRegex.exec(content))
    ) {
        const block =
            chapterMatch[1];

        const number =
            getNumberField(
                block,
                "NUMBER",
            );

        const title =
            getField(
                block,
                "TITLE",
            );

        const description =
            getField(
                block,
                "DESCRIPTION",
            );

        if (
            number === null ||
            !title
        ) {
            throw new Error(
                "Chapter NUMBER or TITLE is missing.",
            );
        }

        chapters.push({
            number,
            title,

            description:
                description || null,

            lessons:
                parseLessons(block),

            practices:
                parsePractices(block),
        });
    }

    if (
        chapters.length === 0
    ) {
        throw new Error(
            "No valid [CHAPTER] blocks found.",
        );
    }

    return chapters;
}

// =====================================================
// PARSE LESSONS
// =====================================================

function parseLessons(
    chapterBlock: string,
): ParsedLesson[] {
    const lessons: ParsedLesson[] = [];

    const regex =
        /\[LESSON\]([\s\S]*?)\[\/LESSON\]/gi;

    let match:
        RegExpExecArray | null;

    while (
        (match =
            regex.exec(chapterBlock))
    ) {
        const block =
            match[1];

        const number =
            getNumberField(
                block,
                "NUMBER",
            );

        const title =
            getField(
                block,
                "TITLE",
            );

        const content =
            getMultilineField(
                block,
                "CONTENT",
            );

        if (
            number === null ||
            !title ||
            !content
        ) {
            throw new Error(
                "Lesson NUMBER, TITLE or CONTENT is missing.",
            );
        }

        lessons.push({
            number,
            title,
            content,
        });
    }

    return lessons;
}

// =====================================================
// PARSE PRACTICE
// =====================================================

function parsePractices(
    chapterBlock: string,
): ParsedPractice[] {
    const practices: ParsedPractice[] = [];

    const regex =
        /\[PRACTICE\]([\s\S]*?)\[\/PRACTICE\]/gi;

    let match:
        RegExpExecArray | null;

    while (
        (match =
            regex.exec(chapterBlock))
    ) {
        const block =
            match[1];

        const question =
            getField(
                block,
                "QUESTION",
            );

        const answer =
            getField(
                block,
                "ANSWER",
            );

        if (
            !question ||
            !answer
        ) {
            throw new Error(
                "Practice QUESTION or ANSWER is missing.",
            );
        }

        practices.push({
            type:
                getField(
                    block,
                    "TYPE",
                ) || "MCQ",

            question,

            optionA:
                getField(
                    block,
                    "OPTION_A",
                ) || null,

            optionB:
                getField(
                    block,
                    "OPTION_B",
                ) || null,

            optionC:
                getField(
                    block,
                    "OPTION_C",
                ) || null,

            optionD:
                getField(
                    block,
                    "OPTION_D",
                ) || null,

            answer,

            explanation:
                getField(
                    block,
                    "EXPLANATION",
                ) || null,

            marks:
                getNumberField(
                    block,
                    "MARKS",
                ) ?? 1,
        });
    }

    return practices;
}

// =====================================================
// PARSE TESTS
// =====================================================

function parseTests(
    content: string,
): ParsedTest[] {
    const tests: ParsedTest[] = [];

    const regex =
        /\[TEST\]([\s\S]*?)\[\/TEST\]/gi;

    let match:
        RegExpExecArray | null;

    while (
        (match =
            regex.exec(content))
    ) {
        const block =
            match[1];

        const title =
            getField(
                block,
                "TITLE",
            );

        if (!title) {
            throw new Error(
                "Test TITLE is missing.",
            );
        }

        tests.push({
            type:
                getField(
                    block,
                    "TYPE",
                ) || "CHAPTER_TEST",

            title,

            startChapter:
                getNumberField(
                    block,
                    "START_CHAPTER",
                ),

            endChapter:
                getNumberField(
                    block,
                    "END_CHAPTER",
                ),

            passPercentage:
                getNumberField(
                    block,
                    "PASS_PERCENTAGE",
                ) ?? 60,

            questions:
                parseTestQuestions(
                    block,
                    "TEST_QUESTION",
                ),
        });
    }

    return tests;
}

// =====================================================
// PARSE FINAL TEST
// =====================================================

function parseFinalTest(
    content: string,
): ParsedFinalTest | null {
    const match =
        content.match(
            /\[FINAL_TEST\]([\s\S]*?)\[\/FINAL_TEST\]/i,
        );

    if (!match) {
        return null;
    }

    const block =
        match[1];

    const title =
        getField(
            block,
            "TITLE",
        );

    if (!title) {
        throw new Error(
            "FINAL_TEST TITLE is missing.",
        );
    }

    return {
        title,

        passPercentage:
            getNumberField(
                block,
                "PASS_PERCENTAGE",
            ) ?? 60,

        questions:
            parseTestQuestions(
                block,
                "FINAL_QUESTION",
            ),
    };
}

// =====================================================
// PARSE TEST QUESTIONS
// =====================================================

function parseTestQuestions(
    block: string,
    tagName: string,
): ParsedTestQuestion[] {
    const questions: ParsedTestQuestion[] = [];

    const regex =
        new RegExp(
            `\\[${tagName}\\]([\\s\\S]*?)\\[\\/${tagName}\\]`,
            "gi",
        );

    let match:
        RegExpExecArray | null;

    while (
        (match =
            regex.exec(block))
    ) {
        const questionBlock =
            match[1];

        const question =
            getField(
                questionBlock,
                "QUESTION",
            );

        const answer =
            getField(
                questionBlock,
                "ANSWER",
            );

        if (
            !question ||
            !answer
        ) {
            throw new Error(
                `${tagName} QUESTION or ANSWER is missing.`,
            );
        }

        questions.push({
            question,

            optionA:
                getField(
                    questionBlock,
                    "OPTION_A",
                ) || null,

            optionB:
                getField(
                    questionBlock,
                    "OPTION_B",
                ) || null,

            optionC:
                getField(
                    questionBlock,
                    "OPTION_C",
                ) || null,

            optionD:
                getField(
                    questionBlock,
                    "OPTION_D",
                ) || null,

            answer,

            explanation:
                getField(
                    questionBlock,
                    "EXPLANATION",
                ) || null,

            marks:
                getNumberField(
                    questionBlock,
                    "MARKS",
                ) ?? 1,
        });
    }

    return questions;
}

// =====================================================
// FIELD HELPER
// =====================================================

function getField(
    block: string,
    field: string,
): string | null {
    const regex =
        new RegExp(
            `^${field}\\s*:\\s*(.*)$`,
            "im",
        );

    const match =
        block.match(regex);

    return match
        ? match[1].trim()
        : null;
}

// =====================================================
// MULTILINE CONTENT
// =====================================================

function getMultilineField(
    block: string,
    field: string,
): string | null {
    const regex =
        new RegExp(
            `^${field}\\s*:\\s*([\\s\\S]*)$`,
            "im",
        );

    const match =
        block.match(regex);

    if (!match) {
        return null;
    }

    return match[1].trim();
}

// =====================================================
// NUMBER FIELD
// =====================================================

function getNumberField(
    block: string,
    field: string,
): number | null {
    const value =
        getField(
            block,
            field,
        );

    if (
        value === null ||
        value === ""
    ) {
        return null;
    }

    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : null;
}

// =====================================================
// FIND CHAPTER
// =====================================================

function findChapterForQuestion(
    chapterIds: Map<number, string>,
    startChapter: number | null,
): string | null {
    if (
        startChapter === null
    ) {
        return null;
    }

    return (
        chapterIds.get(
            startChapter,
        ) ?? null
    );
}
