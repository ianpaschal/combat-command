import { FieldArrayWithId } from 'react-hook-form';

import { FormData } from '~/components/TournamentCompetitorForm/TournamentCompetitorForm.schema';

export type ScoreAdjustmentField = FieldArrayWithId<Partial<FormData>, 'scoreAdjustments', 'id'>;
