// =====================================================
// DLTJ2.1
// STEP 2
// FILE: src/components/auth/SecurityTimer.tsx
// =====================================================

import { useEffect, useState } from "react";

interface Props {
  expiresAt: number;
}

export default function SecurityTimer({
  expiresAt,
}: Props) {
  const [remaining, setRemaining] =
    useState(
      Math.max(
        0,
        expiresAt - Date.now()
      )
    );

  useEffect(() => {
    const timer =
      window.setInterval(() => {
        setRemaining(
          Math.max(
            0,
            expiresAt - Date.now()
          )
        );
      }, 1000);

    return () =>
      window.clearInterval(timer);
  }, [expiresAt]);

  const seconds =
    Math.ceil(remaining / 1000);

  return (
    <span>
      {seconds}s
    </span>
  );
}