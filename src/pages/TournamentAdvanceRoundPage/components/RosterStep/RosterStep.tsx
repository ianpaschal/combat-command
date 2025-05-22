import { Plus } from 'lucide-react';

import { Accordion, AccordionItem } from '~/components/generic/Accordion';
import { Button } from '~/components/generic/Button';
import { Separator } from '~/components/generic/Separator';
import { IdentityBadge } from '~/components/IdentityBadge';
import { TournamentCompetitorEditDialog } from '~/components/TournamentCompetitorEditDialog/TournamentCompetitorEditDialog';
import { useTournament } from '~/components/TournamentProvider';
import { RosterAddCompetitorDialog, useRosterAddCompetitorDialog } from '~/pages/TournamentAdvanceRoundPage/components/RosterAddCompetitorDialog';
import { useGetTournamentCompetitorsByTournamentId } from '~/services/tournamentCompetitors';
import { RosterHeader } from '../RosterHeader';

import styles from './RosterStep.module.scss';

export const RosterStep = (): JSX.Element => {
  const { _id: tournamentId, useTeams } = useTournament();
  const { data: competitors } = useGetTournamentCompetitorsByTournamentId(tournamentId);
  const { open: openRosterAddCompetitorDialog } = useRosterAddCompetitorDialog();
  return (
    <>
      <div className={styles.RosterStep}>
        <div className={styles.RosterStep_Header}>
          <h2>
            {`Adjust ${useTeams ? 'Teams' : 'Players'}`}
          </h2>
          <div className={styles.RosterStep_Actions}>
            <Button variant="secondary" onClick={openRosterAddCompetitorDialog}>
              <Plus />
              {`Add ${useTeams ? 'Team' : 'Player'}`}
            </Button>
          </div>
        </div>
        <Separator />
        <Accordion>
          {(competitors || []).map((competitor) => (
            <AccordionItem id={competitor._id} disabled={!useTeams} key={competitor._id}>
              <RosterHeader tournamentCompetitor={competitor} />
              <div className={styles.RosterStep_CompetitorContent}>
                {competitor.players.filter((player) => player.active).map((player) => (
                  <IdentityBadge key={player.user?._id} user={player.user} size="small" />
                ))}
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <RosterAddCompetitorDialog />
      <TournamentCompetitorEditDialog />
    </>
  );
};
