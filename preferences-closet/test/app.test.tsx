/**
 * test/app.test.tsx
 *
 * Smoke test: confirms React + Testing Library + happy-dom is wired up correctly.
 * As you build out the UI (milestones 7-9), add tests for the actual components alongside.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { App } from "../src/App.js";

describe("App", () => {
  it("renders the placeholder heading", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /preferences closet/i })).toBeInTheDocument();
  });
});
