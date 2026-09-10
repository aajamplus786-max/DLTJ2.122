// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 11
// FILE: src/components/spring/SpringApiTester.tsx
// DATE: 2026-08-31
// =====================================================

import { useState } from "react";

interface Props {
  baseUrl?: string;
}

export default function SpringApiTester({
  baseUrl = "http://localhost:8080",
}: Props) {
  const [method, setMethod] =
    useState("GET");

  const [path, setPath] =
    useState("/");

  const [body, setBody] =
    useState("");

  const [response, setResponse] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function sendRequest() {
    setLoading(true);

    try {
      const requestInit: RequestInit = {
        method,
        headers: {
          "Content-Type":
            "application/json",
        },
      };

      if (
        method !== "GET" &&
        method !== "HEAD" &&
        body.trim()
      ) {
        requestInit.body = body;
      }

      const result = await fetch(
        `${baseUrl}${path}`,
        requestInit,
      );

      const text =
        await result.text();

      setResponse(
        `HTTP ${result.status}\n\n${text}`,
      );
    } catch (error) {
      setResponse(
        error instanceof Error
          ? error.message
          : "Request failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="wt-spring-api-tester">
      <header className="wt-panel-header">
        <strong>API Tester</strong>
      </header>

      <div className="wt-api-row">
        <select
          value={method}
          onChange={(event) =>
            setMethod(
              event.target.value,
            )
          }
        >
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>PATCH</option>
          <option>DELETE</option>
        </select>

        <input
          value={path}
          onChange={(event) =>
            setPath(
              event.target.value,
            )
          }
          placeholder="/api/users"
        />

        <button
          type="button"
          onClick={sendRequest}
          disabled={loading}
        >
          {loading
            ? "Sending..."
            : "Send"}
        </button>
      </div>

      <textarea
        value={body}
        onChange={(event) =>
          setBody(event.target.value)
        }
        placeholder="JSON request body"
      />

      <pre className="wt-api-response">
        {response ||
          "API response will appear here."}
      </pre>
    </section>
  );
}