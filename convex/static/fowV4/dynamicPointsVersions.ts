import { Infer, v } from 'convex/values';

import { FowV4EraId } from './eras';

export type FowV4DynamicPointsVersion = {
  id: string;
  displayName: string;
  publishedAt: string;
  activeAt: string;
  eraId: FowV4EraId;
};

export const dynamicPointsVersions: FowV4DynamicPointsVersion[] = [
  {
    id: 'flames_of_war_v4::dynamic_points_version::2023_02_09',
    displayName: '2023',
    publishedAt: '2023-02-09T13:00:00+13:00',
    activeAt: '2023-02-09T13:00:00+13:00',
    eraId: 'flames_of_war_v4::era::mid_war',
  },
  {
    id: 'flames_of_war_v4::dynamic_points_version::2023_12_20',
    displayName: '2024',
    publishedAt: '2023-12-20T13:00:00+13:00',
    activeAt: '2024-01-01T13:00:00+13:00',
    eraId: 'flames_of_war_v4::era::mid_war',
  },
  {
    id: 'flames_of_war_v4::dynamic_points_version::2024_12_13',
    displayName: '2025',
    publishedAt: '2024-12-13T13:00:00+13:00',
    activeAt: '2025-01-01T13:00:00+13:00',
    eraId: 'flames_of_war_v4::era::mid_war',
  },
] as const;

export const fowV4DynamicPointsVersionOptions = dynamicPointsVersions.map((version) => ({
  value: version.id,
  label: version.displayName,
}));
// TODO: Sort by date
// TODO: Fetch by era

export const fowV4DynamicPointsVersionId = v.union(...dynamicPointsVersions.map(({ id }) => v.literal(id)));

export type FowV4DynamicPointsVersionId = Infer<typeof fowV4DynamicPointsVersionId>;
