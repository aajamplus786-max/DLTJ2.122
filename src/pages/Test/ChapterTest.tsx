
// =====================================================
// DLTJ2.10
// CHAPTER TEST
// FILE: src/pages/Test/ChapterTest.tsx
// UPDATED: 2026-09-07
// LOCATION: src/pages/Test/ChapterTest.tsx
// =====================================================

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getChapterTestQuestions,
  saveTestResult,
  type TestQuestion,
} from "../../services/testService";

// =====================================================
// COMMON TEST STYLE
// =====================================================

import "./Test.css";

interface AnswerMap {
  [questionId: string]: string;
}

export default function ChapterTest() {
  const navigate = useNavigate();

  const {
    technologyId,
    chapterId,
    testNumber,
  } = useParams<{
    technologyId?: string;
    chapterId?: string;
    testNumber?: string;
  }>();

  const [questions, setQuestions] =
    useState<TestQuestion[]>([]);

  const [answers, setAnswers] =
    useState<AnswerMap>({});

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [timeLeft, setTimeLeft] =
    useState(0);

  const [autoSubmitted, setAutoSubmitted] =
    useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!chapterId) {
        setError(
          "Chapter ID is missing.",
        );

        setLoading(false);

        return;
      }

      setLoading(true);
      setError("");

      try {
        const data =
          await getChapterTestQuestions(
            chapterId,
          );

        if (cancelled) {
          return;
        }

        setQuestions(data);

        const minutes =
          Math.max(
            2,
            Math.ceil(
              Math.max(
                data.length,
                1,
              ) / 5,
            ),
          );

        setTimeLeft(
          minutes * 60,
        );
      } catch {
        if (!cancelled) {
          setError(
            "Unable to load chapter test.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [chapterId]);

  useEffect(() => {
    if (
      loading ||
      timeLeft <= 0 ||
      submitting ||
      autoSubmitted
    ) {
      return;
    }

    const timer =
      window.setInterval(() => {
        setTimeLeft(
          (current) =>
            Math.max(
              current - 1,
              0,
            ),
        );
      }, 1000);

    return () =>
      window.clearInterval(
        timer,
      );
  }, [
    loading,
    timeLeft,
    submitting,
    autoSubmitted,
  ]);

  useEffect(() => {
    if (
      !loading &&
      !submitting &&
      !autoSubmitted &&
      timeLeft === 0 &&
      questions.length > 0
    ) {
      setAutoSubmitted(true);

      void submitTest(true);
    }
  }, [
    loading,
    submitting,
    autoSubmitted,
    timeLeft,
    questions.length,
  ]);

  function updateAnswer(
    questionId: string,
    answer: string,
  ) {
    setAnswers(
      (current) => ({
        ...current,
        [questionId]:
          answer,
      }),
    );
  }

  function calculateResult() {
    let totalMarks = 0;

    let earnedMarks = 0;

    let answeredQuestions =
      0;

    const results =
      questions.map(
        (question) => {
          const selected =
            (
              answers[
                question.id
              ] ?? ""
            ).trim();

          const correctAnswer =
            String(
              question.correctAnswer ??
                "",
            ).trim();

          const marks =
            Number(
              question.marks,
            ) || 1;

          const correct =
            selected.length > 0 &&
            selected.toLowerCase() ===
              correctAnswer.toLowerCase();

          totalMarks += marks;

          if (
            selected.length > 0
          ) {
            answeredQuestions++;
          }

          const earned =
            correct
              ? marks
              : 0;

          earnedMarks +=
            earned;

          return {
            questionId:
              question.id,

            selectedAnswer:
              selected,

            correctAnswer:
              correctAnswer,

            correct,

            marks,

            earnedMarks:
              earned,
          };
        },
      );

    const percentage =
      totalMarks > 0
        ? Number(
            (
              (earnedMarks /
                totalMarks) *
              100
            ).toFixed(2),
          )
        : 0;

    return {
      results,
      totalMarks,
      earnedMarks,
      answeredQuestions,
      percentage,
    };
  }

  async function submitTest(
    automatic = false,
  ) {
    if (submitting) {
      return;
    }

    if (
      !automatic &&
      questions.some(
        (question) =>
          !(
            answers[
              question.id
            ] ?? ""
          ).trim(),
      )
    ) {
      setError(
        "Please answer all questions before submitting.",
      );

      return;
    }

    if (
      !technologyId ||
      !chapterId
    ) {
      setError(
        "Test information is incomplete.",
      );

      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const calculated =
        calculateResult();

      const passed =
        calculated.percentage >=
        60;

      const result =
        await saveTestResult({
          id: "",

          technologyId,

          chapterId,

          testType:
            "chapter",

          testNumber:
            Number(
              testNumber ?? "",
            ) || undefined,

          totalQuestions:
            questions.length,

          answeredQuestions:
            calculated.answeredQuestions,

          totalMarks:
            calculated.totalMarks,

          earnedMarks:
            calculated.earnedMarks,

          score:
            calculated.earnedMarks,

          percentage:
            calculated.percentage,

          passed,

          completedAt:
            new Date().toISOString(),

          questions:
            calculated.results,
        });

      navigate(
        "/test/result",
        {
          state: {
            result,
            automatic,
          },
        },
      );
    } catch {
      setError(
        "Unable to save test result.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <section className="test-page">

        <header className="test-page-header">

          <div>
            <span className="test-eyebrow">
              DLTJ2.10 • TEST
            </span>

            <h1>
              Chapter Test
            </h1>

            <p>
              Loading questions...
            </p>
          </div>

          <div className="test-timer loading">
            --:--
          </div>

        </header>

        <div className="test-card test-loading-card">
          <div className="test-loading-spinner">
            ...
          </div>

          <h2>
            Preparing Test
          </h2>

          <p>
            Loading your chapter questions.
          </p>
        </div>

      </section>
    );
  }

  if (
    error &&
    questions.length === 0
  ) {
    return (
      <section className="test-page">

        <header className="test-page-header">

          <div>
            <span className="test-eyebrow">
              DLTJ2.10 • TEST
            </span>

            <h1>
              Chapter Test
            </h1>
          </div>

        </header>

        <div className="test-error-card">

          <div className="test-error-icon">
            !
          </div>

          <h2>
            Unable to Load Test
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            className="test-secondary-button"
            onClick={() =>
              navigate("/test")
            }
          >
            ← Back to Tests
          </button>

        </div>

      </section>
    );
  }

  const minutes =
    Math.floor(
      timeLeft / 60,
    );

  const seconds =
    timeLeft % 60;

  return (
    <section className="test-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="test-page-header">

        <div>

          <span className="test-eyebrow">
            DLTJ2.10 • CHAPTER TEST
          </span>

          <h1>
            Chapter Test
          </h1>

          <p>
            Test Block{" "}
            {testNumber ?? "1"}
          </p>

        </div>

        <div className="test-timer">

          <span>
            TIME
          </span>

          <strong>
            {minutes
              .toString()
              .padStart(
                2,
                "0",
              )}
            :
            {seconds
              .toString()
              .padStart(
                2,
                "0",
              )}
          </strong>

        </div>

      </header>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="test-error">
          {error}
        </div>
      )}

      {/* =================================================
          QUESTIONS
      ================================================= */}

      {questions.length === 0 ? (

        <div className="test-card test-empty-card">

          <div className="test-empty-icon">
            ?
          </div>

          <h2>
            No Questions
          </h2>

          <p>
            No questions are available
            for this chapter.
          </p>

        </div>

      ) : (

        <div className="test-question-list">

          {questions.map(
            (
              question,
              index,
            ) => {

              const type =
                (
                  question.questionType ??
                  "mcq"
                ).toLowerCase();

              const isMcq =
                [
                  "mcq",
                  "multiple_choice",
                  "multiple-choice",
                ].includes(type);

              const isTrueFalse =
                type ===
                  "true_false" ||
                type ===
                  "true-false";

              return (
                <article
                  className="test-question-card"
                  key={
                    question.id
                  }
                >

                  <div className="test-question-top">

                    <span className="test-question-number">
                      QUESTION{" "}
                      {index + 1}
                    </span>

                    <span className="test-question-marks">
                      {Number(
                        question.marks,
                      ) || 1}{" "}
                      Mark
                    </span>

                  </div>

                  <h2>
                    {
                      question.questionText
                    }
                  </h2>

                  {isMcq ? (

                    <div className="test-options">

                      {[
                        [
                          "A",
                          question.optionA,
                        ],
                        [
                          "B",
                          question.optionB,
                        ],
                        [
                          "C",
                          question.optionC,
                        ],
                        [
                          "D",
                          question.optionD,
                        ],
                      ]
                        .filter(
                          (
                            item,
                          ) =>
                            Boolean(
                              item[1],
                            ),
                        )
                        .map(
                          ([
                            letter,
                            text,
                          ]) => (

                            <label
                              key={
                                letter
                              }
                              className={
                                answers[
                                  question.id
                                ] ===
                                letter
                                  ? "test-option selected"
                                  : "test-option"
                              }
                            >

                              <input
                                type="radio"
                                name={
                                  question.id
                                }
                                value={
                                  letter
                                }
                                checked={
                                  answers[
                                    question.id
                                  ] ===
                                  letter
                                }
                                onChange={(
                                  event,
                                ) =>
                                  updateAnswer(
                                    question.id,
                                    event
                                      .target
                                      .value,
                                  )
                                }
                              />

                              <span className="test-option-letter">
                                {letter}
                              </span>

                              <span className="test-option-text">
                                {text}
                              </span>

                            </label>

                          ),
                        )}

                    </div>

                  ) : isTrueFalse ? (

                    <div className="test-options">

                      {[
                        "True",
                        "False",
                      ].map(
                        (value) => (

                          <label
                            key={
                              value
                            }
                            className={
                              answers[
                                question.id
                              ] ===
                              value
                                ? "test-option selected"
                                : "test-option"
                            }
                          >

                            <input
                              type="radio"
                              name={
                                question.id
                              }
                              value={
                                value
                              }
                              checked={
                                answers[
                                  question.id
                                ] ===
                                value
                              }
                              onChange={(
                                event,
                              ) =>
                                updateAnswer(
                                  question.id,
                                  event
                                    .target
                                    .value,
                                )
                              }
                            />

                            <span className="test-option-text">
                              {value}
                            </span>

                          </label>

                        ),
                      )}

                    </div>

                  ) : (

                    <textarea
                      className="test-text-answer"
                      rows={5}
                      value={
                        answers[
                          question.id
                        ] ?? ""
                      }
                      onChange={(
                        event,
                      ) =>
                        updateAnswer(
                          question.id,
                          event
                            .target
                            .value,
                        )
                      }
                      placeholder="Type your answer..."
                    />

                  )}

                </article>
              );
            },
          )}

        </div>

      )}

      {/* =================================================
          ACTIONS
      ================================================= */}

      <div className="test-actions">

        <button
          type="button"
          className="test-primary-button"
          disabled={
            submitting ||
            questions.length === 0
          }
          onClick={() =>
            void submitTest()
          }
        >
          {submitting
            ? "Submitting..."
            : "Submit Test"}
        </button>

        <button
          type="button"
          className="test-secondary-button"
          disabled={submitting}
          onClick={() =>
            navigate("/test")
          }
        >
          Exit Test
        </button>

      </div>

    </section>
  );
}
