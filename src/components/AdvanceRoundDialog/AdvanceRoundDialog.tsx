import { useEffect } from 'react';

import { Dialog } from '~/components/generic/Dialog';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { useGetMatchesByTournamentId } from '~/services/matchResults/getMatchesByTournamentId';
import { useCreateTournamentPairings } from '~/services/tournament_pairings/createTournamentPairings';
import { useFetchTournamentFull } from '~/services/tournaments/fetchTournamentFull';
import { useUpdateTournament } from '~/services/tournaments/updateTournament';
import { FowV4RankingFactor } from '~/types/fowV4/fowV4RankingFactorSchema';
import { calculateTournamentRankings } from '~/utils/common/calculateTournamentRankings';
import { generateTournamentPairings } from '~/utils/common/generateTournamentPairings';
import { getCompetitorDisplay } from '~/utils/common/getCompetitorDisplay';
import { aggregatePlayerResults } from '~/utils/flamesOfWarV4Utils/aggregatePlayerResults';

export interface AdvanceRoundDialogProps {
  tournamentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AdvanceRoundDialog = ({
  tournamentId,
  open,
  onOpenChange,
}: AdvanceRoundDialogProps) => {
  // Fetch data
  const { data: tournament } = useFetchTournamentFull(tournamentId);
  const { data: matches } = useGetMatchesByTournamentId({ tournamentId });

  // Save data
  const updateTournament = useUpdateTournament();
  const createTournamentPairings = useCreateTournamentPairings();

  const nextRound = typeof tournament?.current_round === 'number' ? tournament?.current_round + 1 : 0;
  const rankedResults = tournament ? calculateTournamentRankings<FowV4RankingFactor>(
    tournament,
    matches || [],
    aggregatePlayerResults,
  ) : [];

  const pairings = tournament ? generateTournamentPairings({
    tournament,
    type: nextRound === 0 ? 'random' : tournament.pairing_method,
    roundIndex: nextRound,
    rankedCompetitorResults: rankedResults,
  }) : [];

  const handleClickProceed = (): void => {
    updateTournament.mutate({
      id: tournamentId,
      current_round: nextRound,
      status: 'active', // Maybe not needed if we use current_round to determine an active tournament
    });
    createTournamentPairings.mutate({
      tournamentId,
      pairings,
    });
  };

  useEffect(() => {
    if (updateTournament.isSuccess && createTournamentPairings.isSuccess) {
      onOpenChange(false);
    }
  }, [updateTournament, createTournamentPairings, onOpenChange]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Advance to Round ${nextRound + 1}`}
      actions={[
        { label: 'Cancel', muted: true, cancel: true },
        { label: 'Proceed', onClick: handleClickProceed },
      ]}
    >
      <ScrollArea type="scroll" indicatorBorder="top">
        The following pairings will be created:
        {pairings.map((pairing, i) => {
          const competitor0Rank = rankedResults.findIndex((result) => result.competitor.id === pairing.competitor_0_id);
          const [competitor0Name] = getCompetitorDisplay(
            (tournament?.competitors || []).find(
              (competitor) => competitor.id === pairing.competitor_0_id,
            ),
          );
          const competitor1Rank = rankedResults.findIndex((result) => result.competitor.id === pairing.competitor_1_id);
          const [competitor1Name] = getCompetitorDisplay(
            (tournament?.competitors || []).find(
              (competitor) => competitor.id === pairing.competitor_1_id,
            ),
          );
          if (nextRound === 0) {
            return (
              <div key={i}>
                {`${competitor0Name} vs. ${competitor1Name}`}
              </div>
            );
          }
          return (
            <div key={i}>
              {`#${competitor0Rank} ${competitor0Name} vs. ${competitor1Rank} ${competitor1Name}`}
            </div>
          );
        })}
      </ScrollArea>
    </Dialog>
  );
};