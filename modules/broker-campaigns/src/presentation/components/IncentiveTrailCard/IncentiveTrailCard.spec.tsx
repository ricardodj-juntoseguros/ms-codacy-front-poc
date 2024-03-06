import '@testing-library/jest-dom';
import { formatDateString } from '@shared/utils';
import { fireEvent, render } from '../../../config/testUtils';
import { IncentiveTrailStepStatusEnum } from '../../../application/types/model';
import IncentiveTrailCard from './IncentiveTrailCard';

describe('IncentiveTrailCard', () => {
  const onToggleModalRedeemMock = jest.fn();

  it('should be able to render the available card', () => {
    const date = new Date().toISOString();
    const { getByText, getByTestId } = render(
      <IncentiveTrailCard
        expirationDate={date}
        onToggleModalRedeem={onToggleModalRedeemMock}
        productionGoal="R$ 150.000,00"
        status={IncentiveTrailStepStatusEnum.available}
        stepBonusValue="R$ 150,00"
        stepPercentage={100}
        valueLeft="R$ 0,00"
      />,
    );
    expect(getByText('R$ 150.000,00')).toBeInTheDocument();
    expect(getByText('R$ 150,00')).toBeInTheDocument();
    expect(getByText(`RESGATE ATÉ ${date}`)).toBeInTheDocument();
    expect(getByText('100%')).toBeInTheDocument();
    expect(getByTestId('incentiveTrailCard-button-redeem')).toBeInTheDocument();
  });

  it('should be able to render the unavailable card', async () => {
    const { getByText, queryByTestId } = render(
      <IncentiveTrailCard
        expirationDate={null}
        onToggleModalRedeem={onToggleModalRedeemMock}
        productionGoal="R$ 150.000,00"
        status={IncentiveTrailStepStatusEnum.unavailable}
        stepBonusValue="R$ 150,00"
        stepPercentage={0}
        valueLeft="R$ 150.000,00"
      />,
    );
    expect(getByText('R$ 150.000,00')).toBeInTheDocument();
    expect(getByText('R$ 150,00')).toBeInTheDocument();
    expect(getByText('0%')).toBeInTheDocument();
    expect(getByText('0%')).toHaveClass('j-tag__wrapper--error');
    expect(getByText(`FALTAM APENAS R$ 150.000,00`)).toBeInTheDocument();
    expect(
      await queryByTestId('incentiveTrailCard-button-redeem'),
    ).not.toBeInTheDocument();
  });

  it('should be able to render the expired card', async () => {
    const date = new Date().toISOString();
    const { getByText, queryByTestId } = render(
      <IncentiveTrailCard
        expirationDate={date}
        onToggleModalRedeem={onToggleModalRedeemMock}
        productionGoal="R$ 150.000,00"
        status={IncentiveTrailStepStatusEnum.expired}
        stepBonusValue="R$ 150,00"
        stepPercentage={50}
        valueLeft="R$ 75.000,00"
      />,
    );
    expect(getByText('R$ 150.000,00')).toBeInTheDocument();
    expect(getByText('R$ 150,00')).toBeInTheDocument();
    expect(getByText(`BÔNUS EXPIRADO EM ${date}`)).toBeInTheDocument();
    expect(getByText('50%')).toBeInTheDocument();
    expect(getByText('50%')).toHaveClass('j-tag__wrapper--warning');
    expect(
      await queryByTestId('incentiveTrailCard-button-redeem'),
    ).not.toBeInTheDocument();
  });

  it('should be able to render the paid card', async () => {
    const date = new Date().toISOString();
    const { getByText, queryByTestId } = render(
      <IncentiveTrailCard
        expirationDate={date}
        onToggleModalRedeem={onToggleModalRedeemMock}
        productionGoal="R$ 150.000,00"
        status={IncentiveTrailStepStatusEnum.paid}
        stepBonusValue="R$ 150,00"
        stepPercentage={100}
        valueLeft="R$ 0,00"
      />,
    );
    expect(getByText('R$ 150.000,00')).toBeInTheDocument();
    expect(getByText('R$ 150,00')).toBeInTheDocument();
    expect(getByText('RESGATE REALIZADO')).toBeInTheDocument();
    expect(getByText('100%')).toBeInTheDocument();
    expect(getByText('100%')).toHaveClass('j-tag__wrapper--success');
    expect(
      await queryByTestId('incentiveTrailCard-button-redeem'),
    ).not.toBeInTheDocument();
  });

  it('should be able to open redeem modal', () => {
    const { getByTestId } = render(
      <IncentiveTrailCard
        expirationDate={null}
        onToggleModalRedeem={onToggleModalRedeemMock}
        productionGoal="R$ 150.000,00"
        status={IncentiveTrailStepStatusEnum.available}
        stepBonusValue="R$ 150,00"
        stepPercentage={100}
        valueLeft="R$ 0,00"
      />,
    );
    fireEvent.click(getByTestId('incentiveTrailCard-button-redeem'));
    expect(onToggleModalRedeemMock).toHaveBeenCalled();
  });
});
