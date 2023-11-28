import { Broker } from "@services";

export const brokerMock = {
  id: 1,
  externalId: 9999,
  name: 'Test',
  userId: 1,
  federalId: '9999',
  susepId: 0,
  user: {
    id: 1,
    userName: 'test',
    userType: 1,
    userTypeDescription: 'corretor',
  },
} as Broker;
