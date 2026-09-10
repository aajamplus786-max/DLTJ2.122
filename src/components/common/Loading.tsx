// =====================================================
// DLTJ2.0
// STEP 2
// FILE: src/components/common/Loading.tsx
// =====================================================

interface LoadingProps {
    text?: string;
  }
  
  export default function Loading({
    text = "Loading...",
  }: LoadingProps) {
    return (
      <div className="dltj-loading">
        <div className="dltj-loading-spinner" />
        <p>{text}</p>
      </div>
    );
  }