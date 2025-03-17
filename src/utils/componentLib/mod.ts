import { ElementIntent, ElementVariant } from '~/types/componentLib';

export const mod = ({
  variant,
  intent,
  muted = false,
  inverted = false,
}: {
  variant: ElementVariant;
  intent?: ElementIntent;
  muted?: boolean;
  inverted?: boolean;
}): string => {
  if (variant === 'ghost' && (intent || muted)) {
    console.warn('Elements with the style "ghost" cannot have an intent or be muted.');
  }

  let classSuffix = `-${variant}`;

  if (intent) {
    classSuffix += `-${intent}`;
  }
  if (muted) {
    classSuffix += '-muted';
  }
  if (inverted) {
    classSuffix += '-inverted';
  }
  return classSuffix;
};
