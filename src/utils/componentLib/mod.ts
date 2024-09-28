import { ElementIntent, ElementVariant } from '~/types/componentLib';

export const mod = ({
  variant,
  intent,
  muted = false,
}: {
  variant: ElementVariant;
  intent?: ElementIntent;
  muted?: boolean;
}): string => {
  if (variant === 'ghost' && (intent || muted)) {
    console.warn('Elements with the style "ghost" cannot have an intent or be muted.');
  }
  if (intent && variant !== 'ghost') {
    return `-${variant}-${intent}`;
  }
  if (muted && variant !== 'ghost') {
    return `-${variant}-muted`;
  }
  return `-${variant}`;
};
