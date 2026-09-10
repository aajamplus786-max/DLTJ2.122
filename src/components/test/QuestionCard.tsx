// =====================================================
// DLTJ2.1
// TEST QUESTION CARD
// FILE: src/components/test/QuestionCard.tsx
// =====================================================

import type {
  TestQuestion,
} from "../../types/Test";

// =====================================================
// PROPS
// =====================================================

interface QuestionCardProps {
  question: TestQuestion;
  questionNumber: number;
  selectedAnswer?: string;
  onAnswer: (
    answer: string,
  ) => void;
  disabled?: boolean;
}

// =====================================================
// COMPONENT
// =====================================================

export default function QuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  onAnswer,
  disabled = false,
}: QuestionCardProps) {
  return (
    <section className="question-card">

      <div className="question-card-header">

        <span className="question-number">
          Question{" "}
          {questionNumber}
        </span>

        <span className="question-marks">
          {question.marks}{" "}
          Marks
        </span>

      </div>

      <h2 className="question-title">
        {question.question}
      </h2>

      <div className="question-options">

        {question.options.map(
          (option, index) => {

            const selected =
              selectedAnswer ===
              option.id;

            return (
              <button
                key={option.id}
                type="button"
                disabled={
                  disabled
                }
                className={
                  selected
                    ? "question-option selected"
                    : "question-option"
                }
                onClick={() =>
                  onAnswer(
                    option.id,
                  )
                }
              >

                <span className="option-number">
                  {String.fromCharCode(
                    65 + index,
                  )}
                </span>

                <span className="option-text">
                  {option.text}
                </span>

                {selected && (
                  <span className="option-check">
                    ✓
                  </span>
                )}

              </button>
            );
          },
        )}

      </div>

    </section>
  );
}