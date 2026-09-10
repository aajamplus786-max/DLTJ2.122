// =====================================================
// DLTJ2.1
// COMMON USER SIDEBAR
// FILE: src/components/common/Sidebar.tsx
// =====================================================

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // =====================================================
  // NAVIGATION ITEMS
  // =====================================================

  const navigationItems = [
    {
      label: "Home",
      icon: "⌂",
      path: "/home",
    },
    {
      label: "Learn",
      icon: "📚",
      path: "/learning",
    },
    {
      label: "Practice",
      icon: "⌨",
      path: "/practice",
    },
    {
      label: "Working Tools",
      icon: "💻",
      path: "/working-tools",
    },
    {
      label: "Tests",
      icon: "✓",
      path: "/test",
    },
    {
      label: "Settings",
      icon: "⚙",
      path: "/settings",
    },
  ];

  // =====================================================
  // ACTIVE PAGE
  // =====================================================

  const isActive = (path: string) => {
    if (path === "/home") {
      return (
        location.pathname === "/" ||
        location.pathname === "/home"
      );
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <aside className="common-sidebar">

      {/* =================================================
          BRAND
      ================================================= */}

      <div className="common-sidebar-brand">

        <button
          type="button"
          className="common-brand-button"
          onClick={() => navigate("/home")}
          aria-label="Go to Home"
        >
          {/* =================================================
              LOGO PLACE
              Replace D with your own logo later
          ================================================= */}

          <span className="common-brand-logo">
            A
          </span>

          <span className="common-brand-text">
            <strong>
              MY DEV LEARN JOURNEY
            </strong>

            <small>
              DLTJ 2.1
            </small>
          </span>

        </button>

      </div>

      {/* =================================================
          NAVIGATION
      ================================================= */}

      <nav
        className="common-sidebar-navigation"
        aria-label="Main navigation"
      >

        {navigationItems.map((item) => {
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              type="button"
              className={`common-sidebar-link ${
                active ? "active" : ""
              }`}
              onClick={() => navigate(item.path)}
              aria-current={
                active ? "page" : undefined
              }
            >

              <span className="common-sidebar-icon">
                {item.icon}
              </span>

              <span className="common-sidebar-label">
                {item.label}
              </span>

              {active && (
                <span className="common-sidebar-active-dot" />
              )}

            </button>
          );
        })}

      </nav>

      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="common-sidebar-footer">

        <div className="common-sidebar-status">
          <span className="common-status-dot" />

          <span>
            Learning Mode
          </span>
        </div>

        <div className="common-sidebar-version">
          DLTJ 2.1
        </div>

      </div>

    </aside>
  );
}