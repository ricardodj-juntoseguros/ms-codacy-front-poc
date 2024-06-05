import { InternalizeDocumentsDTO } from '../application/types/dto';

export const internalizeDocumentsBidderMock: InternalizeDocumentsDTO[] = [
  {
    documentId: 8,
    name: 'Edital de licitação',
    description:
      'Edital de Licitação com todos os anexos ou a Carta Convite Minuta do Contrato',
    required: true,
  },
  {
    documentId: 9,
    name: 'Minuta do Termo de Constituição',
    description:
      'Em caso de consórcio, envie a Minuta do Termo de Constituição de Consórcio ou da SPE',
    required: true,
  },
];
