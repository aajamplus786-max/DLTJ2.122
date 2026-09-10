// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 12
// FILE: src/components/workingTools/project/ConnectionManager.tsx
// DATE: 2026-08-31
// =====================================================

import { useState } from "react";
import {
  testProjectConnection,
  type ProjectConnection,
} from "../../../services/projectService";

interface Props {
  connection?: ProjectConnection;
  onChange?: (connection: ProjectConnection) => void;
}

const emptyConnection: ProjectConnection = {
  name: "Local Development",
  springUrl: "http://localhost:8080",
  mysqlHost: "localhost",
  mysqlPort: 3306,
  mysqlDatabase: "",
  mysqlUser: "root",
  mysqlPassword: "",
};

export default function ConnectionManager({
  connection = emptyConnection,
  onChange,
}: Props) {
  const [value, setValue] = useState<ProjectConnection>(connection);
  const [status, setStatus] = useState("");

  function update<K extends keyof ProjectConnection>(
    key: K,
    nextValue: ProjectConnection[K],
  ) {
    const next = { ...value, [key]: nextValue };
    setValue(next);
    onChange?.(next);
  }

  async function test() {
    setStatus("Testing...");

    try {
      const result = await testProjectConnection(value);
      setStatus(result.message);
    } catch {
      setStatus("Connection test failed.");
    }
  }

  return (
    <section className="wt-project-panel">
      <h3>Connection Manager</h3>

      <label>
        Connection Name
        <input
          value={value.name}
          onChange={(e) => update("name", e.target.value)}
        />
      </label>

      <label>
        Spring Boot URL
        <input
          value={value.springUrl}
          onChange={(e) => update("springUrl", e.target.value)}
        />
      </label>

      <label>
        MySQL Host
        <input
          value={value.mysqlHost}
          onChange={(e) => update("mysqlHost", e.target.value)}
        />
      </label>

      <label>
        MySQL Port
        <input
          type="number"
          value={value.mysqlPort}
          onChange={(e) =>
            update("mysqlPort", Number(e.target.value))
          }
        />
      </label>

      <label>
        Database
        <input
          value={value.mysqlDatabase}
          onChange={(e) =>
            update("mysqlDatabase", e.target.value)
          }
        />
      </label>

      <label>
        MySQL User
        <input
          value={value.mysqlUser}
          onChange={(e) => update("mysqlUser", e.target.value)}
        />
      </label>

      <label>
        MySQL Password
        <input
          type="password"
          value={value.mysqlPassword}
          onChange={(e) =>
            update("mysqlPassword", e.target.value)
          }
        />
      </label>

      <button type="button" onClick={test}>
        Test Connection
      </button>

      {status && <p>{status}</p>}
    </section>
  );
}