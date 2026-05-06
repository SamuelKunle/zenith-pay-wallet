import { describe, expect, it } from "vitest";
import { mapLoginResponseToSession } from "./apiAuthDriver";

describe("mapLoginResponseToSession", () => {
  it("maps OAuth-style snake_case fields", () => {
    const s = mapLoginResponseToSession({
      access_token: "tok",
      sub: "user:u1",
      email: "a@b.com",
      display_name: "Ada Lovelace",
    });
    expect(s).toEqual({
      status: "authenticated",
      subject: "user:u1",
      email: "a@b.com",
      displayName: "Ada Lovelace",
      accessToken: "tok",
    });
  });

  it("maps camelCase fields", () => {
    const s = mapLoginResponseToSession({
      accessToken: "jwt",
      subject: "user:x",
      displayName: "Test",
    });
    expect(s.accessToken).toBe("jwt");
    expect(s.subject).toBe("user:x");
    expect(s.displayName).toBe("Test");
  });
});
