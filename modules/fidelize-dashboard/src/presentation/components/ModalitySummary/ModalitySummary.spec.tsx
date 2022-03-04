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
      />,
    );

    expect(getByText('Op. trabalhistas')).toBeTruthy();
    expect(getByText('237.580')).toBeTruthy();
    expect(getByText('Importância segurada')).toBeTruthy();
    expect(getByText('R$ 6,5 milhões')).toBeTruthy();
  });
});
