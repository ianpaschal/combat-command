// Fisher–Yates shuffle
// See: https://bost.ocks.org/mike/shuffle/
export function sortByRank<T extends { rank: number }>(array: T[]): T[] {
  return [...array].sort((a, b) => a.rank - b.rank);
}
