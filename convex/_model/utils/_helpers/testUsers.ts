import { VisibilityLevel } from '../../common/types';

export const userEmails = [
  'alex.carter.cc.3phf3@passmail.net',
  'alice.clark.cc.74cyr@passmail.net',
  'benjamin.davis.cc.rrvwl@passmail.net',
  'brooke.dawson.cc.8yh4p@passmail.net',
  'caleb.everett.cc.mhx09@passmail.net',
  'clara.evans.cc.z3gz6@passmail.net',
  'daniel.fredricks.cc.6la7w@passmail.net',
  'diana.foster.cc.n959f@passmail.net',
  'emma.garcia.cc.3c7o2@passmail.net',
  'ethan.grayson.cc.a4fhy@passmail.net',
  'felix.hughes.cc.gt9cu@passmail.net',
  'fiona.hayes.cc.pozyc@passmail.net',
  'gavin.irwin.cc.b0aqn@passmail.net',
  'grace.iverson.cc.rtnrt@passmail.net',
  'henry.johnson.cc.22yxt@passmail.net',
  'holly.jensen.cc.r853z@passmail.net',
  'iris.kim.cc.q2ffo@passmail.net',
  'isaac.kent.cc.245nz@passmail.net',
  'james.lopez.cc.xbnuf@passmail.net',
  'jasmine.lewis.cc.z2eud@passmail.net',
  'kate.martin.cc.xslf4@passmail.net',
  'kevin.mitchell.cc.m37gp@passmail.net',
  'lena.nichols.cc.3x8af@passmail.net',
  'leo.nguyen.cc.5zo9c@passmail.net',
  'mason.owens.cc.8eq53@passmail.net',
  'maya.owens.cc.ndj7d@passmail.net',
  'nathan.patel.cc.6633f@passmail.net',
  'nina.parker.cc.ts6sa@passmail.net',
  'oliver.quinn.cc.btdxk@passmail.net',
  'olivia.quintana.cc.2ae2h@passmail.net',
  'penny.roberts.cc.wkdvp@passmail.net',
  'peter.robinson.cc.9tu5d@passmail.net',
  'quincy.stevens.cc.v1oyr@passmail.net',
  'quinn.smith.cc.xy5wp@passmail.net',
  'rachel.turner.cc.i4ryf@passmail.net',
  'ryan.taylor.cc.48ajd@passmail.net',
  'samuel.uriah.cc.grwpd@passmail.net',
  'sophia.underwood.cc.vix64@passmail.net',
  'thomas.vasquez.cc.au3yf@passmail.net',
  'tina.vaughn.cc.ru7fd@passmail.net',
  'ulysses.wexler.cc.kbzo2@passmail.net',
  'uma.walker.cc.50mi8@passmail.net',
  'victor.xu.cc.vp535@passmail.net',
  'victoria.xiong.cc.74qz4@passmail.net',
  'wesley.young.cc.e6194@passmail.net',
  'willow.yates.cc.zkerj@passmail.net',
  'xavier.zimmerman.cc.je4c0@passmail.net',
  'ximena.zapata.cc.cfhur@passmail.net',
  'yara.anderson.cc.s7kux@passmail.net',
  'yves.allier.cc.2p43t@passmail.net',
  'zach.brown.cc.5w54m@passmail.net',
  'zoe.burns.cc.a4iv8@passmail.net',
];

type CreateUserDataOutput = {
  countryCode: string;
  email: string;
  familyName: string;
  givenName: string;
  locationVisibility: VisibilityLevel;
  nameVisibility: VisibilityLevel;
  username: string;
};

export const createUserData = (email: string): CreateUserDataOutput => {
  const [givenName, familyName] = email.split('.').map((str) => str[0].toUpperCase()+str.substring(1));
  return {
    countryCode: 'gb',
    email,
    familyName,
    givenName,
    locationVisibility: 0,
    nameVisibility: 0,
    username: `${givenName}_${familyName.substring(0,1)}`.toLowerCase(),
  };
};
