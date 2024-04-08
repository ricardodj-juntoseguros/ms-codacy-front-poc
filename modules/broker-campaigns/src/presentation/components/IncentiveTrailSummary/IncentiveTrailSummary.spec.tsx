import '@testing-library/jest-dom';
import { add } from 'date-fns';
import { ProfileEnum } from '@services';
import { render } from '../../../config/testUtils';
import IncentiveTrailSummary from './IncentiveTrailSummary';

describe('IncentiveTrailSummary', () => {
  const onToogleAcceptModalMock = jest.fn();

  it('should be able to show accumulated value', async () => {
    const { getByText } = render(
      <IncentiveTrailSummary
        isAccept
        loading={false}
        onToogleAcceptModal={onToogleAcceptModalMock}
        dateLimitToAccept={new Date().toISOString()}
        accumulatedValue="R$ 150.000,00"
        dateStart={new Date(2024, 11, 17).toISOString()}
        profile={ProfileEnum.BROKER}
      />,
    );
    expect(getByText('R$ 150.000,00')).toBeInTheDocument();
  });

  it('should be able to show accumulated value skeleton', async () => {
    const { queryByText } = render(
      <IncentiveTrailSummary
        isAccept
        loading
        onToogleAcceptModal={onToogleAcceptModalMock}
        accumulatedValue="R$ 150.000,00"
        dateStart={new Date(2024, 11, 17).toISOString()}
        profile={ProfileEnum.BROKER}
      />,
    );
    expect(await queryByText('R$ 150.000,00')).not.toBeInTheDocument();
  });

  it('should be able to show alert to accept', async () => {
    const { getByTestId } = render(
      <IncentiveTrailSummary
        isAccept={false}
        loading={false}
        dateLimitToAccept={add(new Date(), { days: 1 }).toISOString()}
        onToogleAcceptModal={onToogleAcceptModalMock}
        accumulatedValue="R$ 150.000,00"
        dateStart={new Date(2024, 11, 17).toISOString()}
        profile={ProfileEnum.BROKER}
      />,
    );
    expect(getByTestId('alert-linkButton')).toBeInTheDocument();
  });

  it('should be able to not show alert to accept', async () => {
    const { queryByTestId } = render(
      <IncentiveTrailSummary
        isAccept={false}
        loading={false}
        dateLimitToAccept={new Date(2024, 2, 6).toISOString()}
        onToogleAcceptModal={onToogleAcceptModalMock}
        accumulatedValue="R$ 150.000,00"
        dateStart={new Date(2024, 11, 17).toISOString()}
        profile={ProfileEnum.BROKER}
      />,
    );
    expect(await queryByTestId('alert-linkButton')).not.toBeInTheDocument();
  });
});
