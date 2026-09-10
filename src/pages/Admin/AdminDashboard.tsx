
// =====================================================
// DLTJ2.10
// ADMIN DASHBOARD — SIDE NAVIGATION
// FILE: src/pages/Admin/AdminDashboard.tsx
// UPDATED: 2026-09-07
// LOCATION: F:\dltj2.122\src\pages\Admin\AdminDashboard.tsx
// =====================================================

import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  getUsers,
} from "../../services/storageService";

import type {
  User,
} from "../../types/User";

import {
  ADMIN_SESSION_KEY,
} from "../../components/auth/AdminGuard";

// =====================================================
// TYPES
// =====================================================

type AdminMenuItem = {
  id: string;
  icon: string;
  title: string;
  description: string;
  path?: string;
};

// =====================================================
// MENU
// =====================================================

const adminMenu: AdminMenuItem[] = [
  {
    id: "dashboard",
    icon: "▦",
    title: "Dashboard",
    description: "Overview",
  },

  {
    id: "technologies",
    icon: "⌘",
    title: "Technologies",
    description: "Languages & technologies",
    path: "/admin/technologies",
  },

  {
    id: "learning",
    icon: "▤",
    title: "Learning",
    description: "Chapters & lessons",
    path: "/admin/chapters",
  },

  {
    id: "practice",
    icon: "✎",
    title: "Practice",
    description: "Practice questions",
    path: "/admin/questions",
  },

  {
    id: "tests",
    icon: "✓",
    title: "Tests",
    description: "Tests & assessments",
    path: "/admin/tests",
  },

  {
    id: "users",
    icon: "♙",
    title: "Users",
    description: "Registered users",
  },

  {
    id: "settings",
    icon: "⚙",
    title: "Settings",
    description: "Application settings",
    path: "/settings",
  },
];

// =====================================================
// COMPONENT
// =====================================================

