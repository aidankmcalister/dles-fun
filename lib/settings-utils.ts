export interface SiteConfig {
  id: string;
  newGameMinutes: number;
  topicColors: Record<string, string> | null;
  maintenanceMode: boolean;
  welcomeMessage: string | null;
  showWelcomeMessage: boolean;
  featuredGameIds: string[];
  minPlayStreak: number;
  enableCommunitySubmissions: boolean;
  defaultSort: string;
  showPresetLists: boolean;
  maxSubmissionsPerDay: number;
  enableLeaderboards: boolean;
  updatedAt: string;
}

// Partial used for defaults/forms
export const DEFAULT_CONFIG = {
  newGameMinutes: 10080,
  maintenanceMode: false,
  welcomeMessage: null,
  showWelcomeMessage: false,
  minPlayStreak: 1,
  enableCommunitySubmissions: false,
  defaultSort: "title",
  maxCustomLists: 10,
  showPresetLists: true,
  maxSubmissionsPerDay: 5,
  enableLeaderboards: false,
};

export interface SettingChange {
  key: string;
  old: string;
  new: string;
}

export function calculateSettingsDiff(
  current: Partial<SiteConfig>,
  defaults: typeof DEFAULT_CONFIG
): SettingChange[] {
  return Object.keys(defaults).reduce((acc, key) => {
    const k = key as keyof typeof DEFAULT_CONFIG;
    const currentVal = current[k as keyof SiteConfig];
    const defaultVal = defaults[k];

    // Loose comparison to handle potential null/undefined vs default mismatches
    // and different types (form inputs might be string vs number sometimes if not parsed)
    if (currentVal != defaultVal) {
      acc.push({
        key: k
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
        old: String(currentVal ?? "null"),
        new: String(defaultVal),
      });
    }
    return acc;
  }, [] as SettingChange[]);
}
