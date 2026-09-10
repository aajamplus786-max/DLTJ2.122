// =====================================================
// DLTJ2.10
// HOME PAGE
// FILE: src/pages/Home/Home.tsx
// DATE: 2026-09-03
// =====================================================

import { useNavigate } from "react-router-dom";

import logo from "../../images/logo.png";

import "./Home.css";


// =====================================================
// COMPONENT
// =====================================================

export default function Home() {

  const navigate = useNavigate();

  return (
    <main className="home-page">


      {/* =================================================
          BACKGROUND EFFECTS
      ================================================= */}

      <div
        className="home-glow home-glow-yellow"
        aria-hidden="true"
      />

      <div
        className="home-glow home-glow-rose"
        aria-hidden="true"
      />


      {/* =================================================
          HERO
      ================================================= */}

      <section className="home-hero">

        <div className="home-hero-content">

          <div className="home-logo-area">

            <img
              src={logo}
              alt="My Dev Learn Journey"
              className="home-logo-image"
            />

          </div>


          <div className="home-content-area">

            <span className="home-eyebrow">
              LEARN. PRACTICE. BUILD.
            </span>

            <div className="home-app-title">
              My Dev Learn Journey
            </div>

            <p>
              Your developer learning journey,
              all in one place.
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          MAIN ACTIONS
      ================================================= */}

      <section className="home-actions">


        {/* =================================================
            LEARN
        ================================================= */}

        <button
          type="button"
          className="home-action learn-action"
          onClick={() => navigate("/learning")}
        >

          <div className="home-action-top">

            <span className="home-action-icon">
              📚
            </span>

            <strong>
              LEARN
            </strong>

          </div>


          <small>
            Learn programming technologies
          </small>


          <span className="home-moving-line">

            <span className="home-moving-track">

              <span>💻 C</span>
              <span>⚙️ C++</span>
              <span>🌐 HTML</span>
              <span>🎨 CSS</span>
              <span>☕ Java</span>
              <span>🐍 Python</span>
              <span>⚡ JavaScript</span>
              <span>⚛️ React</span>
              <span>🔷 TypeScript</span>
              <span>🌱 Spring</span>
              <span>🗄️ MySQL</span>

              <span>💻 C</span>
              <span>⚙️ C++</span>
              <span>🌐 HTML</span>
              <span>🎨 CSS</span>
              <span>☕ Java</span>
              <span>🐍 Python</span>
              <span>⚡ JavaScript</span>
              <span>⚛️ React</span>
              <span>🔷 TypeScript</span>
              <span>🌱 Spring</span>
              <span>🗄️ MySQL</span>

            </span>

          </span>


          <span className="home-action-arrow">
            →
          </span>

        </button>


        {/* =================================================
            PRACTICE
        ================================================= */}

        <button
          type="button"
          className="home-action practice-action"
          onClick={() => navigate("/practice")}
        >

          <div className="home-action-top">

            <span className="home-action-icon">
              ⌨️
            </span>

            <strong>
              PRACTICE
            </strong>

          </div>


          <small>
            Practice and improve your coding
          </small>


          <span className="home-moving-line">

            <span className="home-moving-track">

              <span>❓ Questions</span>
              <span>☑️ MCQ</span>
              <span>📝 Fill in the Blanks</span>
              <span>💻 Coding</span>
              <span>🔥 Challenges</span>
              <span>📋 Tests</span>
              <span>🎯 Assessments</span>
              <span>🏆 Exams</span>

              <span>❓ Questions</span>
              <span>☑️ MCQ</span>
              <span>📝 Fill in the Blanks</span>
              <span>💻 Coding</span>
              <span>🔥 Challenges</span>
              <span>📋 Tests</span>
              <span>🎯 Assessments</span>
              <span>🏆 Exams</span>

            </span>

          </span>


          <span className="home-action-arrow">
            →
          </span>

        </button>


        {/* =================================================
            WORKING TOOLS
        ================================================= */}

        <button
          type="button"
          className="home-action tools-action"
          onClick={() => navigate("/working-tools")}
        >

          <div className="home-action-top">

            <span className="home-action-icon">
              💻
            </span>

            <strong>
              WORKING TOOLS
            </strong>

          </div>


          <small>
            Build and test your projects
          </small>


          <span className="home-moving-line">

            <span className="home-moving-track">

              <span>🌐 HTML</span>
              <span>🎨 CSS</span>
              <span>⚡ JavaScript</span>
              <span>🐍 Python</span>
              <span>💻 C</span>
              <span>⚙️ C++</span>
              <span>☕ Java</span>
              <span>⚛️ React</span>
              <span>🔷 TypeScript</span>
              <span>🌱 Spring</span>
              <span>🗄️ MySQL</span>
              <span>🧩 Node.js</span>
              <span>🚀 Vite</span>

              <span>🌐 HTML</span>
              <span>🎨 CSS</span>
              <span>⚡ JavaScript</span>
              <span>🐍 Python</span>
              <span>💻 C</span>
              <span>⚙️ C++</span>
              <span>☕ Java</span>
              <span>⚛️ React</span>
              <span>🔷 TypeScript</span>
              <span>🌱 Spring</span>
              <span>🗄️ MySQL</span>
              <span>🧩 Node.js</span>
              <span>🚀 Vite</span>

            </span>

          </span>


          <span className="home-action-arrow">
            →
          </span>

        </button>


      </section>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="home-footer">
        MY DEV LEARN JOURNEY • DLTJ 2.10
      </footer>


    </main>
  );
}