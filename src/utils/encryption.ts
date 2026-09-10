// =====================================================
// DLTJ2.1
// STEP 2 — BATCH 2
// FILE: src/utils/encryption.ts
// =====================================================
//
// FRONTEND DEVELOPMENT HELPER
//
// IMPORTANT:
// Real production password hashing must happen on the
// backend using Argon2id, bcrypt, or another suitable
// password hashing algorithm.
//
// =====================================================

// =====================================================
// BUFFER → HEX
// =====================================================

function bufferToHex(
  buffer: ArrayBuffer
): string {
  const bytes =
    new Uint8Array(buffer);

  return Array.from(bytes)
    .map((byte) =>
      byte
        .toString(16)
        .padStart(2, "0")
    )
    .join("");
}

// =====================================================
// TEXT → ARRAY BUFFER
// =====================================================

function textToArrayBuffer(
  text: string
): ArrayBuffer {
  const encoded =
    new TextEncoder().encode(text);

  return encoded.buffer.slice(
    encoded.byteOffset,
    encoded.byteOffset +
      encoded.byteLength
  ) as ArrayBuffer;
}

// =====================================================
// SHA-256
// =====================================================

async function sha256(
  text: string
): Promise<string> {
  const data =
    textToArrayBuffer(text);

  const hash =
    await crypto.subtle.digest(
      "SHA-256",
      data
    );

  return bufferToHex(hash);
}

// =====================================================
// HASH TEXT
// =====================================================

export async function hashText(
  text: string
): Promise<string> {
  return sha256(text);
}

// =====================================================
// VERIFY HASH
// =====================================================

export async function verifyHash(
  text: string,
  expectedHash: string
): Promise<boolean> {
  const actualHash =
    await hashText(text);

  if (
    actualHash.length !==
    expectedHash.length
  ) {
    return false;
  }

  let result = 0;

  for (
    let index = 0;
    index < actualHash.length;
    index++
  ) {
    result |=
      actualHash.charCodeAt(index) ^
      expectedHash.charCodeAt(index);
  }

  return result === 0;
}

// =====================================================
// RANDOM ID
// =====================================================

export function generateRandomId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return crypto.randomUUID();
  }

  const randomPart =
    Math.random()
      .toString(36)
      .slice(2);

  return `${Date.now()}-${randomPart}`;
}

// =====================================================
// SECURE RANDOM OTP
// =====================================================

export function generateRandomOTP(): string {
  const array =
    new Uint32Array(1);

  crypto.getRandomValues(array);

  const number =
    array[0] % 1000000;

  return number
    .toString()
    .padStart(6, "0");
}