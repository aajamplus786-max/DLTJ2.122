
// =====================================================
// DLTJ2.10
// FINAL TEST
// FILE: src/pages/Test/FinalTest.tsx
// CREATED: 2026-09-06
// LOCATION: src/pages/Test/FinalTest.tsx
// PHASE: 10
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
  getFinalTestQuestions,
  saveTestResult,
  type TestQuestion,
} from "../../services/testService";

interface AnswerMap {
  [questionId: string]: string;
}

export default function FinalTest() {
  const navigate =
    useNavigate();

  const {
    technologyId,
  } = useParams<{
    technologyId?: string;
  }>();

  const [
    questions,
    setQuestions,
  ] = useState<
    TestQuestion[]
  >([]);

  const [
    answers,
    setAnswers,
  ] = useState<AnswerMap>({});

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    let cancelled =
      false;

    async function load() {
      if (!technologyId) {
        setError(
          "Technology ID is missing.",
        );

        setLoading(false);

        return;
      }

      setLoading(true);
      setError("");

      try {
        const data =
          await getFinalTestQuestions(
            technologyId,
          );

        if (cancelled) {
          return;
        }

        setQuestions(data);
      } catch {
        if (!cancelled) {
          setError(
            "Unable to load final test.",
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
  }, [
    technologyId,
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

  async function submit() {
    if (
      submitting
    ) {
      return;
    }

    if (
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

    if (!technologyId) {
      setError(
        "Technology ID is missing.",
      );

      return;
    }

    setSubmitting(true);
    setError("");

    try {
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
              selected.length >
                0 &&
              selected.toLowerCase() ===
                correctAnswer.toLowerCase();

            totalMarks +=
              marks;

            if (
              selected.length >
              0
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

      const result =
        await saveTestResult({
          id: "",

          technologyId,

          testType:
            "final",

          totalQuestions:
            questions.length,

          answeredQuestions,

          totalMarks,

          earnedMarks,

          score:
            earnedMarks,

          percentage,

          passed:
            percentage >= 60,

          completedAt:
            new Date().toISOString(),

          questions:
            results,
        });

      navigate(
        "/test/result",
        {
          state: {
            result,
          },
        },
      );
    } catch {
      setError(
        "Unable to save final test result.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <section className="test-page">
        <h1>
          Final Test
        </h1>

        <p>
          Loading questions...
        </p>
      </section>
    );
  }

  return (
    <section className="test-page">
      <header className="test-page-header">
        <div>
          <h1>
            Final Test
          </h1>

          <p>
            Complete the full
            technology assessment.
          </p>
        </div>
      </header>

      {error && (
        <div className="test-error">
          {error}
        </div>
      )}

      {questions.length ===
      0 ? (
        <div className="test-card">
          <h2>
            Final Test Not Ready
          </h2>

          <p>
            Final test questions are
            not available yet.
          </p>
        </div>
      ) : (
        <div className="test-question-list">
          {questions.map(
            (
              question,
              index,
            ) => (
              <article
                className="test-question-card"
                key={
                  question.id
                }
              >
                <strong>
                  Question{" "}
                  {index + 1}
                </strong>

                <h2>
                  {
                    question.questionText
                  }
                </h2>

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

                          <span>
                            {
                              `${letter}. ${text}`
                            }
                          </span>
                        </label>
                      ),
                    )}
                </div>
              </article>
            ),
          )}
        </div>
      )}

      <div className="test-actions">
        <button
          type="button"
          disabled={
            submitting ||
            questions.length ===
              0
          }
          onClick={() =>
            void submit()
          }
        >
          {submitting
            ? "Submitting..."
            : "Submit Final Test"}
        </button>

        <button
          type="button"
          onClick={() =>
            navigate("/test")
          }
        >
          Back
        </button>
      </div>
    </section>
  );
}
