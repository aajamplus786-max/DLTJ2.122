// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 10
// FILE: src/components/mysql/MySQLConnection.tsx
// DATE: 2026-08-31
// =====================================================

import { useState } from "react";

export interface MySQLConnectionConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

interface Props {
  onConnect: (
    config: MySQLConnectionConfig,
  ) => Promise<void> | void;

  connected?: boolean;
}

export default function MySQLConnection({
  onConnect,
  connected = false,
}: Props) {
  const [host, setHost] =
    useState("localhost");

  const [port, setPort] =
    useState(3306);

  const [database, setDatabase] =
    useState("");

  const [username, setUsername] =
    useState("root");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    setLoading(true);

    try {
      await onConnect({
        host: host.trim(),
        port,
        database: database.trim(),
        username: username.trim(),
        password,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="wt-mysql-connection"
      onSubmit={handleSubmit}
    >
      <div className="wt-tool-section-title">
        MySQL Connection
      </div>

      <input
        value={host}
        onChange={(event) =>
          setHost(event.target.value)
        }
        placeholder="Host"
      />

      <input
        type="number"
        value={port}
        onChange={(event) =>
          setPort(Number(event.target.value))
        }
        placeholder="Port"
      />

      <input
        value={database}
        onChange={(event) =>
          setDatabase(event.target.value)
        }
        placeholder="Database"
      />

      <input
        value={username}
        onChange={(event) =>
          setUsername(event.target.value)
        }
        placeholder="Username"
      />

      <input
        type="password"
        value={password}
        onChange={(event) =>
          setPassword(event.target.value)
        }
        placeholder="Password"
      />

      <button
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Connecting..."
          : connected
            ? "Reconnect"
            : "Connect"}
      </button>
    </form>
  );
}