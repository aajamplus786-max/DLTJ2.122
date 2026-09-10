
// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// ADMIN CONTENT IMPORT
// FILE: src/pages/Admin/ContentImport.tsx
// DATE: 2026-09-07
// =====================================================

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  apiGet,
  apiPost,
  normalizeList,
} from "./adminApi";

interface Technology {
  id: string | number;
  name: string;
}

interface ImportChapter {
  chapterNumber: number;
  title: string;
  description?: string;
  lessons?: unknown[];
  questions?: unknown[];
}

interface ImportTest {
  title: string;
  testType: string;
  startChapter?: number | null;
  endChapter?: number | null;
  passPercentage?: number;
  questions?: unknown[];
}

interface ParsedPreview {
  technology?: string;
  chapters: ImportChapter[];
  tests: ImportTest[];
  finalTest?: {
    title: string;
    passPercentage: number;
    questions: unknown[];
  } | null;
}

const exampleFormat = `TECHNOLOGY: HTML

[CHAPTER]
NUMBER: 1
TITLE: Introduction to HTML
DESCRIPTION: Learn the basics of HTML.

[LESSON]
NUMBER: 1
TITLE: What is HTML?
CONTENT:
HTML is the standard markup language used to create web pages.
HTML uses elements and tags to structure content.
You can write multiple lines here.
[/LESSON]

[PRACTICE]
TYPE: MCQ
QUESTION: HTML stands for?
OPTION_A: Hyper Text Markup Language
OPTION_B: High Text Machine Language
OPTION_C: Hyper Tool Markup Language
OPTION_D: Home Tool Markup Language
ANSWER: A
EXPLANATION: A is correct.
MARKS: 1
[/PRACTICE]

[/CHAPTER]

[TEST]
TYPE: CHAPTER_TEST
TITLE: HTML Chapter 1 Test
START_CHAPTER: 1
END_CHAPTER: 1
PASS_PERCENTAGE: 60

[TEST_QUESTION]
QUESTION: Which tag is the root element?
OPTION_A: html
OPTION_B: body
OPTION_C: head
OPTION_D: title
ANSWER: A
EXPLANATION: The html element is the root element.
MARKS: 1
[/TEST_QUESTION]

[/TEST]

[FINAL_TEST]
TITLE: HTML Final Test
PASS_PERCENTAGE: 60

[FINAL_QUESTION]
QUESTION: Which language is used to structure a webpage?
OPTION_A: HTML
OPTION_B: CSS
OPTION_C: SQL
OPTION_D: Python
ANSWER: A
EXPLANATION: HTML is used to structure webpage content.
MARKS: 1
[/FINAL_QUESTION]

[/FINAL_TEST]`;

