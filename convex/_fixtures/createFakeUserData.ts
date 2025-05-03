import { faker } from '@faker-js/faker';

import { Doc } from '../_generated/dataModel';

faker.seed(100); // Ensure the same data is generated every time

export function createFakeUserData(): Omit<Doc<'users'>, '_id'|'_creationTime'> {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    countryCode: faker.location.countryCode('alpha-2'),
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    familyName: lastName,
    givenName: firstName,
    locationVisibility: 'hidden',
    nameVisibility: 'hidden',
    username: faker.internet.username({ firstName, lastName }).toLowerCase(),
  };
}
