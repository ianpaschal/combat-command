import { createAccount } from '@convex-dev/auth/server';

import { ActionCtx } from '../../../_generated/server';
import { userEmails } from '../_helpers/testUsers';

const countryCodes = [
  'at',
  'au',
  'be',
  'ca',
  'ch',
  'de',
  'dk',
  'es',
  'fi',
  'fr',
  'gb-eng',
  'gb-nir',
  'gb-sct',
  'gb-wls',
  'gr',
  'ie',
  'is',
  'it',
  'nl',
  'nz',
  'pl',
  'pt',
  'ro',
  'se',
  'us',
];

export const populateUsers = async (ctx: ActionCtx): Promise<void> => {
  for (const email of userEmails) {
    const [givenName, familyName] = email.split('.').map((str) => str[0].toUpperCase()+str.substring(1));
    await createAccount(ctx, {
      provider: 'password',
      account: {
        id: email,
        secret: 'test1234',
      },
      profile: {
        countryCode: countryCodes[Math.floor(Math.random() * countryCodes.length)],
        email,
        familyName,
        givenName,
        locationVisibility: 'hidden',
        nameVisibility: 'hidden',
        username: `${givenName}_${familyName.substring(0,1)}`.toLowerCase(),
      },
    });
  }
};
