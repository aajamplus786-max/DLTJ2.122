// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 12
// FILE: src/components/workingTools/project/ProjectConnections.tsx
// DATE: 2026-08-31
// =====================================================

import {
    type ProjectConnection,
  } from "../../../services/projectService";
  
  interface Props {
    connections: ProjectConnection[];
    selected?: string;
    onSelect?: (name: string) => void;
  }
  
  export default function ProjectConnections({
    connections,
    selected,
    onSelect,
  }: Props) {
    return (
      <section className="wt-project-panel">
        <h3>Project Connections</h3>
  
        {connections.length === 0 ? (
          <p>No project connections configured.</p>
        ) : (
          <div>
            {connections.map((connection) => (
              <button
                type="button"
                key={connection.name}
                className={
                  selected === connection.name
                    ? "wt-connection active"
                    : "wt-connection"
                }
                onClick={() => onSelect?.(connection.name)}
              >
                <strong>{connection.name}</strong>
                <span>{connection.springUrl}</span>
                <small>
                  {connection.mysqlHost}:{connection.mysqlPort}
                </small>
              </button>
            ))}
          </div>
        )}
      </section>
    );
  }