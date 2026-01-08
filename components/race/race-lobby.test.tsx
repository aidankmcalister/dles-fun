import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RaceLobby } from "./race-lobby";

// Mock dependencies
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

// Mock Impersonation Hook
const mockUseImpersonation = vi.fn();
vi.mock("@/components/impersonation-provider", () => ({
  useImpersonation: () => mockUseImpersonation(),
}));

// Mock child components
vi.mock("@/components/features/race/lobby/lobby-header", () => ({
  LobbyHeader: () => <div data-testid="lobby-header" />,
}));
vi.mock("@/components/features/race/lobby/participant-list", () => ({
  ParticipantList: () => <div data-testid="participant-list" />,
}));
vi.mock("@/components/features/race/lobby/race-config", () => ({
  RaceConfig: () => <div data-testid="race-config" />,
}));

// Mock toast
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

describe("RaceLobby", () => {
  const defaultRace: any = {
    id: "race-123",
    name: "Test Race",
    status: "waiting",
    participants: [],
    raceGames: [],
    createdBy: "user-1",
  };

  const defaultUser = { id: "user-1", name: "User 1" };

  it("renders correctly", () => {
    mockUseImpersonation.mockReturnValue({ effectiveRole: "member" });
    render(
      <RaceLobby
        race={defaultRace}
        currentUser={defaultUser}
        onRefresh={vi.fn()}
      />
    );
    expect(screen.getByTestId("lobby-header")).toBeInTheDocument();
    expect(screen.getByTestId("participant-list")).toBeInTheDocument();
  });

  it("shows Force Start button for Admin", () => {
    mockUseImpersonation.mockReturnValue({ effectiveRole: "admin" });
    const raceWithParticipant = {
      ...defaultRace,
      participants: [{ id: "p1", userId: "user-1", name: "User 1" }],
    };
    render(
      <RaceLobby
        race={raceWithParticipant}
        currentUser={defaultUser}
        onRefresh={vi.fn()}
      />
    );
    expect(screen.getByText(/Force Start Race/)).toBeInTheDocument();
  });

  it("shows Force Start button for Owner", () => {
    mockUseImpersonation.mockReturnValue({ effectiveRole: "owner" });
    const raceWithParticipant = {
      ...defaultRace,
      participants: [{ id: "p1", userId: "user-1", name: "User 1" }],
    };
    render(
      <RaceLobby
        race={raceWithParticipant}
        currentUser={defaultUser}
        onRefresh={vi.fn()}
      />
    );
    expect(screen.getByText(/Force Start Race/)).toBeInTheDocument();
  });

  it("hides Force Start button for Member", () => {
    mockUseImpersonation.mockReturnValue({ effectiveRole: "member" });
    const raceWithParticipant = {
      ...defaultRace,
      participants: [{ id: "p1", userId: "user-1", name: "User 1" }],
    };
    render(
      <RaceLobby
        race={raceWithParticipant}
        currentUser={defaultUser}
        onRefresh={vi.fn()}
      />
    );
    expect(screen.queryByText(/Force Start Race/)).not.toBeInTheDocument();
  });
});
