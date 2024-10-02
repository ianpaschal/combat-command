import { z, ZodLiteral } from 'zod';

import { InputSelectItem } from '~/components/generic/InputSelect/InputSelect';

export const fowV4BookSchema = z.union([
  z.literal('lw_bagration_axis_allies'),
  z.literal('lw_bagration_german'),
  z.literal('lw_bagration_soviet'),
  z.literal('lw_berlin_german'),
  z.literal('lw_berlin_soviet'),
  z.literal('lw_bulge_american'),
  z.literal('lw_bulge_british'),
  z.literal('lw_bulge_german'),
  z.literal('lw_d_day_american'),
  z.literal('lw_d_day_british'),
  z.literal('lw_d_day_german'),
  z.literal('lw_d_day_waffen_ss'),
  z.literal('lw_fortress_europe'),
  z.literal('mw_africa_american'),
  z.literal('mw_africa_british'),
  z.literal('mw_africa_german'),
  z.literal('mw_africa_italian'),
  z.literal('mw_africa_american_airborne'),
  z.literal('mw_africa_axis_airborne'),
  z.literal('mw_eastern_front_german_1942'),
  z.literal('mw_eastern_front_soviet_1942'),
  z.literal('mw_eastern_front_german_1943'),
  z.literal('mw_eastern_front_soviet_1943'),
  z.literal('mw_eastern_front_finnish'),
  z.literal('mw_eastern_front_romanian'),
  z.literal('mw_eastern_front_hungarian'),
]);

export type FowV4Book = z.infer<typeof fowV4BookSchema>;

export const fowV4BookLabels: Record<FowV4Book, string> = {
  lw_bagration_axis_allies: 'Bagration: Axis-Allies',
  lw_bagration_german: 'Bagration: German',
  lw_bagration_soviet: 'Bagration: Soviet',
  lw_berlin_german: 'Berlin: German',
  lw_berlin_soviet: 'Berlin: Soviet',
  lw_bulge_american: 'Bulge: American',
  lw_bulge_british: 'Bulge: British',
  lw_bulge_german: 'Bulge: German',
  lw_d_day_american: 'D-Day: American',
  lw_d_day_british: 'D-Day: British',
  lw_d_day_german: 'D-Day: German',
  lw_d_day_waffen_ss: 'D-Day: Waffen-SS',
  lw_fortress_europe: 'Fortress Europe',
  mw_africa_american: 'Fighting First',
  mw_africa_british: 'Armoured Fist',
  mw_africa_german: 'Afrika Korps',
  mw_africa_italian: 'Avanti',
  mw_africa_american_airborne: 'All American',
  mw_africa_axis_airborne: 'Death from Above',
  mw_eastern_front_german_1942: 'Iron Cross',
  mw_eastern_front_soviet_1942: 'Enemy at the Gates',
  mw_eastern_front_german_1943: 'Ghost Panzers',
  mw_eastern_front_soviet_1943: 'Red Banner',
  mw_eastern_front_finnish: 'White Death',
  mw_eastern_front_romanian: 'Brave Romania',
  mw_eastern_front_hungarian: 'Hungarian Steel',
};

export const fowV4BookOptions: InputSelectItem[] = fowV4BookSchema.options.filter(
  (option) => option instanceof ZodLiteral,
).map(
  ({ value }) => ({ value, label: fowV4BookLabels[value] }),
);