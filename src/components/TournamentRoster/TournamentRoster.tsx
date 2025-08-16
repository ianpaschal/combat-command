import { Accordion, AccordionItem } from '~/components/generic/Accordion';
import { IdentityBadge } from '~/components/IdentityBadge';
import { TournamentCompetitorEditDialog } from '~/components/TournamentCompetitorEditDialog';
import { useTournamentCompetitors } from '~/components/TournamentCompetitorsProvider';
import { useTournament } from '~/components/TournamentProvider';
import { CompetitorActions } from '~/components/TournamentRoster/components/CompetitorActions';
import { PlayerCount } from '~/components/TournamentRoster/components/PlayerCount';

import styles from './TournamentRoster.module.scss';

export interface TournamentRosterProps {
  className?: string;
}

export const TournamentRoster = ({
  className,
}: TournamentRosterProps): JSX.Element => {
  const { useTeams, competitorSize } = useTournament();
  const competitors = useTournamentCompetitors();
  return (
    <>
      <Accordion className={className}>
        {(competitors || []).map((competitor) => (
          <AccordionItem id={competitor._id} disabled={!useTeams} key={competitor._id}>
            <div className={styles.TournamentRoster_Header}>
              <IdentityBadge className={styles.TournamentRoster_Identity} competitor={competitor} />
              {useTeams && (
                <PlayerCount className={styles.TournamentRoster_PlayerCount} competitorSize={competitorSize} competitor={competitor} />
              )}
              <CompetitorActions className={styles.TournamentRoster_Actions} competitor={competitor} />
            </div>
            <div className={styles.TournamentRoster_Content}>
              {competitor.registrations.filter((r) => r.active).map((r) => (
                <IdentityBadge key={r.user?._id} user={r.user} size="small" />
              ))}
            </div>
          </AccordionItem>
        ))}
      </Accordion>
      <TournamentCompetitorEditDialog />
    </>
  );
};
