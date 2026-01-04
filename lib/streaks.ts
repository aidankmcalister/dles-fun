/**
 * Streak calculation utilities
 * Calculates consecutive days of play from an array of dates
 */

/**
 * Get the date string in YYYY-MM-DD format
 */
function toDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Get unique play dates sorted in descending order
 */
function getUniqueDates(dates: Date[]): string[] {
  const uniqueDates = [...new Set(dates.map(toDateString))];
  return uniqueDates.sort((a, b) => b.localeCompare(a)); // Most recent first
}

/**
 * Calculate current streak (consecutive days ending today or yesterday)
 */
export function getCurrentStreak(playedDates: Date[]): number {
  if (playedDates.length === 0) return 0;

  const uniqueDates = getUniqueDates(playedDates);
  const today = toDateString(new Date());
  const yesterday = toDateString(new Date(Date.now() - 24 * 60 * 60 * 1000));

  // Check if streak is active (played today or yesterday)
  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const currentDate = new Date(uniqueDates[i - 1]);
    const prevDate = new Date(uniqueDates[i]);
    const diffDays = Math.round(
      (currentDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000)
    );

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculate longest streak ever achieved
 */
export function getLongestStreak(playedDates: Date[]): number {
  if (playedDates.length === 0) return 0;

  const uniqueDates = getUniqueDates(playedDates).reverse(); // Oldest first

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currentDate = new Date(uniqueDates[i]);
    const diffDays = Math.round(
      (currentDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000)
    );

    if (diffDays === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return longestStreak;
}
