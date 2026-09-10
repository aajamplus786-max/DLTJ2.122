
// =====================================================
// DLTJ2.10
// USER PRACTICE TOOL
// FILE: src/pages/Practice/PracticeTool.tsx
// CREATED: 2026-09-06
// LOCATION: src/pages/Practice/PracticeTool.tsx
// =====================================================

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getQuestionsByChapter,
} from "../../services/questionService";

import type {
  Question,
} from "../../services/questionService";

import {
  savePracticeResult,
} from "../../services/practiceService";

// =====================================================
// TYPES
// =====================================================

interface AnswerMap {
  [questionId: string]: string;
}

interface QuestionResult {
  questionId: string;
  correct: boolean;
  marks: number;
}

// =====================================================
// HELPERS
// =====================================================

function normalizeType(
  value: unknown,
): string {
  return String(
    value ?? "",
  )
    .trim()
    .toLowerCase()
    .replace(
      /[\s-]+/g,
      "_",
    );
}

function cleanAnswer(
  value: unknown,
): string {
  return String(
    value ?? "",
  ).trim();
}

function answersMatch(
  userAnswer: string,
  correctAnswer: string,
): boolean {
  return (
    userAnswer
      .trim()
      .toLowerCase() ===
    correctAnswer
      .trim()
      .toLowerCase()
  );
}

function getOptions(
  question: Question,
): string[] {
  return [
    question.optionA,
    question.optionB,
    question.optionC,
    question.optionD,
  ].filter(
    (
      value,
    ): value is string =>
      Boolean(
        value &&
          value.trim(),
      ),
  );
}

// =====================================================
// COMPONENT
// =====================================================

