import clsx from 'clsx';

import { Avatar } from '~/components/generic/Avatar';
import { useMatchResult } from '~/components/MatchResultProvider';
import { useElementSize } from '~/hooks/useElementSize';
import { getUserDisplayNameReact } from '~/utils/common/getUserDisplayNameReact';
import { calculateMatchScore } from '~/utils/flamesOfWarV4Utils/calculateMatchScore';

import styles from './MatchResultPlayers.module.scss';

export interface MatchResultPlayersProps {
  className?: string;
}

export const MatchResultPlayers = ({
  className,
}: MatchResultPlayersProps): JSX.Element => {
  const matchResult = useMatchResult();
  const [ref, width] = useElementSize();
  const orientation = Math.ceil(width) < 640 ? 'vertical' : 'horizontal'; // 2 x 320 + 1rem - 2x border

  const player0Name = matchResult.player0User ? getUserDisplayNameReact(matchResult.player0User) : matchResult.player0Placeholder;
  const player1Name = matchResult.player1User ? getUserDisplayNameReact(matchResult.player1User) : matchResult.player1Placeholder;

  const [player0Score, player1Score] = calculateMatchScore(matchResult.details);

  return (
    <div className={clsx(styles.Root, className)} ref={ref} data-orientation={orientation}>
      <Avatar
        className={styles.Player0Avatar}
        url={matchResult.player0User?.avatarUrl}
      />
      <div className={styles.Player0Name}>
        {player0Name}
      </div>
      {/* TODO: Add factions  */}
      {/* <Popover.Root>
        <Popover.Trigger asChild>
          <Button className={styles.Player0Faction} size="small" round muted>
            A
          </Button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className={styles.FactionDetails} align="start">
            FOO
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root> */}
      <div className={styles.Player0Score}>
        {player0Score}
      </div>
      <div className={styles.Separator} />
      <Avatar
        className={styles.Player1Avatar}
        url={matchResult.player1User?.avatarUrl}
      />
      <div className={styles.Player1Name}>
        {player1Name}
      </div>
      {/* TODO: Add factions  */}
      {/* <Popover.Root>
        <Popover.Trigger asChild>
          <Button className={styles.Player1Faction} size="small" round muted>
            A
          </Button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className={styles.FactionDetails} align="start">
            FOO
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root> */}
      <div className={styles.Player1Score}>
        {player1Score}
      </div>
    </div>
  );
};
