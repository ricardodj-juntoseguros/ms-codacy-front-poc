export interface InstallmentModel {
  numberOfInstallments: number;
  installments: {
    number: number;
    dueDate: string;
    mainValue: number;
    iof: number;
    policyCost: number;
    installmentValue: number;
    fractionationValue: number;
  }[];
  totalFractionationValue: number;
  commissionFee: number;
  commissionValue: number;
  commissions: {
    brokerFederalId: string;
    fee: number;
    value: number;
  }[];
  totalPrize: number;
  totalMainValue: number;
  totalPolicyCost: number;
  totalIOF: number;
  firstDueDate: string;
}
