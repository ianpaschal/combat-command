export function sortByRank<T extends { rank: number }>(array: T[]): T[] {
  return [...array].sort((a, b) => a.rank - b.rank);
}
