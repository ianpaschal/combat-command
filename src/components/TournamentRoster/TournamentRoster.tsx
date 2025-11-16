import { MouseEvent } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { TournamentCompetitorId } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { Accordion, AccordionItem } from '~/components/generic/Accordion';
import { Button } from '~/components/generic/Button';
import { Label } from '~/components/generic/Label';
import { Switch } from '~/components/generic/Switch';
import { IdentityBadge } from '~/components/IdentityBadge';
import { useTournamentCompetitors } from '~/components/TournamentCompetitorsProvider';
import { useTournament } from '~/components/TournamentProvider';
import { CompetitorActions } from '~/components/TournamentRoster/components/CompetitorActions';
import { PlayerCount } from '~/components/TournamentRoster/components/PlayerCount';
import { useToggleTournamentRegistrationActive } from '~/services/tournamentRegistrations';
import { PATHS } from '~/settings';
import { isUserTournamentOrganizer } from '~/utils/common/isUserTournamentOrganizer';

import styles from './TournamentRoster.module.scss';

export interface TournamentRosterProps {
  className?: string;
}

export const TournamentRoster = ({
  className,
}: TournamentRosterProps): JSX.Element => {
  const navigate = useNavigate();
  const user = useAuth();
  const tournament = useTournament();
  const isOrganizer = isUserTournamentOrganizer(user, tournament);

  const competitors = useTournamentCompetitors();
  const { mutation: toggleActive } = useToggleTournamentRegistrationActive();

  const handleClickViewDetails = (id: TournamentCompetitorId): void => {
    navigate(generatePath(PATHS.tournamentCompetitorDetails, {
      tournamentId: tournament._id,
      tournamentCompetitorId: id,
    }));
  };

  const showActiveToggle = isOrganizer && tournament.status === 'active' && tournament.currentRound === undefined;
  return (
    <Accordion className={className}>
      {(competitors || []).map((competitor) => (
        <AccordionItem id={competitor._id} disabled={!tournament.useTeams} key={competitor._id}>
          <div className={styles.TournamentRoster_Header}>
            <IdentityBadge className={styles.TournamentRoster_Identity} competitor={competitor} />
            <Button icon={<ArrowRight />} onClick={() => handleClickViewDetails(competitor._id)} />
            {tournament.useTeams && (
              <PlayerCount className={styles.TournamentRoster_PlayerCount} competitorSize={tournament.competitorSize} competitor={competitor} />
            )}
            <CompetitorActions className={styles.TournamentRoster_Actions} competitor={competitor} />
          </div>
          <div className={styles.TournamentRoster_Content}>
            {competitor.registrations.map((r) => (
              <div key={r._id} className={styles.TournamentRoster_RegistrationRow}>
                <IdentityBadge key={r.user?._id} user={r.user} size="small" />
                {showActiveToggle && (
                  <div className={styles.TournamentRoster_RegistrationSwitch}>
                    <Label>Active</Label>
                    <Switch
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        toggleActive({ id: r._id });
                      }}
                      checked={r.active}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
