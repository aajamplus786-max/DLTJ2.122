// =====================================================
// DLTJ2.0
// STEP 4
// FILE: src/components/practice/PracticeButton.tsx
// =====================================================

import {
    useNavigate,
  } from "react-router-dom";
  
  interface PracticeButtonProps {
    technologyId: string;
    chapterId: string;
  }
  
  export default function PracticeButton({
    technologyId,
    chapterId,
  }: PracticeButtonProps) {
    const navigate =
      useNavigate();
  
    return (
      <button
        className="practice-button"
        onClick={() =>
          navigate(
            `/practice/${technologyId}/${chapterId}`
          )
        }
      >
        💻 Practice
      </button>
    );
  }