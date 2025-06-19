import { Accordion, AccordionItem } from '~/components/generic/Accordion';
import { IdentityBadge } from '~/components/IdentityBadge';
import { TournamentCompetitorEditDialog } from '~/components/TournamentCompetitorEditDialog';
import { useTournamentCompetitors } from '~/components/TournamentCompetitorsProvider';
import { useTournament } from '~/components/TournamentProvider';
import { CompetitorActions } from '~/components/TournamentRoster/components/CompetitorActions';

import styles from './TournamentRoster.module.scss';

export interface TournamentRosterProps {
  className?: string;
}

export const TournamentRoster = ({
  className,
}: TournamentRosterProps): JSX.Element => {
  const { useTeams } = useTournament();
  const competitors = useTournamentCompetitors();
  return (
    <>
      <Accordion className={className}>
        {(competitors || []).map((competitor) => (
          <AccordionItem id={competitor._id} disabled={!useTeams} key={competitor._id}>
            <div className={styles.TournamentRoster_Header}>
              <IdentityBadge competitor={competitor} />
              <CompetitorActions competitor={competitor} />
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
