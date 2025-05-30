import { MouseEvent } from 'react';
import { UserPen } from 'lucide-react';

import { TournamentCompetitor } from '~/api';
import { Accordion, AccordionItem } from '~/components/generic/Accordion';
import { Button } from '~/components/generic/Button';
import { Label } from '~/components/generic/Label';
import { Switch } from '~/components/generic/Switch';
import { IdentityBadge } from '~/components/IdentityBadge';
import { TournamentCompetitorEditDialog } from '~/components/TournamentCompetitorEditDialog/TournamentCompetitorEditDialog';
import { useTournamentCompetitorEditDialog } from '~/components/TournamentCompetitorEditDialog/TournamentCompetitorEditDialog.hooks';
import { useTournamentCompetitors } from '~/components/TournamentCompetitorsProvider';
import { useTournament } from '~/components/TournamentProvider';
import { useToggleTournamentCompetitorActive } from '~/services/tournamentCompetitors/useToggleTournamentCompetitorActive';

import styles from './TournamentRoster.module.scss';

export const TournamentRoster = (): JSX.Element => {
  const { useTeams } = useTournament();
  const competitors = useTournamentCompetitors();
  const { open } = useTournamentCompetitorEditDialog();
  const { mutation: toggleTournamentCompetitorActive } = useToggleTournamentCompetitorActive();
  const handleToggleActive = (e: MouseEvent, tournamentCompetitor: TournamentCompetitor): void => {
    e.stopPropagation();
    toggleTournamentCompetitorActive({ id: tournamentCompetitor._id });
  };
  const handleSubstitutePlayer = (e: MouseEvent, tournamentCompetitor: TournamentCompetitor): void => {
    e.stopPropagation();
    open({ tournamentCompetitor });
  };
  return (
    <>
      <Accordion>
        {(competitors || []).map((competitor) => (
          <AccordionItem id={competitor._id} disabled={!useTeams} key={competitor._id}>
            <div className={styles.TournamentRoster_Header}>
              <IdentityBadge competitor={competitor} />
              <div className={styles.TournamentRoster_Header_Actions}>
                <Label>Checked In</Label>
                <Switch onClick={(e) => handleToggleActive(e, competitor)} checked={competitor.active} />
                {useTeams && (
                  <Button variant="secondary" onClick={(e) => handleSubstitutePlayer(e, competitor)}>
                    <UserPen />
                    Edit
                  </Button>
                )}
              </div>
            </div>
            <div className={styles.TournamentRoster_Content}>
              {competitor.players.filter((player) => player.active).map((player) => (
                <IdentityBadge key={player.user?._id} user={player.user} size="small" />
              ))}
            </div>
          </AccordionItem>
        ))}
      </Accordion>
      <TournamentCompetitorEditDialog />
    </>
  );
};
