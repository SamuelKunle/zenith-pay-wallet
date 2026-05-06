import { describe, expect, it } from "vitest";
import { errorToMessage } from "./errorMessage";

describe("errorToMessage", () => {
  it("reads Error.message", () => {
    expect(errorToMessage(new Error("oops"))).toBe("oops");
  });

  it("returns string as-is", () => {
    expect(errorToMessage("plain")).toBe("plain");
  });

  it("uses fallback for unknown", () => {
    expect(errorToMessage(null)).toBe("Something went wrong");
    expect(errorToMessage(404, "bad")).toBe("bad");
  });
});
