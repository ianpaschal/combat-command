import { FieldArrayWithId } from 'react-hook-form';

import { TournamentCompetitorFormData } from '~/components/TournamentCompetitorForm/TournamentCompetitorForm.schema';

export type ScoreAdjustmentField = FieldArrayWithId<Partial<TournamentCompetitorFormData>, 'scoreAdjustments', 'id'>;
