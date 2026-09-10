// =====================================================
// DLTJ2.1
// APPLICATION ROOT
// FILE: src/App.tsx
// =====================================================

import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

import "./styles/global.css";
import "./styles/variables.css";
import "./styles/responsive.css";
import "./styles/sidebar.css";
import "./styles/lesson.css";

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}