export default function AdminDashboard() {
  const navigate = useNavigate();

  const location = useLocation();

  // ===================================================
  // STATE
  // ===================================================

  const [
    users,
    setUsers,
  ] = useState<User[]>([]);

  const [
    currentTime,
    setCurrentTime,
  ] = useState(
    new Date(),
  );

  const [
    activeMenu,
    setActiveMenu,
  ] = useState(
    "dashboard",
  );

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  // ===================================================
  // LOAD USERS
  // ===================================================

  useEffect(() => {
    try {
      setUsers(
        getUsers(),
      );
    } catch (error) {
      console.error(
        "[ADMIN DASHBOARD] Failed to load users:",
        error,
      );

      setUsers([]);
    }
  }, []);

  // ===================================================
  // CURRENT TIME
  // ===================================================

  useEffect(() => {
    const timer =
      window.setInterval(() => {
        setCurrentTime(
          new Date(),
        );
      }, 1000);

    return () => {
      window.clearInterval(
        timer,
      );
    };
  }, []);

  // ===================================================
  // ACTIVE MENU FROM URL
  // ===================================================

  useEffect(() => {
    const path =
      location.pathname;

    if (
      path === "/admin"
    ) {
      setActiveMenu(
        "dashboard",
      );
      return;
    }

    if (
      path.startsWith(
        "/admin/technologies",
      )
    ) {
      setActiveMenu(
        "technologies",
      );
      return;
    }

    if (
      path.startsWith(
        "/admin/chapters",
      ) ||
      path.startsWith(
        "/admin/lessons",
      )
    ) {
      setActiveMenu(
        "learning",
      );
      return;
    }

    if (
      path.startsWith(
        "/admin/questions",
      )
    ) {
      setActiveMenu(
        "practice",
      );
      return;
    }

    if (
      path.startsWith(
        "/admin/tests",
      )
    ) {
      setActiveMenu(
        "tests",
      );
      return;
    }

    if (
      path.startsWith(
        "/settings",
      )
    ) {
      setActiveMenu(
        "settings",
      );
    }
  }, [
    location.pathname,
  ]);

  // ===================================================
  // LOGOUT
  // ===================================================

  function handleLogout() {
    localStorage.removeItem(
      ADMIN_SESSION_KEY,
    );

    sessionStorage.removeItem(
      ADMIN_SESSION_KEY,
    );

    navigate(
      "/admin/login",
      {
        replace: true,
      },
    );
  }

  // ===================================================
  // MENU CLICK
  // ===================================================

  function handleMenuClick(
    item: AdminMenuItem,
  ) {
    setActiveMenu(
      item.id,
    );

    setSidebarOpen(
      false,
    );

    // Dashboard
    if (
      item.id ===
      "dashboard"
    ) {
      if (
        location.pathname !==
        "/admin"
      ) {
        navigate(
          "/admin",
        );
      }

      return;
    }

    // Users
    if (
      item.id ===
      "users"
    ) {
      if (
        location.pathname !==
        "/admin"
      ) {
        navigate(
          "/admin",
        );
      }

      return;
    }

    // Real routes
    if (
      item.path
    ) {
      navigate(
        item.path,
      );
    }
  }

  // ===================================================
  // USER STATISTICS
  // ===================================================

  const totalUsers =
    users.length;

  const verifiedUsers =
    users.filter(
      (user) =>
        user.mobileVerified,
    ).length;

  const lockedUsers =
    users.filter(
      (user) =>
        user.lockedUntil !==
          null &&
        user.lockedUntil >
          Date.now(),
    ).length;

  const activeUsers =
    users.filter(
      (user) =>
        user.mobileVerified &&
        !(
          user.lockedUntil !==
            null &&
          user.lockedUntil >
            Date.now()
        ),
    ).length;

  // ===================================================
  // DATE
  // ===================================================

  function formatDate(
    value: string,
  ) {
    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return "-";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day:
          "2-digit",

        month:
          "short",

        year:
          "numeric",
      },
    );
  }

  // ===================================================
  // TIME
  // ===================================================

  function formatTime() {
    return currentTime.toLocaleTimeString(
      "en-IN",
      {
        hour:
          "2-digit",

        minute:
          "2-digit",

        second:
          "2-digit",
      },
    );
  }

  // ===================================================
  // USER STATUS
  // ===================================================

  function getUserStatus(
    user: User,
  ) {
    if (
      user.lockedUntil !==
        null &&
      user.lockedUntil >
        Date.now()
    ) {
      return "Locked";
    }

    if (
      user.mobileVerified
    ) {
      return "Verified";
    }

    return "Pending";
  }

  // ===================================================
  // STATUS STYLE
  // ===================================================

  function getStatusStyle(
    status: string,
  ) {
    if (
      status ===
      "Locked"
    ) {
      return {
        background:
          "#fff0f0",
        color:
          "#c62828",
      };
    }

    if (
      status ===
      "Verified"
    ) {
      return {
        background:
          "#eefbf3",
        color:
          "#16824b",
      };
    }

    return {
      background:
        "#fff8e6",
      color:
        "#a56a00",
    };
  }

  // ===================================================
  // ACTIVE ITEM
  // ===================================================

  const activeMenuItem =
    adminMenu.find(
      (item) =>
        item.id ===
        activeMenu,
    ) ??
    adminMenu[0];

  // ===================================================
  // DASHBOARD CONTENT
  // ===================================================

  function renderDashboard() {
    return (
      <>
        {/* ==========================================
            WELCOME
        ========================================== */}

        <section
          style={{
            marginBottom:
              "22px",

            padding:
              "24px",

            borderRadius:
              "18px",

            background:
              "linear-gradient(135deg, #ffffff, #fffaf0)",

            border:
              "1px solid rgba(0,0,0,0.06)",

            boxShadow:
              "0 15px 40px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              fontSize:
                "10px",

              fontWeight:
                800,

              letterSpacing:
                "0.16em",

              color:
                "#8a8d99",

              marginBottom:
                "7px",
            }}
          >
            RESTRICTED AREA
          </div>

          <h2
            style={{
              margin:
                "0 0 7px",

              fontSize:
                "25px",
            }}
          >
            Welcome, Administrator
          </h2>

          <p
            style={{
              margin:
                0,

              color:
                "#707480",

              fontSize:
                "13px",

              lineHeight:
                1.7,
            }}
          >
            Manage DLTJ technologies,
            learning content,
            practice, tests and users
            from this control panel.
          </p>
        </section>

        {/* ==========================================
            STATISTICS
        ========================================== */}

        <section
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "repeat(4, minmax(0, 1fr))",

            gap:
              "16px",

            marginBottom:
              "24px",
          }}
        >
          {[
            {
              title:
                "Total Users",

              value:
                totalUsers,
            },

            {
              title:
                "Verified Users",

              value:
                verifiedUsers,
            },

            {
              title:
                "Active Users",

              value:
                activeUsers,
            },

            {
              title:
                "Locked Users",

              value:
                lockedUsers,
            },
          ].map(
            (stat) => (
              <div
                key={
                  stat.title
                }
                style={{
                  padding:
                    "20px",

                  borderRadius:
                    "16px",

                  background:
                    "#ffffff",

                  border:
                    "1px solid rgba(0,0,0,0.06)",

                  boxShadow:
                    "0 12px 30px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    fontSize:
                      "12px",

                    color:
                      "#858895",

                    marginBottom:
                      "8px",
                  }}
                >
                  {
                    stat.title
                  }
                </div>

                <strong
                  style={{
                    fontSize:
                      "30px",
                  }}
                >
                  {
                    stat.value
                  }
                </strong>
              </div>
            ),
          )}
        </section>

        {/* ==========================================
            ADMIN MODULES
        ========================================== */}

        <section
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "repeat(3, minmax(0, 1fr))",

            gap:
              "16px",

            marginBottom:
              "24px",
          }}
        >
          {adminMenu
            .filter(
              (item) =>
                item.id !==
                  "dashboard" &&
                item.id !==
                  "users",
            )
            .map(
              (item) => (
                <button
                  key={
                    item.id
                  }
                  type="button"
                  onClick={() =>
                    handleMenuClick(
                      item,
                    )
                  }
                  style={{
                    textAlign:
                      "left",

                    padding:
                      "20px",

                    border:
                      "1px solid #e8e9ee",

                    borderRadius:
                      "16px",

                    background:
                      "#ffffff",

                    cursor:
                      "pointer",

                    boxShadow:
                      "0 10px 28px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{
                      display:
                        "flex",

                      alignItems:
                        "center",

                      gap:
                        "12px",

                      marginBottom:
                        "10px",
                    }}
                  >
                    <span
                      style={{
                        width:
                          "40px",

                        height:
                          "40px",

                        display:
                          "flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "center",

                        borderRadius:
                          "12px",

                        background:
                          "linear-gradient(135deg, #ffd95a, #f49ac2)",

                        fontSize:
                          "18px",

                        fontWeight:
                          900,
                      }}
                    >
                      {
                        item.icon
                      }
                    </span>

                    <strong
                      style={{
                        fontSize:
                          "15px",

                        color:
                          "#20222b",
                      }}
                    >
                      {
                        item.title
                      }
                    </strong>
                  </div>

                  <span
                    style={{
                      fontSize:
                        "12px",

                      color:
                        "#858895",
                    }}
                  >
                    {
                      item.description
                    }
                  </span>
                </button>
              ),
            )}
        </section>

        {/* ==========================================
            REGISTERED USERS
        ========================================== */}

        <section
          style={{
            padding:
              "22px",

            borderRadius:
              "18px",

            background:
              "rgba(255,255,255,0.95)",

            border:
              "1px solid rgba(0,0,0,0.06)",

            boxShadow:
              "0 15px 45px rgba(0,0,0,0.06)",

            overflowX:
              "auto",
          }}
        >
          <div
            style={{
              marginBottom:
                "18px",
            }}
          >
            <h2
              style={{
                margin:
                  "0 0 5px",

                fontSize:
                  "19px",
              }}
            >
              Registered Users
            </h2>

            <p
              style={{
                margin:
                  0,

                fontSize:
                  "12px",

                color:
                  "#858895",
              }}
            >
              Basic account information
              available to the administrator.
            </p>
          </div>

          {users.length ===
          0 ? (
            <div
              style={{
                padding:
                  "45px 20px",

                textAlign:
                  "center",

                borderRadius:
                  "12px",

                background:
                  "#f7f8fc",

                color:
                  "#858895",

                fontSize:
                  "13px",
              }}
            >
              No registered users
              found.
            </div>
          ) : (
            <table
              style={{
                width:
                  "100%",

                minWidth:
                  "720px",

                borderCollapse:
                  "collapse",

                fontSize:
                  "13px",
              }}
            >
              <thead>
                <tr
                  style={{
                    textAlign:
                      "left",

                    background:
                      "#f7f8fc",
                  }}
                >
                  {[
                    "Name",
                    "Mobile",
                    "Registered",
                    "Attempts",
                    "Status",
                  ].map(
                    (
                      heading,
                    ) => (
                      <th
                        key={
                          heading
                        }
                        style={{
                          padding:
                            "13px",

                          borderBottom:
                            "1px solid #e8e9ee",
                        }}
                      >
                        {
                          heading
                        }
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody>
                {users.map(
                  (user) => {
                    const status =
                      getUserStatus(
                        user,
                      );

                    const statusStyle =
                      getStatusStyle(
                        status,
                      );

                    return (
                      <tr
                        key={
                          user.id
                        }
                      >
                        <td
                          style={{
                            padding:
                              "14px 13px",

                            borderBottom:
                              "1px solid #eeeeF2",

                            fontWeight:
                              700,
                          }}
                        >
                          {
                            user.name
                          }
                        </td>

                        <td
                          style={{
                            padding:
                              "14px 13px",

                            borderBottom:
                              "1px solid #eeeeF2",

                            color:
                              "#626673",
                          }}
                        >
                          {
                            user.mobile
                          }
                        </td>

                        <td
                          style={{
                            padding:
                              "14px 13px",

                            borderBottom:
                              "1px solid #eeeeF2",

                            color:
                              "#626673",
                          }}
                        >
                          {formatDate(
                            user.createdAt,
                          )}
                        </td>

                        <td
                          style={{
                            padding:
                              "14px 13px",

                            borderBottom:
                              "1px solid #eeeeF2",

                            color:
                              "#626673",
                          }}
                        >
                          {
                            user.failedLoginAttempts
                          }
                        </td>

                        <td
                          style={{
                            padding:
                              "14px 13px",

                            borderBottom:
                              "1px solid #eeeeF2",
                          }}
                        >
                          <span
                            style={{
                              display:
                                "inline-block",

                              padding:
                                "5px 9px",

                              borderRadius:
                                "999px",

                              background:
                                statusStyle.background,

                              color:
                                statusStyle.color,

                              fontSize:
                                "11px",

                              fontWeight:
                                800,
                            }}
                          >
                            {
                              status
                            }
                          </span>
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          )}
        </section>
      </>
    );
  }

  // ===================================================
  // USERS CONTENT
  // ===================================================

  function renderUsers() {
    return (
      <section
        style={{
          padding:
            "22px",

          borderRadius:
            "18px",

          background:
            "#ffffff",

          border:
            "1px solid rgba(0,0,0,0.06)",

          boxShadow:
            "0 15px 45px rgba(0,0,0,0.06)",

          overflowX:
            "auto",
        }}
      >
        <h2
          style={{
            margin:
              "0 0 6px",
          }}
        >
          Registered Users
        </h2>

        <p
          style={{
            margin:
              "0 0 20px",

            color:
              "#707480",

            fontSize:
              "13px",
          }}
        >
          Manage and review registered
          user accounts.
        </p>

        {users.length ===
        0 ? (
          <div
            style={{
              padding:
                "40px",

              textAlign:
                "center",

              background:
                "#f7f8fc",

              borderRadius:
                "12px",

              color:
                "#858895",
            }}
          >
            No registered users found.
          </div>
        ) : (
          <table
            style={{
              width:
                "100%",

              minWidth:
                "720px",

              borderCollapse:
                "collapse",

              fontSize:
                "13px",
            }}
          >
            <thead>
              <tr
                style={{
                  textAlign:
                    "left",

                  background:
                    "#f7f8fc",
                }}
              >
                {[
                  "Name",
                  "Mobile",
                  "Registered",
                  "Attempts",
                  "Status",
                ].map(
                  (
                    heading,
                  ) => (
                    <th
                      key={
                        heading
                      }
                      style={{
                        padding:
                          "13px",

                        borderBottom:
                          "1px solid #e8e9ee",
                      }}
                    >
                      {
                        heading
                      }
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody>
              {users.map(
                (user) => {
                  const status =
                    getUserStatus(
                      user,
                    );

                  const statusStyle =
                    getStatusStyle(
                      status,
                    );

                  return (
                    <tr
                      key={
                        user.id
                      }
                    >
                      <td
                        style={{
                          padding:
                            "14px 13px",

                          borderBottom:
                            "1px solid #eeeeF2",

                          fontWeight:
                            700,
                        }}
                      >
                        {
                          user.name
                        }
                      </td>

                      <td
                        style={{
                          padding:
                            "14px 13px",

                          borderBottom:
                            "1px solid #eeeeF2",

                          color:
                            "#626673",
                        }}
                      >
                        {
                          user.mobile
                        }
                      </td>

                      <td
                        style={{
                          padding:
                            "14px 13px",

                          borderBottom:
                            "1px solid #eeeeF2",

                          color:
                            "#626673",
                        }}
                      >
                        {formatDate(
                          user.createdAt,
                        )}
                      </td>

                      <td
                        style={{
                          padding:
                            "14px 13px",

                          borderBottom:
                            "1px solid #eeeeF2",

                          color:
                            "#626673",
                        }}
                      >
                        {
                          user.failedLoginAttempts
                        }
                      </td>

                      <td
                        style={{
                          padding:
                            "14px 13px",

                          borderBottom:
                            "1px solid #eeeeF2",
                        }}
                      >
                        <span
                          style={{
                            display:
                              "inline-block",

                            padding:
                              "5px 9px",

                            borderRadius:
                              "999px",

                            background:
                              statusStyle.background,

                            color:
                              statusStyle.color,

                            fontSize:
                              "11px",

                            fontWeight:
                              800,
                          }}
                        >
                          {
                            status
                          }
                        </span>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        )}
      </section>
    );
  }

  // ===================================================
  // SECTION CONTENT
  // ===================================================

  function renderSectionContent() {
    if (
      activeMenu ===
      "users"
    ) {
      return renderUsers();
    }

    return renderDashboard();
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <main
      style={{
        width:
          "100%",

        minHeight:
          "100vh",

        boxSizing:
          "border-box",

        background:
          "radial-gradient(circle at 10% 10%, rgba(255, 210, 70, 0.16), transparent 28%), radial-gradient(circle at 90% 10%, rgba(244, 114, 182, 0.16), transparent 28%), #f7f8fc",

        color:
          "#20222b",
      }}
    >
      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <div
          onClick={() =>
            setSidebarOpen(
              false,
            )
          }
          style={{
            position:
              "fixed",

            inset:
              0,

            background:
              "rgba(0,0,0,0.35)",

            zIndex:
              90,
          }}
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        style={{
          position:
            "fixed",

          top:
            0,

          left:
            0,

          bottom:
            0,

          width:
            "250px",

          zIndex:
            100,

          boxSizing:
            "border-box",

          padding:
            "20px 14px",

          background:
            "rgba(255,255,255,0.98)",

          borderRight:
            "1px solid #e7e8ed",

          boxShadow:
            "8px 0 30px rgba(0,0,0,0.04)",

          transform:
            sidebarOpen
              ? "translateX(0)"
              : undefined,

          overflowY:
            "auto",
        }}
      >
        {/* ==============================================
            BRAND
        ============================================== */}

        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              "12px",

            padding:
              "4px 8px 22px",

            borderBottom:
              "1px solid #eeeeF2",

            marginBottom:
              "18px",
          }}
        >
          <div
            style={{
              width:
                "44px",

              height:
                "44px",

              flexShrink:
                0,

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              borderRadius:
                "13px",

              background:
                "linear-gradient(135deg, #ffd95a, #f49ac2)",

              fontSize:
                "20px",

              fontWeight:
                900,
            }}
          >
            D
          </div>

          <div>
            <div
              style={{
                fontSize:
                  "10px",

                fontWeight:
                  800,

                letterSpacing:
                  "0.14em",

                color:
                  "#858895",
              }}
            >
              DLTJ 2.10
            </div>

            <strong
              style={{
                display:
                  "block",

                marginTop:
                  "3px",

                fontSize:
                  "16px",
              }}
            >
              Admin Panel
            </strong>
          </div>
        </div>

        {/* ==============================================
            NAVIGATION
        ============================================== */}

        <div
          style={{
            fontSize:
              "10px",

            fontWeight:
              800,

            letterSpacing:
              "0.13em",

            color:
              "#9a9da8",

            padding:
              "0 10px 9px",
          }}
        >
          MANAGEMENT
        </div>

        <nav>
          {adminMenu.map(
            (item) => {
              const active =
                activeMenu ===
                item.id;

              return (
                <button
                  key={
                    item.id
                  }
                  type="button"
                  onClick={() =>
                    handleMenuClick(
                      item,
                    )
                  }
                  style={{
                    width:
                      "100%",

                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap:
                      "11px",

                    marginBottom:
                      "5px",

                    padding:
                      "11px 10px",

                    border:
                      "none",

                    borderRadius:
                      "12px",

                    background:
                      active
                        ? "linear-gradient(135deg, rgba(255,217,90,0.32), rgba(244,154,194,0.22))"
                        : "transparent",

                    color:
                      active
                        ? "#20222b"
                        : "#656873",

                    textAlign:
                      "left",

                    cursor:
                      "pointer",
                  }}
                >
                  <span
                    style={{
                      width:
                        "34px",

                      height:
                        "34px",

                      flexShrink:
                        0,

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      borderRadius:
                        "10px",

                      background:
                        active
                          ? "#ffffff"
                          : "#f5f6f9",

                      fontSize:
                        "16px",

                      fontWeight:
                        800,
                    }}
                  >
                    {
                      item.icon
                    }
                  </span>

                  <span
                    style={{
                      minWidth:
                        0,
                    }}
                  >
                    <strong
                      style={{
                        display:
                          "block",

                        fontSize:
                          "13px",
                      }}
                    >
                      {
                        item.title
                      }
                    </strong>

                    <small
                      style={{
                        display:
                          "block",

                        marginTop:
                          "2px",

                        fontSize:
                          "10px",

                        color:
                          "#999ca6",
                      }}
                    >
                      {
                        item.description
                      }
                    </small>
                  </span>
                </button>
              );
            },
          )}
        </nav>

        {/* ==============================================
            SIDEBAR FOOTER
        ============================================== */}

        <div
          style={{
            marginTop:
              "22px",

            paddingTop:
              "16px",

            borderTop:
              "1px solid #eeeeF2",
          }}
        >
          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
            style={{
              width:
                "100%",

              border:
                "1px solid #dedfe5",

              borderRadius:
                "10px",

              padding:
                "10px",

              background:
                "#ffffff",

              color:
                "#555965",

              fontSize:
                "12px",

              fontWeight:
                700,

              cursor:
                "pointer",
            }}
          >
            ← Back to Application
          </button>
        </div>
      </aside>

      {/* =================================================
          MAIN AREA
      ================================================= */}

      <div
        style={{
          marginLeft:
            "250px",

          minHeight:
            "100vh",

          boxSizing:
            "border-box",
        }}
      >
        {/* ==============================================
            TOP BAR
        ============================================== */}

        <header
          style={{
            position:
              "sticky",

            top:
              0,

            zIndex:
              50,

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            gap:
              "16px",

            minHeight:
              "72px",

            padding:
              "12px 24px",

            boxSizing:
              "border-box",

            background:
              "rgba(255,255,255,0.92)",

            backdropFilter:
              "blur(16px)",

            borderBottom:
              "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                "12px",
            }}
          >
            {/* MOBILE MENU */}

            <button
              type="button"
              onClick={() =>
                setSidebarOpen(
                  true,
                )
              }
              style={{
                display:
                  "none",

                width:
                  "40px",

                height:
                  "40px",

                border:
                  "1px solid #dedfe5",

                borderRadius:
                  "10px",

                background:
                  "#ffffff",

                cursor:
                  "pointer",

                fontSize:
                  "19px",
              }}
            >
              ☰
            </button>

            <div>
              <div
                style={{
                  fontSize:
                    "10px",

                  fontWeight:
                    800,

                  letterSpacing:
                    "0.15em",

                  color:
                    "#858895",
                }}
              >
                ADMIN CONTROL
              </div>

              <h1
                style={{
                  margin:
                    "3px 0 0",

                  fontSize:
                    "21px",
                }}
              >
                {
                  activeMenuItem?.title ??
                  "Dashboard"
                }
              </h1>
            </div>
          </div>

          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                "14px",
            }}
          >
            <div
              style={{
                textAlign:
                  "right",
              }}
            >
              <div
                style={{
                  fontSize:
                    "11px",

                  color:
                    "#858895",
                }}
              >
                Admin Session
              </div>

              <strong
                style={{
                  fontSize:
                    "12px",
                }}
              >
                {
                  formatTime()
                }
              </strong>
            </div>

            <button
              type="button"
              onClick={
                handleLogout
              }
              style={{
                border:
                  "none",

                borderRadius:
                  "10px",

                padding:
                  "10px 14px",

                background:
                  "#20222b",

                color:
                  "#ffffff",

                fontSize:
                  "12px",

                fontWeight:
                  700,

                cursor:
                  "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* ==============================================
            CONTENT
        ============================================== */}

        <div
          style={{
            padding:
              "24px",

            boxSizing:
              "border-box",
          }}
        >
          {renderSectionContent()}
        </div>
      </div>

      {/* =================================================
          RESPONSIVE
      ================================================= */}

      <style>
        {`
          @media (max-width: 900px) {
            aside {
              transform: translateX(-105%) !important;
              transition: transform 0.25s ease;
            }

            main > div {
              margin-left: 0 !important;
            }

            main > div > header button:first-child {
              display: flex !important;
              align-items: center;
              justify-content: center;
            }
          }

          @media (max-width: 760px) {
            main section[style*="repeat(4"] {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }

            main section[style*="repeat(3"] {
              grid-template-columns: 1fr !important;
            }

            main > div > header {
              padding: 10px 14px !important;
            }

            main > div > div {
              padding: 16px !important;
            }
          }

          @media (max-width: 520px) {
            main section[style*="repeat(4"] {
              grid-template-columns: 1fr 1fr !important;
              gap: 10px !important;
            }

            main section[style*="repeat(4"] > div {
              padding: 14px !important;
            }

            main section[style*="repeat(4"] strong {
              font-size: 24px !important;
            }

            main > div > header h1 {
              font-size: 17px !important;
            }

            main > div > header > div:last-child > div {
              display: none;
            }
          }
        `}
      </style>
    </main>
  );
}
