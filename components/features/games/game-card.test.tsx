import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GameCard } from "./game-card";

// Mock child components to avoid context dependencies
vi.mock("../lists/lists-dropdown", () => ({
  ListsDropdown: () => <div data-testid="lists-dropdown" />,
}));

// Mock Tooltip components
vi.mock("@/components/ui/tooltip", () => ({
  Tooltip: ({ children }: any) => <div>{children}</div>,
  TooltipContent: ({ children }: any) => <div>{children}</div>,
  TooltipProvider: ({ children }: any) => <div>{children}</div>,
  TooltipTrigger: ({ children }: any) => <div>{children}</div>,
}));

describe("GameCard", () => {
  const defaultProps = {
    id: "g1",
    title: "Test Game",
    link: "https://example.com",
    topic: "words",
    playCount: 10,
    isPlayed: false,
    onPlay: vi.fn(),
    onHide: vi.fn(),
  };

  it("renders game title and domain", () => {
    render(<GameCard {...defaultProps} />);
    expect(screen.getByText("Test Game")).toBeInTheDocument();
    expect(screen.getByText("example.com")).toBeInTheDocument();
  });

  it("calls onPlay when clicked", () => {
    render(<GameCard {...defaultProps} />);
    fireEvent.click(screen.getByText("Test Game").closest(".cursor-pointer")!);
    expect(defaultProps.onPlay).toHaveBeenCalledWith("g1");
  });

  it("displays NEW badge for recent games", () => {
    // Create a date 1 hour ago
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    render(
      <GameCard
        {...defaultProps}
        createdAt={oneHourAgo}
        newGameMinutes={1440} // 24 hours
      />
    );
    expect(screen.getByText("NEW")).toBeInTheDocument();
  });

  it("does NOT display NEW badge if game is played (even if recent)", () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    render(
      <GameCard
        {...defaultProps}
        createdAt={oneHourAgo}
        newGameMinutes={1440}
        isPlayed={true}
      />
    );
    expect(screen.queryByText("NEW")).not.toBeInTheDocument();
  });

  it("displays Played checkmark when played", () => {
    render(<GameCard {...defaultProps} isPlayed={true} />);
    // Check for grayscale class which indicates played state visually, or check for check icon (lucide 'Check' usually renders an svg)
    // Testing specific classes:
    const card = screen.getByText("Test Game").closest(".cursor-pointer");
    expect(card).toHaveClass("grayscale");
  });
});
