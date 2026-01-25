import { RatioBar, RatioBarSection } from '@ianpaschal/combat-command-components';
import { GameSystem } from '@ianpaschal/combat-command-game-systems/common';
import { Alignment as FlamesOfWarV4 } from '@ianpaschal/combat-command-game-systems/flamesOfWarV4';
import { Alignment as TeamYankeeV2 } from '@ianpaschal/combat-command-game-systems/teamYankeeV2';
import {
  blue,
  blueDark,
  gray,
  grayDark,
  purple,
  purpleDark,
  tomato,
  tomatoDark,
} from '@radix-ui/colors';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

import { Alignment } from '~/api';
import { useTheme } from '~/components/ThemeProvider';
import { useTournament } from '~/components/TournamentProvider';
import { useGetTournamentRegistrationsByTournament } from '~/services/tournamentRegistrations';

import styles from './AlignmentGraph.module.scss';

export interface AlignmentGraphProps {
  className?: string;
}

export const AlignmentGraph = ({
  className,
}: AlignmentGraphProps): JSX.Element => {
  const { theme } = useTheme();
  const tournament = useTournament();

  const { blue9: themeBlue } = theme === 'dark' ? blueDark : blue;
  const { purple9: themePurple } = theme === 'dark' ? purpleDark : purple;
  const { tomato9: themeRed } = theme === 'dark' ? tomatoDark : tomato;
  const { gray3: themeGray } = theme === 'dark' ? grayDark : gray;

  const { data: tournamentRegistrations, loading } = useGetTournamentRegistrationsByTournament({
    tournamentId: tournament._id,
  });

  let leftLabel = '';
  let rightLabel = '';
  const sections: RatioBarSection[] = [];

  // Show loading state as a pale grey bar
  if (loading || tournamentRegistrations === undefined) {
    sections.push({
      label: 'Loading',
      value: 1,
      color: themeGray,
    });
  } else {
    const alignmentGroups = tournamentRegistrations.reduce((acc, { alignments }) => {
      if (alignments.length) {
        for (const alignment of alignments) {
          acc[alignment] = (acc[alignment] ?? 0) + 1;
        }
      } else {
        acc['unknown'] = (acc['unknown'] ?? 0) + 1;
      }

      return acc;
    }, {} as Partial<Record<Alignment | 'unknown', number>>);

    if (tournament.gameSystem === GameSystem.FlamesOfWarV4) {
      leftLabel = 'Allies';
      rightLabel = 'Axis';
      sections.push(...[
        {
          label: leftLabel,
          value: alignmentGroups[FlamesOfWarV4.Allies] ?? 0,
          color: themeBlue,
        },
        {
          label: 'Flexible',
          value: alignmentGroups[FlamesOfWarV4.Flexible] ?? 0,
          color: themePurple,
        },
        {
          label: rightLabel,
          value: alignmentGroups[FlamesOfWarV4.Axis] ?? 0,
          color: themeRed,
        },
      ]);
    }

    if (tournament.gameSystem === GameSystem.TeamYankeeV2) {
      leftLabel = 'NATO';
      rightLabel = 'Warsaw Pact';
      sections.push(...[
        {
          label: leftLabel,
          value: alignmentGroups[TeamYankeeV2.Nato] ?? 0,
          color: themeBlue,
        },
        {
          label: 'Flexible',
          value: alignmentGroups[TeamYankeeV2.Flexible] ?? 0,
          color: themePurple,
        },
        {
          label: rightLabel,
          value: alignmentGroups[TeamYankeeV2.WarsawPact] ?? 0,
          color: themeRed,
        },
      ]);
    }

    sections.push({
      label: 'Unknown',
      value: alignmentGroups['unknown'] ?? 0,
      color: themeGray,
    });
  }

  return (
    <div className={clsx(styles.AlignmentGraph, className)}>
      <h3 className={styles.AlignmentGraph_AnchorLeft}>{leftLabel}</h3>
      <ChevronDown className={styles.AlignmentGraph_CenterMark} absoluteStrokeWidth strokeWidth={3} />
      <h3 className={styles.AlignmentGraph_AnchorRight}>{rightLabel}</h3>
      <RatioBar className={styles.AlignmentGraph_Graph} sections={sections} />
    </div>
  );
};
