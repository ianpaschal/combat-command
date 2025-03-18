import { Infer, v } from 'convex/values';

export type FowV4Era = {
  id: string;
  displayName: string;
  shortName: string;
};

export const fowV4Eras: FowV4Era[] = [
  {
    id: 'flames_of_war_v4::era::early_war',
    displayName: 'Early War',
    shortName: 'EW',
  },
  {
    id: 'flames_of_war_v4::era::mid_war',
    displayName: 'Mid-War',
    shortName: 'MW',
  },
  {
    id: 'flames_of_war_v4::era::late_war',
    displayName: 'Late War',
    shortName: 'LW',
  },
  {
    id: 'flames_of_war_v4::era::late_war_leviathans',
    displayName: 'Late War: Leviathans',
    shortName: 'LWL',
  },
] as const;

export const fowV4EraOptions = fowV4Eras.map((era) => ({
  value: era.id,
  label: era.displayName,
}));

export const fowV4EraId = v.union(...fowV4Eras.map(({ id }) => v.literal(id)));

export type FowV4EraId = Infer<typeof fowV4EraId>;
