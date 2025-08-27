import { Infer, v } from 'convex/values';

export const themes = [
  'light',
  'dark',
  'system',
] as const;

export const themePreference = v.union(...themes.map(v.literal));

export type ThemePreference = Infer<typeof themePreference>;

// TODO: Move to front-end to enable translations
export const themeDisplayNames: Record<ThemePreference, string> = {
  'light': 'Light',
  'dark': 'Dark',
  'system': 'System',
};

// TODO: Move to front-end to enable translations
export const themeOptions = themes.map((key) => ({
  value: key,
  label: themeDisplayNames[key],
}));
