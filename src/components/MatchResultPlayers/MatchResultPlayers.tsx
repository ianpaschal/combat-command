import clsx from 'clsx';

import { IdentityBadge } from '~/components/IdentityBadge';
import { useMatchResult } from '~/components/MatchResultProvider';
import { useElementSize } from '~/hooks/useElementSize';

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

  return (
    <div className={clsx(styles.Root, className)} ref={ref} data-orientation={orientation}>
      <IdentityBadge
        className={styles.Player0Identity}
        size="large"
        user={matchResult.player0User}
        placeholder={{ displayName: matchResult.player0Placeholder }}
        flipped={orientation === 'horizontal'}
      />
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
        {matchResult.player0Score}
      </div>
      <div className={styles.Separator} />
      <IdentityBadge
        className={styles.Player1Identity}
        size="large"
        user={matchResult.player1User}
        placeholder={{ displayName: matchResult.player1Placeholder }}
      />
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
        {matchResult.player1Score}
      </div>
    </div>
  );
};
