import { useRef } from 'react';
import {
  generatePath,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { TournamentId, UnassignedPairingInput } from '~/api';
import { Button } from '~/components/generic/Button';
import { PageWrapper } from '~/components/PageWrapper';
import { toast } from '~/components/ToastProvider';
import { TournamentCompetitorsProvider } from '~/components/TournamentCompetitorsProvider';
import { TournamentProvider } from '~/components/TournamentProvider';
import { useGetTournamentCompetitorsByTournamentId } from '~/services/tournamentCompetitors';
import { useGetTournament, useOpenTournamentRound } from '~/services/tournaments';
import { PATHS } from '~/settings';
import { PairingsStep } from './components/PairingsStep';
import { PairingsStepHandle } from './components/PairingsStep/PairingsStep';
import { RosterStep } from './components/RosterStep';
import { RosterStepHandle } from './components/RosterStep/RosterStep';
import { useWizardSteps } from './TournamentAdvanceRoundPage.hooks';

export const TournamentAdvanceRoundPage = (): JSX.Element => {
  const params = useParams();
  const navigate = useNavigate();
  const tournamentId = params.id! as TournamentId; // Must exist or else how did we get to this route?
  const { data: tournament } = useGetTournament({ id: tournamentId });
  const { data: tournamentCompetitors } = useGetTournamentCompetitorsByTournamentId({ tournamentId });
  const { mutation: openTournamentRound } = useOpenTournamentRound({
    onSuccess: (): void => {
      toast.success(`Round ${nextRound + 1} pairings created!`);
      navigate(`${generatePath(PATHS.tournamentDetails, { id: tournamentId })}?tab=activeRound`);
    },
  });

  // Wizard
  const rosterStepRef = useRef<RosterStepHandle>(null);
  const pairingsStepRef = useRef<PairingsStepHandle>(null);
  const {
    step,
    cancel,
    back,
    advance,
    validatedAdvance,
  } = useWizardSteps([
    rosterStepRef,
    pairingsStepRef,
  ]);

  const onConfirmPairings = async (unassignedPairings: UnassignedPairingInput[]): Promise<void> => {
    await openTournamentRound({
      id: tournamentId,
      unassignedPairings,
    });
  };

  if (!tournament || !tournamentCompetitors) {
    return <div>Loading...</div>;
  }

  const nextRound = (tournament.lastRound ?? -1) + 1;

  return (
    <PageWrapper
      title={`Set Up Round ${nextRound + 1}`}
      footer={
        <>
          <Button variant="secondary" onClick={cancel} key="cancel" style={{ marginRight: 'auto' }}>Cancel</Button>
          {(step > 0) && (
            <Button key="back" onClick={back} variant="secondary">Back</Button>
          )}
          <Button key="proceed" onClick={validatedAdvance}>Proceed</Button>
        </>
      }
    >
      <TournamentProvider tournament={tournament}>
        <TournamentCompetitorsProvider tournamentCompetitors={tournamentCompetitors}>
          {step === 0 && (
            <RosterStep ref={rosterStepRef} nextRound={nextRound} onConfirm={advance} />
          )}
          {step === 1 && (
            <PairingsStep ref={pairingsStepRef} nextRound={nextRound} onConfirm={onConfirmPairings} />
          )}
        </TournamentCompetitorsProvider>
      </TournamentProvider>
    </PageWrapper>
  );
};
