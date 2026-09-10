// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 11
// FILE: src/components/spring/SpringConfig.tsx
// DATE: 2026-08-31
// =====================================================

interface Props {
    port: number;
    profile: string;
    onPortChange: (port: number) => void;
    onProfileChange: (
      profile: string,
    ) => void;
  }
  
  export default function SpringConfig({
    port,
    profile,
    onPortChange,
    onProfileChange,
  }: Props) {
    return (
      <section className="wt-spring-config">
        <div className="wt-tool-section-title">
          Spring Configuration
        </div>
  
        <label>
          Server Port
          <input
            type="number"
            value={port}
            onChange={(event) =>
              onPortChange(
                Number(
                  event.target.value,
                ),
              )
            }
          />
        </label>
  
        <label>
          Active Profile
          <input
            value={profile}
            onChange={(event) =>
              onProfileChange(
                event.target.value,
              )
            }
            placeholder="dev"
          />
        </label>
      </section>
    );
  }