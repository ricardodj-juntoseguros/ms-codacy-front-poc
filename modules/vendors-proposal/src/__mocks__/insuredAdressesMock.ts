import { InsuredAddressDTO } from '../application/types/dto';

export const insuredAddressesMock = [
  {
    externalId: 1,
    city: 'CURITIBA',
    state: 'PR',
    street: 'Rua XV de Novembro, 1',
    addressId: 0,
    addressExternalId: 1,
  },
  {
    externalId: 2,
    city: 'SÃO PAULO',
    state: 'PR',
    street: 'Rua 25 de Março, 299',
    addressId: 0,
    addressExternalId: 2,
  },
  {
    externalId: 3,
    city: 'RIO DE JANEIRO',
    state: 'RJ',
    street: 'Av. Copacabana, 1200',
    addressId: 0,
    addressExternalId: 3,
  },
] as InsuredAddressDTO[];
