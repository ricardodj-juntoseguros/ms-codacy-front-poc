import { SearchOptions } from "junto-design-system";
import { currencyFormatter } from "@shared/utils";
import { InstallmentDTO } from "../application/types/dto";

export const mapInstallmentOptions = (installmentOptions: Array<InstallmentDTO>): SearchOptions[] => {
  return installmentOptions.map(installment => ({
    label:
      installment.numberOfInstallments === 1
        ? `À vista em ${currencyFormatter(
          installment.installments[0].installmentValue,
        )}`
        : `${installment.numberOfInstallments}x de ${currencyFormatter(
          installment.installments[0].installmentValue,
        )}`,
    value: installment.numberOfInstallments.toString(),
  }))
};
