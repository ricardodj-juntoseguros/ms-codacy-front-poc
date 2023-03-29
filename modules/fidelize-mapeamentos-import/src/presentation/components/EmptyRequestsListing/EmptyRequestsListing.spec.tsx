import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { MappingStatusEnum } from 'modules/fidelize-mapeamentos-import/src/application/types/model';
import EmptyRequestsListing from './EmptyRequestsListing';

describe('EmptyRequestsListing', () => {
  it('Should display correct title and text for mappingStatus ON_QUEUE', () => {
    const { getByText } = render(
      <EmptyRequestsListing mappingStatus={MappingStatusEnum.ON_QUEUE} />,
    );
    expect(getByText('Não há registros de solicitações')).toBeInTheDocument();
    expect(
      getByText(
        'Faça uma nova solicitação de mapeamento de um tomador. O mesmo será enviado para a fila de mapeamento e apresentado aqui.',
      ),
    ).toBeInTheDocument();
  });

  it('Should display correct title and text for mappingStatus BLOCKED', () => {
    const { getByText } = render(
      <EmptyRequestsListing mappingStatus={MappingStatusEnum.BLOCKED} />,
    );
    expect(getByText('Não há registros de bloqueios')).toBeInTheDocument();
    expect(
      getByText(
        'Até o momento não há solicitações bloqueadas. Quando isso ocorrer os tomadores e motivos de bloqueio serão apresentados aqui.',
      ),
    ).toBeInTheDocument();
  });

  it('Should display correct title and text for mappingStatus DONE', () => {
    const { getByText } = render(
      <EmptyRequestsListing mappingStatus={MappingStatusEnum.DONE} />,
    );
    expect(getByText('Não há solicitações concluídas')).toBeInTheDocument();
    expect(
      getByText(
        'Até o momento não encontramos solicitações de mapeamentos concluídas. Quando isso ocorrer serão apresentadas aqui.',
      ),
    ).toBeInTheDocument();
  });
});
