import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import selectEvent from 'react-select-event';

import {
  RateFlexCalculation,
  RateFlexCalculationProps,
} from './RateFlexCalculation';

describe('RateFlexCalculation.spec', () => {
  const onChangeFeeFlex = jest.fn();
  const onChangeComissionFlex = jest.fn();
  const handleChangeRateFlexVisible = jest.fn();
  const onGoNextStep = jest.fn();

  let propsMock: RateFlexCalculationProps = {} as RateFlexCalculationProps;

  beforeEach(() => {
    propsMock = {
      onChangeFeeFlex,
      onChangeComissionFlex,
      handleChangeRateFlexVisible,
      onGoNextStep,
      maxRate: 1,
      feeFlexValue: 0,
      commissionFlexValue: 0,
      rateFlexVisible: false,
      feeFlexEnabled: true,
    };
  });

  it('should render successfully with the default properties', () => {
    const { baseElement } = render(<RateFlexCalculation {...propsMock} />);
    expect(baseElement).toBeInTheDocument();
  });

  it('should call the handleChangeRateFlexVisible when button is clicked', () => {
    const { getByTestId } = render(<RateFlexCalculation {...propsMock} />);

    const button = getByTestId('button-rate-flex-visible');
    fireEvent.click(button);

    expect(handleChangeRateFlexVisible).toHaveBeenCalledTimes(1);
  });

  it('should call the handleChangeStandardRateFlex when the search input is changed', () => {
    propsMock.rateFlexVisible = true;
    const { getByTestId } = render(<RateFlexCalculation {...propsMock} />);

    const input = getByTestId('input-rate-flex');
    fireEvent.change(input, { target: { value: 100 } });

    expect(onChangeFeeFlex).toHaveBeenCalledWith(100);
  });

  it('should call the handleChangeRateFlexVisible when button is clicked', () => {
    propsMock.rateFlexVisible = true;
    const { getByTestId } = render(<RateFlexCalculation {...propsMock} />);

    const button = getByTestId('button-rate-flex-not-visible');
    fireEvent.click(button);

    expect(handleChangeRateFlexVisible).toHaveBeenCalledTimes(2);
  });
});
