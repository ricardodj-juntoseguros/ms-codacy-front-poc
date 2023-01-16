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
    expect(getByTestId('chart-fiscal-new-issue-wrapper')).toBeInTheDocument();
  });

  it('Should render all charts for modality LABOR', () => {
    const { getByTestId } = render(
      <ModalitySummaryCharts modality={ModalityEnum.LABOR} />,
    );
    expect(getByTestId('chart-labor-renewal-wrapper')).toBeInTheDocument();
    expect(getByTestId('chart-labor-substitution-wrapper')).toBeInTheDocument();
    expect(getByTestId('chart-labor-new-issue-wrapper')).toBeInTheDocument();
  });

  it('Should render all charts for modality CIVEL', () => {
    const { getByTestId } = render(
      <ModalitySummaryCharts modality={ModalityEnum.CIVIL} />,
    );
    expect(getByTestId('chart-civil-renewal-wrapper')).toBeInTheDocument();
    expect(getByTestId('chart-civil-substitution-wrapper')).toBeInTheDocument();
  });
});
