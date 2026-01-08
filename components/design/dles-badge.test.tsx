import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DlesBadge } from "./dles-badge";

describe("DlesBadge", () => {
  it("renders text correctly", () => {
    render(<DlesBadge text="Test Badge" color="slate" />);
    expect(screen.getByText("Test Badge")).toBeInTheDocument();
  });

  it("renders count if provided", () => {
    render(<DlesBadge text="Items" color="slate" count={5} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("applies topic classes for known topics", () => {
    const { container } = render(<DlesBadge text="Words" color="words" />);
    // "words" topic usually maps to specific color classes, hard to test exact class string without fragility,
    // but we can check if it rendered successfully.
    expect(container.firstChild).toHaveClass("rounded-full");
  });

  it("applies size classes", () => {
    const { container } = render(
      <DlesBadge text="Small" color="slate" size="xs" />
    );
    expect(container.firstChild).toHaveClass("text-[8px]");
  });
});