export default function PracticeTool() {
  const navigate =
    useNavigate();

  const {
    technologyId = "",
    chapterId = "",
  } =
    useParams<{
      technologyId?: string;
      chapterId?: string;
    }>();

  const [
    questions,
    setQuestions,
  ] =
    useState<Question[]>(
      [],
    );

  const [
    answers,
    setAnswers,
  ] =
    useState<AnswerMap>(
      {},
    );

  const [
    currentIndex,
    setCurrentIndex,
  ] =
    useState<number>(
      0,
    );

  const [
    loading,
    setLoading,
  ] =
    useState<boolean>(
      true,
    );

  const [
    submitting,
    setSubmitting,
  ] =
    useState<boolean>(
      false,
    );

  const [
    submitted,
    setSubmitted,
  ] =
    useState<boolean>(
      false,
    );

  const [
    results,
    setResults,
  ] =
    useState<
      QuestionResult[]
    >([]);

  const [
    score,
    setScore,
  ] =
    useState<number>(
      0,
    );

  const [
    percentage,
    setPercentage,
  ] =
    useState<number>(
      0,
    );

  const [
    error,
    setError,
  ] =
    useState<string>(
      "",
    );

  // ===================================================
  // LOAD QUESTIONS
  // ===================================================

  const loadQuestions =
    useCallback(
      async (): Promise<void> => {
        if (!chapterId) {
          setError(
            "Chapter ID is missing.",
          );

          setLoading(
            false,
          );

          return;
        }

        try {
          setLoading(
            true,
          );

          setError(
            "",
          );

          const response =
            await getQuestionsByChapter(
              chapterId,
            );

          const list =
            Array.isArray(
              response,
            )
              ? response
              : [];

          setQuestions(
            list,
          );

          setAnswers(
            {},
          );

          setResults(
            [],
          );

          setCurrentIndex(
            0,
          );

          setSubmitted(
            false,
          );

          setScore(
            0,
          );

          setPercentage(
            0,
          );
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load practice questions.",
          );

          setQuestions(
            [],
          );
        } finally {
          setLoading(
            false,
          );
        }
      },
      [chapterId],
    );

  useEffect(() => {
    void loadQuestions();
  }, [
    loadQuestions,
  ]);

  // ===================================================
  // TOTAL MARKS
  // ===================================================

  const totalMarks =
    useMemo(
      () =>
        questions.reduce(
          (
            total,
            question,
          ) =>
            total +
            (
              Number(
                question.marks,
              ) || 1
            ),
          0,
        ),
      [
        questions,
      ],
    );

  // ===================================================
  // CURRENT QUESTION
  // ===================================================

  const currentQuestion =
    questions[
      currentIndex
    ];

  // ===================================================
  // ANSWER
  // ===================================================

  const updateAnswer =
    (
      questionId: string,
      value: string,
    ): void => {
      if (
        submitted
      ) {
        return;
      }

      setAnswers(
        (
          previous,
        ) => ({
          ...previous,
          [questionId]:
            value,
        }),
      );
    };

  // ===================================================
  // SUBMIT
  // ===================================================

  const submitPractice =
    async (): Promise<void> => {
      if (
        submitted ||
        questions.length ===
          0
      ) {
        return;
      }

      const unansweredIndex =
        questions.findIndex(
          (
            question,
          ) =>
            !cleanAnswer(
              answers[
                String(
                  question.id,
                )
              ],
            ),
        );

      if (
        unansweredIndex !==
        -1
      ) {
        setCurrentIndex(
          unansweredIndex,
        );

        setError(
          "Please answer all questions before submitting.",
        );

        return;
      }

      try {
        setSubmitting(
          true,
        );

        setError(
          "",
        );

        let earnedMarks =
          0;

        const calculatedResults =
          questions.map(
            (
              question,
            ): QuestionResult => {
              const questionId =
                String(
                  question.id,
                );

              const userAnswer =
                cleanAnswer(
                  answers[
                    questionId
                  ],
                );

              const correctAnswer =
                cleanAnswer(
                  question.correctAnswer,
                );

              const correct =
                answersMatch(
                  userAnswer,
                  correctAnswer,
                );

              const marks =
                Number(
                  question.marks,
                ) || 1;

              if (
                correct
              ) {
                earnedMarks +=
                  marks;
              }

              return {
                questionId,
                correct,
                marks,
              };
            },
          );

        const calculatedPercentage =
          totalMarks >
          0
            ? (
                earnedMarks /
                totalMarks
              ) *
              100
            : 0;

        setResults(
          calculatedResults,
        );

        setScore(
          earnedMarks,
        );

        setPercentage(
          calculatedPercentage,
        );

        setSubmitted(
          true,
        );

        await savePracticeResult({
          technologyId:
            String(
              technologyId,
            ),

          chapterId:
            String(
              chapterId,
            ),

          totalQuestions:
            questions.length,

          answeredQuestions:
            questions.length,

          totalMarks,

          score:
            earnedMarks,

          percentage:
            calculatedPercentage,

          results:
            calculatedResults,

          completedAt:
            new Date().toISOString(),
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to save practice result.",
        );
      } finally {
        setSubmitting(
          false,
        );
      }
    };

  // ===================================================
  // RETRY
  // ===================================================

  const retry =
    (): void => {
      setAnswers(
        {},
      );

      setResults(
        [],
      );

      setCurrentIndex(
        0,
      );

      setSubmitted(
        false,
      );

      setScore(
        0,
      );

      setPercentage(
        0,
      );

      setError(
        "",
      );
    };

  // ===================================================
  // LOADING
  // ===================================================

  if (
    loading
  ) {
    return (
      <div
        style={{
          padding:
            "32px",
          textAlign:
            "center",
        }}
      >
        <h2>
          Loading Practice...
        </h2>
      </div>
    );
  }

  // ===================================================
  // EMPTY
  // ===================================================

  if (
    questions.length ===
    0
  ) {
    return (
      <div
        style={{
          maxWidth:
            "900px",
          margin:
            "0 auto",
          padding:
            "32px",
        }}
      >
        {error && (
          <div
            style={{
              background:
                "#fee2e2",
              color:
                "#991b1b",
              padding:
                "12px",
              borderRadius:
                "8px",
              marginBottom:
                "16px",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            background:
              "#ffffff",
            border:
              "1px solid #e5e7eb",
            borderRadius:
              "12px",
            padding:
              "24px",
            textAlign:
              "center",
          }}
        >
          <h2>
            No Practice Questions
          </h2>

          <p
            style={{
              color:
                "#6b7280",
            }}
          >
            No active questions were found for
            this chapter.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/practice",
              )
            }
          >
            Back to Practice
          </button>
        </div>
      </div>
    );
  }

  // ===================================================
  // RESULT
  // ===================================================

  if (
    submitted
  ) {
    const correctCount =
      results.filter(
        (
          item,
        ) =>
          item.correct,
      ).length;

    return (
      <div
        style={{
          maxWidth:
            "1000px",
          margin:
            "0 auto",
          padding:
            "24px",
        }}
      >
        <div
          style={{
            background:
              "#ffffff",
            border:
              "1px solid #e5e7eb",
            borderRadius:
              "14px",
            padding:
              "24px",
            marginBottom:
              "20px",
          }}
        >
          <h1>
            Practice Result
          </h1>

          <p>
            Score:{" "}
            <strong>
              {score}
              /
              {totalMarks}
            </strong>
          </p>

          <p>
            Percentage:{" "}
            <strong>
              {percentage.toFixed(
                1,
              )}
              %
            </strong>
          </p>

          <p>
            Correct:{" "}
            <strong>
              {correctCount}
              /
              {questions.length}
            </strong>
          </p>

          <p>
            Status:{" "}
            <strong>
              {percentage >=
              60
                ? "Passed"
                : "Keep Practicing"}
            </strong>
          </p>

          <div
            style={{
              display:
                "flex",
              gap:
                "10px",
              flexWrap:
                "wrap",
              marginTop:
                "18px",
            }}
          >
            <button
              type="button"
              onClick={
                retry
              }
            >
              Practice Again
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/practice",
                )
              }
            >
              Choose Another Chapter
            </button>
          </div>
        </div>

        <div
          style={{
            display:
              "grid",
            gap:
              "10px",
          }}
        >
          {questions.map(
            (
              question,
              index,
            ) => {
              const questionResult =
                results.find(
                  (
                    item,
                  ) =>
                    item.questionId ===
                    String(
                      question.id,
                    ),
                );

              const userAnswer =
                answers[
                  String(
                    question.id,
                  )
                ] ?? "";

              return (
                <div
                  key={
                    question.id
                  }
                  style={{
                    background:
                      "#ffffff",
                    border:
                      "1px solid #e5e7eb",
                    borderRadius:
                      "12px",
                    padding:
                      "18px",
                  }}
                >
                  <strong>
                    Question{" "}
                    {index + 1}
                  </strong>

                  <p
                    style={{
                      whiteSpace:
                        "pre-wrap",
                    }}
                  >
                    {
                      question.questionText
                    }
                  </p>

                  <p>
                    Your Answer:{" "}
                    <strong>
                      {
                        userAnswer
                      }
                    </strong>
                  </p>

                  <p>
                    Correct Answer:{" "}
                    <strong>
                      {
                        question.correctAnswer
                      }
                    </strong>
                  </p>

                  <p>
                    Result:{" "}
                    <strong>
                      {questionResult?.correct
                        ? "Correct"
                        : "Incorrect"}
                    </strong>
                  </p>

                  {question.explanation && (
                    <p
                      style={{
                        color:
                          "#6b7280",
                      }}
                    >
                      {
                        question.explanation
                      }
                    </p>
                  )}
                </div>
              );
            },
          )}
        </div>
      </div>
    );
  }

  // ===================================================
  // ACTIVE QUESTION
  // ===================================================

  if (
    !currentQuestion
  ) {
    return null;
  }

  const questionType =
    normalizeType(
      currentQuestion.questionType,
    );

  const options =
    getOptions(
      currentQuestion,
    );

  const currentAnswer =
    answers[
      String(
        currentQuestion.id,
      )
    ] ?? "";

  const isMultipleChoice =
    questionType ===
    "mcq";

  const isTrueFalse =
    questionType ===
      "true_false" ||
    questionType ===
      "truefalse";

  const isTextAnswer =
    questionType ===
      "short_answer" ||
    questionType ===
      "shortanswer" ||
    questionType ===
      "code";

  return (
    <div
      style={{
        maxWidth:
          "1000px",
        margin:
          "0 auto",
        padding:
          "24px",
      }}
    >
      {error && (
        <div
          style={{
            background:
              "#fee2e2",
            color:
              "#991b1b",
            borderRadius:
              "8px",
            padding:
              "12px",
            marginBottom:
              "16px",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display:
            "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          gap:
            "12px",
          flexWrap:
            "wrap",
          marginBottom:
            "16px",
        }}
      >
        <div>
          <h1>
            Practice Tool
          </h1>

          <p
            style={{
              color:
                "#6b7280",
              marginBottom:
                0,
            }}
          >
            Question{" "}
            {currentIndex + 1}{" "}
            of{" "}
            {questions.length}
          </p>
        </div>

        <strong>
          Total Marks:{" "}
          {totalMarks}
        </strong>
      </div>

      <div
        style={{
          background:
            "#ffffff",
          border:
            "1px solid #e5e7eb",
          borderRadius:
            "14px",
          padding:
            "24px",
        }}
      >
        <p
          style={{
            color:
              "#6b7280",
          }}
        >
          Type:{" "}
          {
            currentQuestion.questionType
          }{" "}
          · Marks:{" "}
          {
            currentQuestion.marks
          }
        </p>

        <h2
          style={{
            whiteSpace:
              "pre-wrap",
          }}
        >
          {
            currentQuestion.questionText
          }
        </h2>

        {/* MCQ */}

        {isMultipleChoice &&
          options.length >
            0 && (
            <div
              style={{
                display:
                  "grid",
                gap:
                  "10px",
                marginTop:
                  "20px",
              }}
            >
              {options.map(
                (
                  option,
                  index,
                ) => {
                  const letter =
                    String.fromCharCode(
                      65 +
                        index,
                    );

                  return (
                    <label
                      key={
                        `${currentQuestion.id}-${index}`
                      }
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap:
                          "10px",
                        padding:
                          "13px",
                        border:
                          "1px solid #d1d5db",
                        borderRadius:
                          "8px",
                        cursor:
                          "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name={`practice-question-${currentQuestion.id}`}
                        value={
                          option
                        }
                        checked={
                          currentAnswer ===
                          option
                        }
                        onChange={(
                          event,
                        ) =>
                          updateAnswer(
                            String(
                              currentQuestion.id,
                            ),
                            event
                              .target
                              .value,
                          )
                        }
                      />

                      <span>
                        <strong>
                          {
                            letter
                          }
                          .
                        </strong>{" "}
                        {
                          option
                        }
                      </span>
                    </label>
                  );
                },
              )}
            </div>
          )}

        {/* TRUE / FALSE */}

        {isTrueFalse && (
          <div
            style={{
              display:
                "flex",
              gap:
                "12px",
              marginTop:
                "20px",
            }}
          >
            {[
              "True",
              "False",
            ].map(
              (
                option,
              ) => (
                <button
                  key={
                    option
                  }
                  type="button"
                  onClick={() =>
                    updateAnswer(
                      String(
                        currentQuestion.id,
                      ),
                      option,
                    )
                  }
                  style={{
                    padding:
                      "12px 24px",
                    borderRadius:
                      "8px",
                    border:
                      currentAnswer ===
                      option
                        ? "2px solid #111827"
                        : "1px solid #d1d5db",
                  }}
                >
                  {
                    option
                  }
                </button>
              ),
            )}
          </div>
        )}

        {/* SHORT ANSWER / CODE */}

        {isTextAnswer && (
          <textarea
            rows={
              questionType ===
              "code"
                ? 12
                : 6
            }
            value={
              currentAnswer
            }
            onChange={(
              event,
            ) =>
              updateAnswer(
                String(
                  currentQuestion.id,
                ),
                event.target
                  .value,
              )
            }
            placeholder={
              questionType ===
              "code"
                ? "Write your code here..."
                : "Type your answer here..."
            }
            style={{
              width:
                "100%",
              boxSizing:
                "border-box",
              marginTop:
                "20px",
              padding:
                "12px",
              border:
                "1px solid #d1d5db",
              borderRadius:
                "8px",
              fontFamily:
                questionType ===
                "code"
                  ? "monospace"
                  : "inherit",
            }}
          />
        )}

        {/* OTHER QUESTION TYPES */}

        {!isMultipleChoice &&
          !isTrueFalse &&
          !isTextAnswer && (
            <input
              type="text"
              value={
                currentAnswer
              }
              onChange={(
                event,
              ) =>
                updateAnswer(
                  String(
                    currentQuestion.id,
                  ),
                  event
                    .target
                    .value,
                )
              }
              placeholder="Enter your answer"
              style={{
                width:
                  "100%",
                boxSizing:
                  "border-box",
                marginTop:
                  "20px",
                padding:
                  "12px",
                border:
                  "1px solid #d1d5db",
                borderRadius:
                  "8px",
              }}
            />
          )}
      </div>

      {/* NAVIGATION */}

      <div
        style={{
          display:
            "flex",
          justifyContent:
            "space-between",
          gap:
            "10px",
          flexWrap:
            "wrap",
          marginTop:
            "18px",
        }}
      >
        <button
          type="button"
          onClick={() =>
            setCurrentIndex(
              (
                value,
              ) =>
                Math.max(
                  0,
                  value - 1,
                ),
            )
          }
          disabled={
            currentIndex ===
            0
          }
        >
          Previous
        </button>

        {currentIndex <
        questions.length - 1 ? (
          <button
            type="button"
            onClick={() =>
              setCurrentIndex(
                (
                  value,
                ) =>
                  Math.min(
                    questions.length -
                      1,
                    value + 1,
                  ),
              )
            }
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              void submitPractice()
            }
            disabled={
              submitting
            }
          >
            {submitting
              ? "Submitting..."
              : "Submit Practice"}
          </button>
        )}
      </div>

      {/* QUESTION NAVIGATOR */}

      <div
        style={{
          display:
            "flex",
          gap:
            "8px",
          flexWrap:
            "wrap",
          marginTop:
            "18px",
        }}
      >
        {questions.map(
          (
            question,
            index,
          ) => {
            const answered =
              Boolean(
                cleanAnswer(
                  answers[
                    String(
                      question.id,
                    )
                  ],
                ),
              );

            return (
              <button
                key={
                  question.id
                }
                type="button"
                onClick={() =>
                  setCurrentIndex(
                    index,
                  )
                }
                style={{
                  minWidth:
                    "42px",
                  padding:
                    "8px",
                  borderRadius:
                    "7px",
                  border:
                    index ===
                    currentIndex
                      ? "2px solid #111827"
                      : "1px solid #d1d5db",
                }}
              >
                {index + 1}
                {answered
                  ? " ✓"
                  : ""}
              </button>
            );
          },
        )}
      </div>
    </div>
  );
}
