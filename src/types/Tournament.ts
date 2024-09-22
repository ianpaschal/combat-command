import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const tournamentStatusSchema = z.union([
  z.literal('draft'),
  z.literal('published'),
  z.literal('active'),
  z.literal('archived'),
]);

const tournamentSchema = z.object({
  competitor_count: z.coerce.number().min(2, 'Tournaments require at least two competitors.'),
  competitor_groups: z.array(z.object({
    name: z.string().min(1).max(20),
    size: z.coerce.number().min(1),
  })),
  competitor_size: z.coerce.number(),
  current_round: z.optional(z.number()),
  // TODO: How to handle round timing? especially pauses
  description: z.optional(z.string().max(1000, 'Descriptions are limited to 1000 characters.')),
  end_date: z.string(),
  end_time: z.string(),
  game_system_id: z.string().uuid(),
  location: z.string(),
  logo_url: z.optional(z.string().url('Please provide a valid URL.')).or(z.literal('')),
  organizer_ids: z.array(z.string().uuid()),
  registrations_open: z.boolean(),
  round_count: z.number(),
  rules_pack_url: z.optional(z.string().url('Please provide a valid URL.')).or(z.literal('')),
  start_date: z.string(),
  start_time: z.string(),
  status: tournamentStatusSchema,
  title: z.string(),
  use_national_teams: z.boolean(),
  // game_system_config: json (rules, points, era)
  // ranking_config: json
  // pairing_config: json

  // FIXME: This doesn't work
}).refine((data) => false, {
  message: 'Wrong team size or wrong max player size',
  path: ['maxPlayers', 'teamSize'],
});

export const tournamentResolver = zodResolver(tournamentSchema);

export type Tournament = z.infer<typeof tournamentSchema>;

export type TournamentRecord = Tournament & {
  id: string;
  created_at: string;
  modified_at: string;
};

// export interface Tournament {
//   id: UUID;
//   created_at: Timestamp;
//   modified_at: Timestamp;
//   visibility: 'draft' | 'hidden' | 'public';
//   registration_open: boolean;
//   match_results_open: boolean;
//   team_size_limit: number | null;
//   active_round_index: number | null;
//   round_count: number;
//   type: 'team' | 'solo';
  
//   // Display info
//   title: string;
//   description: string;
//   start_date: Timestamp;
//   end_date: Timestamp;
//   location: string;

//   game_system_id: UUID; // Foreign key, table: game_systems
//   organizer_ids: UUID[]; // Foreign key, table: users
// }

// export interface TournamentTeam {
//   tournament_team_id: UUID;
//   created_at: Timestamp;
//   modified_at: Timestamp;
//   tournament_id: UUID; // foreign key
//   name: string;
// }

// export type TournamentFields = Omit<Tournament, 'tournament_id' | 'created_at' | 'modified_at'>;

