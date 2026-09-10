// =====================================================
// DLTJ2.1
// PHASE 2 — REACT QUESTIONS
// FILE: src/data/questions/reactQuestions.ts
// =====================================================

import {
  createQuestion,
} from "./index";

export const reactQuestions = [
  createQuestion("react", 1, 1, "What is React?", ["A JavaScript library for building user interfaces", "A database", "A server", "An operating system"], 0),
  createQuestion("react", 1, 2, "Which syntax is commonly used to write React UI?", ["JSX", "XML only", "HTML only", "TSV"], 0),
  createQuestion("react", 1, 3, "Which function creates a React component using hooks?", ["function component", "class only", "module", "service"], 0),
  createQuestion("react", 2, 4, "Which hook stores component state?", ["useState", "useData", "useValue", "useStoreOnly"], 0),
  createQuestion("react", 2, 5, "Which hook handles side effects?", ["useEffect", "useSideEffect", "useAction", "useEvent"], 0),
  createQuestion("react", 3, 6, "What are props?", ["Inputs passed to a component", "Database rows", "CSS rules", "Routes"], 0),
  createQuestion("react", 3, 7, "Can a component directly modify its props?", ["No", "Yes always", "Only with CSS", "Only with HTML"], 0),
  createQuestion("react", 4, 8, "What is used to identify list items?", ["key", "idOnly", "indexKeyOnly", "identifier"], 0),
  createQuestion("react", 4, 9, "Which hook accesses context?", ["useContext", "useProvider", "useValue", "useGlobal"], 0),
  createQuestion("react", 5, 10, "Which hook stores a mutable reference?", ["useRef", "useReference", "usePointer", "useMemory"], 0),
  createQuestion("react", 5, 11, "Which hook memoizes a calculated value?", ["useMemo", "useValue", "useCache", "useCalculate"], 0),
  createQuestion("react", 6, 12, "Which hook memoizes a function?", ["useCallback", "useFunction", "useMemoFunction", "useHandler"], 0),
  createQuestion("react", 6, 13, "What triggers a component re-render?", ["State or props changes", "Only CSS changes", "Only HTML changes", "File name changes"], 0),
  createQuestion("react", 7, 14, "Which package is commonly used for routing?", ["react-router-dom", "react-navigation-dom", "router-react", "route-dom"], 0),
  createQuestion("react", 7, 15, "Which API is commonly used to render a React root?", ["createRoot", "renderRoot", "ReactRoot", "mountRoot"], 0),
  createQuestion("react", 8, 16, "What is a controlled input?", ["An input whose value is controlled by React state", "An input controlled by CSS", "A disabled input", "A read-only input"], 0),
  createQuestion("react", 8, 17, "What does lifting state up mean?", ["Moving shared state to a common parent", "Deleting state", "Moving state to CSS", "Using global variables"], 0),
  createQuestion("react", 9, 18, "What is conditional rendering?", ["Rendering UI based on a condition", "Rendering CSS only", "Rendering every component", "Rendering without JSX"], 0),
  createQuestion("react", 9, 19, "Which syntax is commonly used for conditional rendering?", ["ternary operator", "SQL", "for loop only", "CSS selector"], 0),
  createQuestion("react", 10, 20, "What should a React component return?", ["React elements/UI", "SQL", "CSS file only", "Database connection"], 0),
];