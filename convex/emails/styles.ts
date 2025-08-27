import { CSSProperties } from 'react';
import { gray } from '@radix-ui/colors';

export const styles: Record<string, CSSProperties> = {
  body: {
    fontFamily: 'Figtree, sans-serif',
    padding: '16px',
    backgroundColor: gray.gray2,
  },
  callToAction: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: gray.gray12,
    color: 'white',
    borderRadius: '4px',
    textDecoration: 'none',
  },
  description: {
    color: gray.gray11,
    fontSize: '14px',
    fontWeight: 300,
    lineHeight: '20px',
  },
  footer: {
    color: gray.gray11,
    fontSize: '10px',
    lineHeight: '16px',
  },
  header: {
    color: gray.gray12,
    fontSize: '20px',
    lineHeight: '24px',
  },
  logo: {
    fill: gray.gray12,
  },
  token: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: '2px',
    justifyContent: 'center',
  },
  tokenCharacter: {
    color: gray.gray12,
    display: 'block',
    fontSize: '40px',
    fontWeight: 500,
    lineHeight: '32px',
  },
  wrapper: {
    alignItems: 'center',
    borderColor: gray.gray4,
    borderRadius: '16px',
    borderStyle: 'solid',
    borderWidth: '1px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    justifyContent: 'center',
    padding: '24px',
  },
};
