import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '../../../config/testUtils';
import { IncentiveTrailStepStatusEnum } from '../../../application/types/model';
import IncentiveTrailList from './IncentiveTrailList';

describe('IncentiveTrailList', () => {
  const stepsMock = [
    {
      stepBonusValue: 'R$ 150,00',
      productionGoal: 'R$ 150.000,00',
      stepPercentage: 100,
      status: IncentiveTrailStepStatusEnum.available,
      valueLeft: 'R$ 0,00',
      expirationDate: new Date().toISOString(),
    },
  ];

  it('should be able to render step list', () => {
    const { getByText, getByTestId, queryByTestId } = render(
      <IncentiveTrailList steps={stepsMock} loading={false} />,
    );
    const redeemButton = getByTestId('incentiveTrailCard-button-redeem');
    expect(getByText('R$ 150.000,00')).toBeInTheDocument();
    expect(getByText('R$ 150,00')).toBeInTheDocument();
    expect(getByText('100%')).toBeInTheDocument();
    expect(redeemButton).toBeInTheDocument();
    fireEvent.click(redeemButton);
    waitFor(async () => {
      expect(
        await queryByTestId('incentiveTrailAcceptModal-form'),
      ).toBeInTheDocument();
    });
  });

  it('should be able to render step list skeleton', () => {
    const { getByTestId } = render(
      <IncentiveTrailList steps={stepsMock} loading />,
    );
    expect(
      getByTestId('incentiveTrailListSkeleton-wrapper'),
    ).toBeInTheDocument();
  });
});
