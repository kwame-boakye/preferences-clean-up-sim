/**
 * test/app.test.tsx
 *
 * Smoke tests for the two-pane UI structure built in milestone 7.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.js";

describe("App", () => {
  it("renders the category rail with all 16 categories", () => {
    render(<App />);
    // Every category name should appear as a button in the rail.
    expect(screen.getByRole("button", { name: /availability/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /notifications/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /salesforce/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /slack ai/i })).toBeInTheDocument();
  });

  it("shows the availability detail pane on first render", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /availability/i })).toBeInTheDocument();
  });

  it("switching categories updates the detail pane", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /notifications/i }));
    expect(screen.getByRole("heading", { name: /notifications/i })).toBeInTheDocument();
  });

  it("salesforce shows the empty state without crashing", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /salesforce/i }));
    expect(screen.getByText(/no preferences in this category/i)).toBeInTheDocument();
  });

  it("search: typing jumps the detail pane to the matched preference's category", async () => {
    const user = userEvent.setup();
    render(<App />);

    const searchInput = screen.getByPlaceholderText(/search preferences/i);
    await user.type(searchInput, "dark mode");

    // "Color mode" is the label of appearance-color-mode, found via keywords
    const result = await screen.findByText("Color mode");
    await user.click(result);

    // Detail pane should now show the Appearance category heading
    expect(screen.getByRole("heading", { name: /appearance/i })).toBeInTheDocument();
  });
});
