import { z } from 'zod';

export const tournamentCreateTeamFormSchema = z.object({
  teamName: z.string(),
});

export type TournamentCreateTeamFormData = z.infer<typeof tournamentCreateTeamFormSchema>;

export const defaultValues: TournamentCreateTeamFormData = {
  teamName: '',
};
