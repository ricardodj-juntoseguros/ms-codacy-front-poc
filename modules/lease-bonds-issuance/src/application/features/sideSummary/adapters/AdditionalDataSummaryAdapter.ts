import { currencyFormatter } from '@shared/utils';
import { QuoteResultDTO } from '../../../types/dto';
import { PaymentTypeEnum } from '../../../types/model';
import { mapInstallmentOptions } from '../../../../helpers';

export const additionalDataSummaryAdapter = (
  currentQuote: QuoteResultDTO | null | undefined,
  paymentType: PaymentTypeEnum | null,
  numberOfInstallments: number | null,
  firstDueDate: string | null,
) => {
  const result = [] as { key: string; label: string; value: string }[];
  let selectedInstallmentOption = null;

  if (currentQuote && currentQuote.installmentOptions && numberOfInstallments) {
    selectedInstallmentOption = currentQuote.installmentOptions.find(
      iOption => iOption.numberOfInstallments === numberOfInstallments,
    );
  }
  if (selectedInstallmentOption) {
    const [mappedInstallmentOption] = mapInstallmentOptions([
      selectedInstallmentOption,
    ]);
    const { label: optionLabel, totalPrize } = mappedInstallmentOption;

    result.push({
      key: 'totalPrize',
      label: 'Prêmio total',
      value: currencyFormatter(totalPrize),
    });
    if (paymentType) {
      result.push({
        key: 'paymentType',
        label: 'Forma de pagamento',
        value: paymentType === PaymentTypeEnum.BILL ? 'Boleto' : 'Fatura',
      });
    }
    result.push({
      key: 'numberOfInstallments',
      label: 'Quantidade de parcelas',
      value: optionLabel,
    });
  }
  if (firstDueDate && !firstDueDate.includes('_')) {
    result.push({
      key: 'firstDueDate',
      label: 'Primeira parcela',
      value: firstDueDate,
    });
  }
  return result;
};
