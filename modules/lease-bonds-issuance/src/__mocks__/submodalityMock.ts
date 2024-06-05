import { SubmodalityDTO } from '../application/types/dto';

export const submodalityMock = {
  id: 1,
  newQuoterId: 1,
  description: 'Trabalhista',
  useBill: true,
  isSubstitute: false,
  isRecursal: false,
  payments: [
    {
      id: 1,
      description: 'Boleto',
    },
  ],
  appealJudicialPremium: null,
} as SubmodalityDTO;
