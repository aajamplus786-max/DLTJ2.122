// =====================================================
// DLTJ2.9
// SERVER ENTRY POINT
// FILE: server/src/server.ts
// =====================================================

import "dotenv/config";

import app from "./app";
import { env } from "./config/env";

// =====================================================
// SERVER PORT
// =====================================================

const PORT = env.port;

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(
    `DLTJ2.10 Working Tool backend running on http://localhost:${PORT}`,
  );

  console.log(
    `Health check: http://localhost:${PORT}/api/health`,
  );
});