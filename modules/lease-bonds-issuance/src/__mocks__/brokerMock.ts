import { Broker } from "@services";

export const brokerMock = {
  id: 1,
  externalId: 9999,
  name: 'Test',
  userId: 1,
  federalId: '06465132135429',
  susepId: 0,
  user: {
    id: 1,
    userName: 'test',
    userType: 1,
    userTypeDescription: 'corretor',
  },
} as Broker;
