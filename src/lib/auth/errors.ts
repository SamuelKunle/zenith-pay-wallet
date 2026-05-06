export type AuthSignInErrorCode = "INVALID_CREDENTIALS" | "NETWORK" | "NOT_CONFIGURED" | "UNKNOWN";

export class AuthSignInError extends Error {
  readonly code: AuthSignInErrorCode;

  constructor(message: string, code: AuthSignInErrorCode, cause?: unknown) {
    super(message, { cause });
    this.name = "AuthSignInError";
    this.code = code;
  }
}
