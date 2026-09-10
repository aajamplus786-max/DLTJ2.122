// =====================================================
// DLTJ2.1
// LEARNING SYSTEM
// FILE: src/components/learning/LessonContent.tsx
// =====================================================

import type { Lesson } from "../../types/Lesson";

// =====================================================
// PROPS
// =====================================================

interface LessonContentProps {
  lesson: Lesson;
}

// =====================================================
// COMPONENT
// =====================================================

export default function LessonContent({
  lesson,
}: LessonContentProps) {
  return (
    <article className="lesson-content">

      {/* =========================================
          INTRODUCTION
      ========================================= */}

      <section className="lesson-introduction">
        <span>
          LESSON
        </span>

        <h1>
          {lesson.title}
        </h1>

        {lesson.introduction && (
          <p>
            {lesson.introduction}
          </p>
        )}
      </section>

      {/* =========================================
          LEARNING OBJECTIVES
      ========================================= */}

      {lesson.learningObjectives &&
        lesson.learningObjectives.length > 0 && (
          <section className="lesson-objectives">
            <h2>
              Learning Objectives
            </h2>

            <ul>
              {lesson.learningObjectives.map(
                (objective, index) => (
                  <li key={index}>
                    {objective}
                  </li>
                )
              )}
            </ul>
          </section>
        )}

      {/* =========================================
          SECTIONS
      ========================================= */}

      {lesson.sections.map(
        (section, index) => (
          <section
            key={section.id}
            className="lesson-section"
          >

            {/* SECTION HEADING */}

            <div className="lesson-section-heading">
              <span>
                {String(
                  index + 1
                ).padStart(2, "0")}
              </span>

              <h2>
                {section.title}
              </h2>
            </div>

            {/* CONTENT */}

            {section.content && (
              <div className="lesson-section-content">
                <p>
                  {section.content}
                </p>
              </div>
            )}

            {/* SYNTAX */}

            {section.syntax && (
              <div className="lesson-code-block">
                <h3>
                  Syntax
                </h3>

                <pre>
                  <code>
                    {section.syntax}
                  </code>
                </pre>
              </div>
            )}

            {/* EXAMPLES */}

            {section.examples &&
              section.examples.length > 0 && (
                <div className="lesson-examples">
                  {section.examples.map(
                    (example) => (
                      <div
                        key={example.id}
                        className="lesson-code-block"
                      >
                        <h3>
                          {example.title}
                        </h3>

                        <pre>
                          <code>
                            {example.code}
                          </code>
                        </pre>

                        {example.output && (
                          <div className="lesson-example-output">
                            <h4>
                              Output
                            </h4>

                            <pre>
                              <code>
                                {example.output}
                              </code>
                            </pre>
                          </div>
                        )}

                        {example.explanation && (
                          <div className="lesson-example-explanation">
                            <h4>
                              Explanation
                            </h4>

                            <p>
                              {example.explanation}
                            </p>
                          </div>
                        )}

                        {example.realWorldUse && (
                          <div className="lesson-example-real-world">
                            <h4>
                              Real-World Use
                            </h4>

                            <p>
                              {example.realWorldUse}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}

            {/* EXPLANATION */}

            {section.explanation && (
              <div className="lesson-explanation">
                <h3>
                  Explanation
                </h3>

                <p>
                  {section.explanation}
                </p>
              </div>
            )}

            {/* IMPORTANT POINTS */}

            {section.importantPoints &&
              section.importantPoints.length > 0 && (
                <div className="lesson-important-points">
                  <h3>
                    Important Points
                  </h3>

                  <ul>
                    {section.importantPoints.map(
                      (point, pointIndex) => (
                        <li key={pointIndex}>
                          {point}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

            {/* COMMON MISTAKES */}

            {section.commonMistakes &&
              section.commonMistakes.length > 0 && (
                <div className="lesson-common-mistakes">
                  <h3>
                    Common Mistakes
                  </h3>

                  <ul>
                    {section.commonMistakes.map(
                      (
                        mistake,
                        mistakeIndex
                      ) => (
                        <li
                          key={mistakeIndex}
                        >
                          {mistake}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

            {/* BEST PRACTICES */}

            {section.bestPractices &&
              section.bestPractices.length > 0 && (
                <div className="lesson-best-practices">
                  <h3>
                    Best Practices
                  </h3>

                  <ul>
                    {section.bestPractices.map(
                      (
                        practice,
                        practiceIndex
                      ) => (
                        <li
                          key={practiceIndex}
                        >
                          {practice}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

            {/* REAL WORLD USES */}

            {section.realWorldUses &&
              section.realWorldUses.length > 0 && (
                <div className="lesson-real-world-uses">
                  <h3>
                    Real-World Uses
                  </h3>

                  <ul>
                    {section.realWorldUses.map(
                      (
                        use,
                        useIndex
                      ) => (
                        <li
                          key={useIndex}
                        >
                          {use}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

            {/* QUESTIONS */}

            {section.questions &&
              section.questions.length > 0 && (
                <div className="lesson-questions">
                  <h3>
                    Questions
                  </h3>

                  {section.questions.map(
                    (question) => (
                      <div
                        key={question.id}
                        className="lesson-question"
                      >
                        <h4>
                          {question.question}
                        </h4>

                        <p>
                          {question.answer}
                        </p>

                        {question.shortAnswer && (
                          <small>
                            Quick Answer:{" "}
                            {
                              question.shortAnswer
                            }
                          </small>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}

            {/* PRACTICE */}

            {section.practice &&
              section.practice.length > 0 && (
                <div className="lesson-practice">
                  <h3>
                    Practice
                  </h3>

                  {section.practice.map(
                    (practice) => (
                      <div
                        key={practice.id}
                        className="lesson-practice-item"
                      >
                        <h4>
                          {practice.title}
                        </h4>

                        <p>
                          {practice.instruction}
                        </p>

                        {practice.starterCode && (
                          <pre>
                            <code>
                              {
                                practice.starterCode
                              }
                            </code>
                          </pre>
                        )}

                        {practice.expectedResult && (
                          <p>
                            <strong>
                              Expected Result:
                            </strong>{" "}
                            {
                              practice.expectedResult
                            }
                          </p>
                        )}

                        {practice.solutionExplanation && (
                          <p>
                            <strong>
                              Solution:
                            </strong>{" "}
                            {
                              practice.solutionExplanation
                            }
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}

          </section>
        )
      )}

      {/* =========================================
          KEY POINTS
      ========================================= */}

      {lesson.keyPoints &&
        lesson.keyPoints.length > 0 && (
          <section className="lesson-key-points">
            <h2>
              Key Points
            </h2>

            <ul>
              {lesson.keyPoints.map(
                (point, index) => (
                  <li key={index}>
                    {point}
                  </li>
                )
              )}
            </ul>
          </section>
        )}

    </article>
  );
}