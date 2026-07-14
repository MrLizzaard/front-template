export interface JwtPayload {
  idx: number;
  id: string;
  userName: string;
  auth: string;
  iat: number;
  exp: number;
}

const TOKEN_TTL_SECONDS = 60 * 60; // 1시간

const base64UrlEncode = (value: object): string => {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const base64UrlDecode = (value: string): string => {
  const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
};

export const createMockToken = (
  payload: Pick<JwtPayload, "idx" | "id" | "userName" | "auth">
): string => {
  const header = { alg: "none", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JwtPayload = {
    ...payload,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
  };
  const fakeSignature = Math.random().toString(36).slice(2);

  return `${base64UrlEncode(header)}.${base64UrlEncode(fullPayload)}.${fakeSignature}`;
};

export const decodeMockToken = (token: string): JwtPayload | null => {
  try {
    const [, payload] = token.split(".");
    return JSON.parse(base64UrlDecode(payload));
  } catch {
    return null;
  }
};

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  const payload = decodeMockToken(token);
  if (!payload) return false;

  return payload.exp > Math.floor(Date.now() / 1000);
};
