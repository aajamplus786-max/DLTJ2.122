
// =====================================================
// DLTJ2.122
// DYNAMIC LEARNING SYSTEM
// FILE: src/routes/AppRoutes.tsx
// DATE: 2026-09-08
// LOCATION: src/routes/AppRoutes.tsx
// =====================================================

import {
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import type {
  ReactNode,
} from "react";

// =====================================================
// COMMON
// =====================================================

import Sidebar from "../components/common/Sidebar";

// =====================================================
// MAIN
// =====================================================

import Home from "../pages/Home/Home";

// =====================================================
// SETTINGS
// =====================================================

import Settings from "../setting/Settings1";

// =====================================================
// USER AUTH
// =====================================================

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import VerifyOTP from "../pages/Auth/VerifyOTP";

// =====================================================
// ADMIN AUTH
// =====================================================

import AdminLogin from "../pages/Admin/AdminLogin";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminGuard from "../components/auth/AdminGuard";

// =====================================================
// ADMIN MANAGEMENT
// =====================================================

import TechnologyManagement from "../pages/Admin/TechnologyManagement";
import ContentImport from "../pages/Admin/ContentImport";
import ChapterManagement from "../pages/Admin/ChapterManagement";
import LessonManagement from "../pages/Admin/LessonManagement";
import QuestionManagement from "../pages/Admin/QuestionManagement";
import TestManagement from "../pages/Admin/TestManagement";

// =====================================================
// LEARNING
// =====================================================

import LearningHome from "../pages/Learning/LearningHome";
import Technology from "../pages/Learning/Technology";
import Chapter from "../pages/Learning/Chapter";
import LessonPage from "../pages/Learning/LessonPage";
import MySQLCompletion from "../pages/Learning/MySQLCompletion";

// =====================================================
// PRACTICE
// =====================================================

import PracticeHome from "../pages/Practice/PracticeHome";
import PracticeTool from "../pages/Practice/PracticeTool";

// =====================================================
// TEST
// =====================================================

import TestHome from "../pages/Test/TestHome";
import ChapterTest from "../pages/Test/ChapterTest";
import FinalTest from "../pages/Test/FinalTest";
import TestResult from "../pages/Test/TestResult";

// =====================================================
// WORKING TOOLS
// =====================================================

import WorkingToolsHome from "../pages/WorkingTools/WorkingToolsHome";

// =====================================================
// MAIN LAYOUT
// =====================================================

function MainLayout() {

  return (

    <div className="dltj-main-layout">

      <Sidebar />

      <main className="dltj-main-content">

        <Outlet />

      </main>

    </div>

  );

}

// =====================================================
// PROTECTED ADMIN PAGE
// =====================================================

function ProtectedAdminPage({
  children,
}: {
  children: ReactNode;
}) {

  return (

    <AdminGuard>

      {children}

    </AdminGuard>

  );

}

// =====================================================
// APP ROUTES
// =====================================================

export default function AppRoutes() {

  return (

    <Routes>

      {/* =================================================
          DLTJ2.122 FIRST PAGE

          IMPORTANT:
          public/firstpage.html is a STATIC HTML file.

          Browser must load it directly instead of treating
          it as a React route.
      ================================================= */}

      <Route
        path="/"
        element={
          <Navigate
            to="/firstpage.html"
            replace
          />
        }
      />

      {/* =================================================
          USER AUTH
      ================================================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/verify-otp"
        element={<VerifyOTP />}
      />

      {/* =================================================
          ADMIN LOGIN
      ================================================= */}

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      {/* =================================================
          ADMIN HOME
      ================================================= */}

      <Route
        path="/admin"
        element={<AdminDashboard />}
      />

      {/* =================================================
          ADMIN MANAGEMENT
      ================================================= */}

      <Route
        path="/admin/technologies"
        element={
          <ProtectedAdminPage>

            <TechnologyManagement />

          </ProtectedAdminPage>
        }
      />

      <Route
        path="/admin/content-import"
        element={
          <ProtectedAdminPage>

            <ContentImport />

          </ProtectedAdminPage>
        }
      />

      <Route
        path="/admin/chapters"
        element={
          <ProtectedAdminPage>

            <ChapterManagement />

          </ProtectedAdminPage>
        }
      />

      <Route
        path="/admin/lessons"
        element={
          <ProtectedAdminPage>

            <LessonManagement />

          </ProtectedAdminPage>
        }
      />

      <Route
        path="/admin/questions"
        element={
          <ProtectedAdminPage>

            <QuestionManagement />

          </ProtectedAdminPage>
        }
      />

      <Route
        path="/admin/tests"
        element={
          <ProtectedAdminPage>

            <TestManagement />

          </ProtectedAdminPage>
        }
      />

      {/* =================================================
          MAIN APPLICATION
      ================================================= */}

      <Route element={<MainLayout />}>

        {/* =================================================
            HOME
        ================================================= */}

        <Route
          path="/home"
          element={<Home />}
        />

        {/* =================================================
            LEARNING HOME
        ================================================= */}

        <Route
          path="/learning"
          element={<LearningHome />}
        />

        {/* =================================================
            TECHNOLOGY
        ================================================= */}

        <Route
          path="/learning/:technologyId"
          element={<Technology />}
        />

        {/* =================================================
            CHAPTER
            NEW DYNAMIC ROUTE
        ================================================= */}

        <Route
          path="/learning/:technologyId/chapter/:chapterId"
          element={<Chapter />}
        />

        {/* =================================================
            LESSON
            NEW DYNAMIC ROUTE
        ================================================= */}

        <Route
          path="/learning/:technologyId/chapter/:chapterId/lesson/:lessonId"
          element={<LessonPage />}
        />

        {/* =================================================
            OLD LEARNING ROUTES
            KEPT FOR COMPATIBILITY
        ================================================= */}

        <Route
          path="/learning/:technologyId/:chapterId"
          element={<Chapter />}
        />

        <Route
          path="/learning/:technologyId/:chapterId/:lessonId"
          element={<LessonPage />}
        />

        {/* =================================================
            MYSQL COMPLETION
        ================================================= */}

        <Route
          path="/learning/mysql/completion"
          element={<MySQLCompletion />}
        />

        {/* =================================================
            PRACTICE HOME
        ================================================= */}

        <Route
          path="/practice"
          element={<PracticeHome />}
        />

        {/* =================================================
            PRACTICE TOOL
        ================================================= */}

        <Route
          path="/practice/:technologyId/:chapterId"
          element={<PracticeTool />}
        />

        {/* =================================================
            TEST HOME
        ================================================= */}

        <Route
          path="/test"
          element={<TestHome />}
        />

        {/* =================================================
            CHAPTER TEST
            PRIMARY DYNAMIC ROUTE
        ================================================= */}

        <Route
          path="/test/chapter/:technologyId/:chapterId"
          element={<ChapterTest />}
        />

        {/* =================================================
            CHAPTER TEST
            COMPATIBILITY ROUTE
        ================================================= */}

        <Route
          path="/test/chapter/:technologyId/:chapterId/:testNumber"
          element={<ChapterTest />}
        />

        {/* =================================================
            OLD CHAPTER TEST ROUTE
        ================================================= */}

        <Route
          path="/test/chapter/:technologyId/:testNumber"
          element={<ChapterTest />}
        />

        {/* =================================================
            FINAL TEST
            DYNAMIC TEST ID VERSION
        ================================================= */}

        <Route
          path="/test/final/:technologyId/:testId"
          element={<FinalTest />}
        />

        {/* =================================================
            FINAL TEST
            COMPATIBILITY VERSION
        ================================================= */}

        <Route
          path="/test/final/:technologyId"
          element={<FinalTest />}
        />

        {/* =================================================
            TEST RESULT
        ================================================= */}

        <Route
          path="/test/result"
          element={<TestResult />}
        />

        {/* =================================================
            WORKING TOOLS
        ================================================= */}

        <Route
          path="/working-tools"
          element={<WorkingToolsHome />}
        />

        <Route
          path="/working-tools/:technologyId"
          element={<WorkingToolsHome />}
        />

        {/* =================================================
            SETTINGS
        ================================================= */}

        <Route
          path="/settings"
          element={<Settings />}
        />

      </Route>

      {/* =================================================
          FALLBACK

          Unknown React route -> Home

          IMPORTANT:
          /firstpage.html is a static public file and should
          be loaded directly by the browser.
      ================================================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/home"
            replace
          />
        }
      />

    </Routes>

  );

}

