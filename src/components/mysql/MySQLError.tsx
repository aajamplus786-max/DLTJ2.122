// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 10
// FILE: src/components/mysql/MySQLError.tsx
// DATE: 2026-08-31
// =====================================================

interface Props {
    message?: string | null;
    code?: string | number | null;
  }
  
  export default function MySQLError({
    message,
    code,
  }: Props) {
    if (!message) {
      return null;
    }
  
    return (
      <section className="wt-mysql-error">
        <strong>MySQL Error</strong>
  
        {code && (
          <span className="wt-mysql-error-code">
            {String(code)}
          </span>
        )}
  
        <pre>{message}</pre>
      </section>
    );
  }