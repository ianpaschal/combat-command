import { CSSProperties } from 'react';
import { gray } from '@radix-ui/colors';

export const styles: Record<string, CSSProperties> = {
  body: {
    fontFamily: 'Figtree, sans-serif',
    padding: '16px',
  },
  callToAction: {
    backgroundColor: gray.gray12,
    borderRadius: '4px',
    color: 'white',
    display: 'inline-block',
    fontWeight: 500,
    padding: '8px 16px',
    textAlign: 'center',
    textDecoration: 'none',
  },
  description: {
    color: gray.gray11,
    fontSize: '14px',
    fontWeight: 300,
    lineHeight: '20px',
    textAlign: 'center',
  },
  footer: {
    color: gray.gray11,
    fontSize: '10px',
    lineHeight: '16px',
    textAlign: 'center',
  },
  header: {
    color: gray.gray12,
    fontSize: '20px',
    lineHeight: '24px',
    textAlign: 'center',
  },
  logo: {
    color: gray.gray12,
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
    backgroundColor: 'white',
    borderColor: gray.gray4,
    borderRadius: '8px',
    borderStyle: 'solid',
    borderWidth: '1px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    justifyContent: 'center',
    padding: '24px',
  },
};
