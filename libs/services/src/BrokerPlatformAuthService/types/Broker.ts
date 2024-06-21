export interface Broker {
  id: number;
  externalId: number;
  name: string;
  userId: number;
  federalId: string;
  susepId: number;
  user: {
    id: number;
    userName: string;
    userType: number;
    userTypeDescription: string;
  };
}
