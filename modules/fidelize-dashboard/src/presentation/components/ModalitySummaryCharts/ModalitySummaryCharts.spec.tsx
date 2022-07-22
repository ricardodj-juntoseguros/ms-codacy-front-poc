import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ModalityEnum } from 'modules/fidelize-dashboard/src/application/types/model';
import ModalitySummaryCharts from './ModalitySummaryCharts';

jest.mock('../SummaryChart', () => ({
  __esModule: true,
  default: () => {
    return <div />;
  },
}));

describe('ModalitySummaryCharts', () => {
  it('Should render all charts for modality FISCAL', () => {
    const { getByTestId } = render(
      <ModalitySummaryCharts modality={ModalityEnum.FISCAL} />,
    );
    expect(getByTestId('chart-fiscal-renewal-wrapper')).toBeInTheDocument();
    expect(
      getByTestId('chart-fiscal-substitution-wrapper'),
    ).toBeInTheDocument();
    expect(getByTestId('chart-fiscal-new-issues-wrapper')).toBeInTheDocument();
  });

  it('Should render renewal and substitution charts for modality LABOR', () => {
    const { getByTestId, queryByTestId } = render(
      <ModalitySummaryCharts modality={ModalityEnum.TRABALHISTA} />,
    );
    expect(getByTestId('chart-labor-renewal-wrapper')).toBeInTheDocument();
    expect(getByTestId('chart-labor-substitution-wrapper')).toBeInTheDocument();
    expect(
      queryByTestId('chart-labor-new-issues-wrapper'),
    ).not.toBeInTheDocument();
  });

  it('Should render nothing for modality CIVEL', () => {
    const { container } = render(
      <ModalitySummaryCharts modality={ModalityEnum.CIVIL} />,
    );
    expect(container.children.length).toBe(0);
  });
});
