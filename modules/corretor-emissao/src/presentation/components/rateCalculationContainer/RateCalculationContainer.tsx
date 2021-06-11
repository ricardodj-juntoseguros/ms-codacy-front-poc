import { StepContainer } from '@libs/shared/ui';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectQuote,
  setStandardRate,
} from '../../../application/features/quote/QuoteSlice';
import { RateCalculation } from '../rateCalculation';

export function RateCalculationContainer() {
  const dispatch = useDispatch();
  const { pricing } = useSelector(selectQuote);

  const { maxRate, finalPrize, commissionValue, commissionFee, feeStandard } =
    pricing;

  function handleChangeStandardRate(value: number) {
    dispatch(setStandardRate(value));
  }

  function handleDownloadQuote() {
    console.log('download');
  }

  function StepTitle() {
    return (
      <title>
        Calcule a <strong>taxa</strong>
      </title>
    );
  }

  return (
    <div>
      <StepContainer stepNumber={3} title={StepTitle()} active>
        <RateCalculation
          maxRate={maxRate}
          finalPrize={finalPrize}
          finalCommission={commissionValue}
          comissionPercent={commissionFee}
          standardRateValue={feeStandard}
          handleChangeStandardRate={value => handleChangeStandardRate(value)}
          handleDownloadQuote={() => handleDownloadQuote}
        />
      </StepContainer>
    </div>
  );
}
