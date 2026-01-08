import "@testing-library/jest-dom";
import { act } from "react";
import { vi } from "vitest";

// Polyfill for React 19 / Testing Library compatibility
// The issue is that some environments (like Vercel CI) might have a version of React or
// Testing Library where `act` is missing from the default export or global React object,
// or the React object is frozen and cannot be mutated.
// We use vi.mock to safely intercept the 'react' module and ensure 'act' is present.

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    act: actual.act || act,
  };
});
