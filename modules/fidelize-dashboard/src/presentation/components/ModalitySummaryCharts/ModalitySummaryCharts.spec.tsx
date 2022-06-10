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
  it('Should render only renewal chart for modality FISCAL', () => {
    const { getByTestId, container } = render(
      <ModalitySummaryCharts modality={ModalityEnum.FISCAL} />,
    );
    expect(container.children.length).toBe(1);
    expect(getByTestId('chart-fiscal-renewal-wrapper')).toBeInTheDocument();
  });

  it('Should render nothing for modality LABOR', () => {
    const { container } = render(
      <ModalitySummaryCharts modality={ModalityEnum.TRABALHISTA} />,
    );
    expect(container.children.length).toBe(0);
  });

  it('Should render nothing for modality CIVEL', () => {
    const { container } = render(
      <ModalitySummaryCharts modality={ModalityEnum.CIVIL} />,
    );
    expect(container.children.length).toBe(0);
  });
});
