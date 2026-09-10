// =====================================================
// DLTJ2.1
// LEARNING SYSTEM
// FILE: src/components/learning/LessonSection.tsx
// =====================================================

import type { LessonSection as LessonSectionType } from "../../types/Lesson";

// =====================================================
// PROPS
// =====================================================

interface LessonSectionProps {
  section: LessonSectionType;
  sectionNumber?: number;
}

// =====================================================
// COMPONENT
// =====================================================

export default function LessonSection({
  section,
  sectionNumber = 1,
}: LessonSectionProps) {
  return (
    <section className="lesson-section">

      {/* =========================================
          HEADING
      ========================================= */}

      <div className="lesson-section-heading">
        <span>
          {String(
            sectionNumber
          ).padStart(2, "0")}
        </span>

        <h2>
          {section.title}
        </h2>
      </div>

      {/* =========================================
          CONTENT
      ========================================= */}

      {section.content && (
        <div className="lesson-section-content">
          <p>
            {section.content}
          </p>
        </div>
      )}

      {/* =========================================
          SYNTAX
      ========================================= */}

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

      {/* =========================================
          EXPLANATION
      ========================================= */}

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

      {/* =========================================
          IMPORTANT POINTS
      ========================================= */}

      {section.importantPoints &&
        section.importantPoints.length > 0 && (
          <div className="lesson-important-points">
            <h3>
              Important Points
            </h3>

            <ul>
              {section.importantPoints.map(
                (point, index) => (
                  <li key={index}>
                    {point}
                  </li>
                )
              )}
            </ul>
          </div>
        )}

      {/* =========================================
          COMMON MISTAKES
      ========================================= */}

      {section.commonMistakes &&
        section.commonMistakes.length > 0 && (
          <div className="lesson-common-mistakes">
            <h3>
              Common Mistakes
            </h3>

            <ul>
              {section.commonMistakes.map(
                (mistake, index) => (
                  <li key={index}>
                    {mistake}
                  </li>
                )
              )}
            </ul>
          </div>
        )}

      {/* =========================================
          BEST PRACTICES
      ========================================= */}

      {section.bestPractices &&
        section.bestPractices.length > 0 && (
          <div className="lesson-best-practices">
            <h3>
              Best Practices
            </h3>

            <ul>
              {section.bestPractices.map(
                (practice, index) => (
                  <li key={index}>
                    {practice}
                  </li>
                )
              )}
            </ul>
          </div>
        )}

      {/* =========================================
          REAL WORLD
      ========================================= */}

      {section.realWorldUses &&
        section.realWorldUses.length > 0 && (
          <div className="lesson-real-world-uses">
            <h3>
              Real-World Uses
            </h3>

            <ul>
              {section.realWorldUses.map(
                (use, index) => (
                  <li key={index}>
                    {use}
                  </li>
                )
              )}
            </ul>
          </div>
        )}

      {/* =========================================
          QUESTIONS
      ========================================= */}

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

      {/* =========================================
          PRACTICE
      ========================================= */}

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
  );
}