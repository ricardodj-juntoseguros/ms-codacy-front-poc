import { render } from '@testing-library/react';
import { ModalityEnum } from '../../../application/types/model';
import ModalitySummary from './ModalitySummary';

describe('Modality Summary', () => {
  it('Should render fiscal accordingly to props', () => {
    const { getByText } = render(
      <ModalitySummary
        modality={ModalityEnum.FISCAL}
        totalInsuredValue={6500000}
        totalOpportunities={237580}
        hasError={false}
      />,
    );

    expect(getByText('Op. fiscais')).toBeTruthy();
    expect(getByText('237.580')).toBeTruthy();
    expect(getByText('Importância segurada')).toBeTruthy();
    expect(getByText('R$ 6,5 milhões')).toBeTruthy();
  });

  it('Should render civel accordingly to props', () => {
    const { getByText } = render(
      <ModalitySummary
        modality={ModalityEnum.CIVIL}
        totalInsuredValue={6500000}
        totalOpportunities={237580}
        hasError={false}
      />,
    );

    expect(getByText('Op. cíveis')).toBeTruthy();
    expect(getByText('237.580')).toBeTruthy();
    expect(getByText('Importância segurada')).toBeTruthy();
    expect(getByText('R$ 6,5 milhões')).toBeTruthy();
  });

  it('Should render labor accordingly to props', () => {
    const { getByText } = render(
      <ModalitySummary
        modality={ModalityEnum.TRABALHISTA}
        totalInsuredValue={6500000}
        totalOpportunities={237580}
        hasError={false}
      />,
    );

    expect(getByText('Op. trabalhistas')).toBeTruthy();
    expect(getByText('237.580')).toBeTruthy();
    expect(getByText('Importância segurada aproximada')).toBeTruthy();
    expect(getByText('R$ 6,5 milhões')).toBeTruthy();
  });

  it('Should render placeholder if there is no opportunities', () => {
    const { getByText } = render(
      <ModalitySummary
        modality={ModalityEnum.TRABALHISTA}
        totalInsuredValue={0}
        totalOpportunities={0}
        hasError={false}
      />,
    );

    expect(getByText('Não há oportunidades trabalhistas')).toBeTruthy();
    expect(
      getByText(
        'Até o momento não foram encontradas oportunidades no âmbito trabalhista para o(s) tomador(es) selecionado(s).',
      ),
    ).toBeTruthy();
  });

  it('Should render error message if hasError is tru', () => {
    const { getByText } = render(
      <ModalitySummary
        modality={ModalityEnum.TRABALHISTA}
        totalInsuredValue={6500000}
        totalOpportunities={237580}
        hasError
      />,
    );

    expect(
      getByText(
        'Opa! Ocorreu um erro inesperado ao carregar esta seção. Por favor, tente novamente.',
      ),
    ).toBeTruthy();
  });
});