export default function ContentImport() {
  const [
    technologies,
    setTechnologies,
  ] = useState<Technology[]>([]);

  const [
    technologyId,
    setTechnologyId,
  ] = useState("");

  const [
    text,
    setText,
  ] = useState("");

  const [
    parsed,
    setParsed,
  ] =
    useState<ParsedPreview | null>(
      null,
    );

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    importing,
    setImporting,
  ] = useState(false);

  // ===================================================
  // LOAD TECHNOLOGIES
  // ===================================================

  useEffect(() => {
    const load =
      async () => {
        try {
          const result =
            await apiGet<unknown>(
              "/content/technologies",
            );

          const list =
            normalizeList<Technology>(
              result,
            );

          setTechnologies(
            list,
          );

          if (
            list.length > 0
          ) {
            setTechnologyId(
              String(
                list[0].id,
              ),
            );
          }
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load technologies.",
          );
        }
      };

    void load();
  }, []);

  // ===================================================
  // PREVIEW PARSER
  // ===================================================

  function buildPreview(
    value: string,
  ): ParsedPreview {
    const chapterMatches =
      value.match(
        /\[CHAPTER\][\s\S]*?\[\/CHAPTER\]/gi,
      ) ?? [];

    const testMatches =
      value.match(
        /\[TEST\][\s\S]*?\[\/TEST\]/gi,
      ) ?? [];

    const finalMatch =
      value.match(
        /\[FINAL_TEST\][\s\S]*?\[\/FINAL_TEST\]/i,
      );

    const technologyMatch =
      value.match(
        /^TECHNOLOGY\s*:\s*(.+)$/im,
      );

    const countTag = (
      block: string,
      tag: string,
    ): number => {
      const matches =
        block.match(
          new RegExp(
            `\\[${tag}\\]`,
            "gi",
          ),
        );

      return matches?.length ?? 0;
    };

    const chapters: ImportChapter[] =
      chapterMatches.map(
        (
          block,
          index,
        ) => {
          const titleMatch =
            block.match(
              /^TITLE\s*:\s*(.+)$/im,
            );

          return {
            chapterNumber:
              index + 1,

            title:
              titleMatch?.[1]?.trim() ??
              "",

            lessons:
              Array.from({
                length:
                  countTag(
                    block,
                    "LESSON",
                  ),
              }),

            questions:
              Array.from({
                length:
                  countTag(
                    block,
                    "PRACTICE",
                  ),
              }),
          };
        },
      );

    const tests: ImportTest[] =
      testMatches.map(
        (
          block,
        ) => {
          const titleMatch =
            block.match(
              /^TITLE\s*:\s*(.+)$/im,
            );

          const typeMatch =
            block.match(
              /^TYPE\s*:\s*(.+)$/im,
            );

          return {
            title:
              titleMatch?.[1]?.trim() ??
              "",

            testType:
              typeMatch?.[1]?.trim() ??
              "CHAPTER_TEST",

            questions:
              Array.from({
                length:
                  countTag(
                    block,
                    "TEST_QUESTION",
                  ),
              }),
          };
        },
      );

    let finalTest:
      ParsedPreview["finalTest"] =
        null;

    if (finalMatch) {
      const finalBlock =
        finalMatch[0];

      const titleMatch =
        finalBlock.match(
          /^TITLE\s*:\s*(.+)$/im,
        );

      const percentageMatch =
        finalBlock.match(
          /^PASS_PERCENTAGE\s*:\s*(.+)$/im,
        );

      finalTest = {
        title:
          titleMatch?.[1]?.trim() ??
          "",

        passPercentage:
          Number(
            percentageMatch?.[1] ??
              60,
          ),

        questions:
          Array.from({
            length:
              countTag(
                finalBlock,
                "FINAL_QUESTION",
              ),
          }),
      };
    }

    return {
      technology:
        technologyMatch?.[1]?.trim(),

      chapters,

      tests,

      finalTest,
    };
  }

  // ===================================================
  // PARSE
  // ===================================================

  function handleParse() {
    setError("");
    setSuccess("");
    setParsed(null);

    if (!text.trim()) {
      setError(
        "Paste the fixed DLTJ2.10 text format first.",
      );
      return;
    }

    if (
      !/^TECHNOLOGY\s*:/im.test(
        text,
      )
    ) {
      setError(
        "TECHNOLOGY field is missing.",
      );
      return;
    }

    if (
      !/\[CHAPTER\]/i.test(
        text,
      )
    ) {
      setError(
        "At least one [CHAPTER] block is required.",
      );
      return;
    }

    try {
      const preview =
        buildPreview(text);

      setParsed(
        preview,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to preview content.",
      );
    }
  }

  // ===================================================
  // COUNTS
  // ===================================================

  const counts =
    useMemo(() => {
      const chapters =
        parsed?.chapters ?? [];

      const lessons =
        chapters.reduce(
          (
            total,
            chapter,
          ) =>
            total +
            (chapter.lessons?.length ??
              0),
          0,
        );

      const practiceQuestions =
        chapters.reduce(
          (
            total,
            chapter,
          ) =>
            total +
            (chapter.questions?.length ??
              0),
          0,
        );

      const testQuestions =
        parsed?.tests?.reduce(
          (
            total,
            test,
          ) =>
            total +
            (test.questions?.length ??
              0),
          0,
        ) ?? 0;

      const finalQuestions =
        parsed?.finalTest?.questions
          ?.length ?? 0;

      return {
        chapters:
          chapters.length,

        lessons,

        practiceQuestions,

        tests:
          parsed?.tests?.length ?? 0,

        testQuestions,

        finalQuestions,
      };
    }, [parsed]);

  // ===================================================
  // IMPORT
  // ===================================================

  async function handleImport() {
    setError("");
    setSuccess("");

    if (!technologyId) {
      setError(
        "Select a technology.",
      );
      return;
    }

    if (!text.trim()) {
      setError(
        "Paste content before importing.",
      );
      return;
    }

    try {
      setImporting(
        true,
      );

      await apiPost(
        `/content/import/${encodeURIComponent(
          technologyId,
        )}`,
        {
          rawContent:
            text,
        },
      );

      setSuccess(
        "Full content imported successfully.",
      );

      setText("");
      setParsed(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Content import failed.",
      );
    } finally {
      setImporting(
        false,
      );
    }
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <main
      style={{
        minHeight:
          "100vh",

        padding:
          "28px 20px",

        boxSizing:
          "border-box",

        background:
          "#f8fafc",
      }}
    >
      <div
        style={{
          maxWidth:
            "1200px",

          margin:
            "0 auto",
        }}
      >
        <h1>
          DLTJ2.10 Full Content Import
        </h1>

        <p
          style={{
            color:
              "#64748b",
          }}
        >
          Select a technology, paste the
          complete fixed text content,
          preview it, then import everything
          in one operation.
        </p>

        {error && (
          <div
            style={{
              padding:
                "14px",

              borderRadius:
                "10px",

              marginBottom:
                "15px",

              background:
                "#fee2e2",

              color:
                "#991b1b",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              padding:
                "14px",

              borderRadius:
                "10px",

              marginBottom:
                "15px",

              background:
                "#dcfce7",

              color:
                "#166534",
            }}
          >
            {success}
          </div>
        )}

        <section
          style={{
            background:
              "#ffffff",

            padding:
              "22px",

            borderRadius:
              "16px",

            marginBottom:
              "20px",
          }}
        >
          <label
            style={{
              display:
                "block",

              marginBottom:
                "16px",
            }}
          >
            <div
              style={{
                fontWeight:
                  700,

                marginBottom:
                  "6px",
              }}
            >
              Technology
            </div>

            <select
              value={
                technologyId
              }
              onChange={(
                event,
              ) =>
                setTechnologyId(
                  event.target.value,
                )
              }
              style={{
                width:
                  "100%",

                maxWidth:
                  "500px",

                padding:
                  "11px",

                border:
                  "1px solid #cbd5e1",

                borderRadius:
                  "10px",
              }}
            >
              <option value="">
                Select technology
              </option>

              {technologies.map(
                (
                  technology,
                ) => (
                  <option
                    key={
                      technology.id
                    }
                    value={String(
                      technology.id,
                    )}
                  >
                    {
                      technology.name
                    }
                  </option>
                ),
              )}
            </select>
          </label>

          <textarea
            value={
              text
            }
            onChange={(
              event,
            ) =>
              setText(
                event.target.value,
              )
            }
            placeholder={
              exampleFormat
            }
            rows={30}
            spellCheck={
              false
            }
            style={{
              width:
                "100%",

              boxSizing:
                "border-box",

              padding:
                "14px",

              border:
                "1px solid #cbd5e1",

              borderRadius:
                "12px",

              fontFamily:
                "monospace",

              resize:
                "vertical",

              minHeight:
                "600px",
            }}
          />

          <div
            style={{
              display:
                "flex",

              gap:
                "10px",

              flexWrap:
                "wrap",

              marginTop:
                "16px",
            }}
          >
            <button
              type="button"
              onClick={
                handleParse
              }
              style={{
                padding:
                  "11px 18px",

                cursor:
                  "pointer",

                fontWeight:
                  700,
              }}
            >
              Parse & Preview
            </button>

            <button
              type="button"
              onClick={() =>
                setText(
                  exampleFormat,
                )
              }
              style={{
                padding:
                  "11px 18px",

                cursor:
                  "pointer",
              }}
            >
              Load Example
            </button>

            <button
              type="button"
              onClick={() => {
                setText("");
                setParsed(null);
                setError("");
                setSuccess("");
              }}
              style={{
                padding:
                  "11px 18px",

                cursor:
                  "pointer",
              }}
            >
              Clear
            </button>
          </div>
        </section>

        {parsed && (
          <section
            style={{
              background:
                "#ffffff",

              padding:
                "22px",

              borderRadius:
                "16px",
            }}
          >
            <h2>
              Import Preview
            </h2>

            <div
              style={{
                display:
                  "grid",

                gridTemplateColumns:
                  "repeat(auto-fit, minmax(150px, 1fr))",

                gap:
                  "12px",
              }}
            >
              <div>
                <strong>
                  Chapters
                </strong>

                <div>
                  {
                    counts.chapters
                  }
                </div>
              </div>

              <div>
                <strong>
                  Lessons
                </strong>

                <div>
                  {
                    counts.lessons
                  }
                </div>
              </div>

              <div>
                <strong>
                  Practice Questions
                </strong>

                <div>
                  {
                    counts.practiceQuestions
                  }
                </div>
              </div>

              <div>
                <strong>
                  Chapter Tests
                </strong>

                <div>
                  {
                    counts.tests
                  }
                </div>
              </div>

              <div>
                <strong>
                  Test Questions
                </strong>

                <div>
                  {
                    counts.testQuestions
                  }
                </div>
              </div>

              <div>
                <strong>
                  Final Questions
                </strong>

                <div>
                  {
                    counts.finalQuestions
                  }
                </div>
              </div>
            </div>

            <pre
              style={{
                marginTop:
                  "20px",

                padding:
                  "15px",

                background:
                  "#0f172a",

                color:
                  "#e2e8f0",

                borderRadius:
                  "12px",

                overflow:
                  "auto",
              }}
            >
              {JSON.stringify(
                parsed,
                null,
                2,
              )}
            </pre>

            <button
              type="button"
              disabled={
                importing
              }
              onClick={() =>
                void handleImport()
              }
              style={{
                marginTop:
                  "18px",

                padding:
                  "12px 20px",

                cursor:
                  importing
                    ? "not-allowed"
                    : "pointer",

                fontWeight:
                  700,
              }}
            >
              {importing
                ? "Importing Full Content..."
                : "Confirm Full Import"}
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
