# Tournaments

## Tournament Life-Cycle

| Trigger                  | Starts Phase   | `status`      | `currentRound` |
|--------------------------|----------------|---------------|----------------|
| `createTournament()`     | Editing        | `'draft'`     | `unset`        |
| `publishTournament()`    | Published      | `'published'` | `unset`        |
| `startTournament()`      | Round 1 Set-Up | `'active'`    | `unset`        |
| `startTournamentRound()`  | Round 1 Play   | `'active'`    | `0`            |
| `endTournamentRound()` | Round 2 Set-Up | `'active'`    | `unset`        |
| `startTournamentRound()`  | Round 2 Play   | `'active'`    | `1`            |
| `endTournament()`        | Archived       | `'archived'`  | `unset`        |