import { Infer } from 'convex/values';

import {
  Doc,
  Id,
  TableNames,
} from '../../_generated/dataModel';
import { baseStats } from './baseStats';
import { rankingFactor, rankingFactorValues } from './rankingFactor';
import { scoreAdjustment } from './scoreAdjustment';
import { tournamentStatus } from './tournamentStatus';

export type BaseStats = Infer<typeof baseStats>;

export type RankingFactor = Infer<typeof rankingFactor>;

export type RankingFactorValues = Infer<typeof rankingFactorValues>;

export type ScoreAdjustment = Infer<typeof scoreAdjustment>;

export type TournamentStatus = Infer<typeof tournamentStatus>;

export type TriggerChange<TableName extends TableNames> = {
  id: Id<TableName>;
  newDoc: Doc<TableName> | null;
  oldDoc: Doc<TableName> | null;
};

export type MutationIssue = {
  fieldPath: string;
  message: string;
};

export type MutationResponse = {
  success?: {
    message: string;
  }
  error?: {
    issues: MutationIssue[];
  }
};
