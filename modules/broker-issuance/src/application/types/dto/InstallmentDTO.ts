export interface InstallmentDTO {
  numberOfInstallments: number;
  firstDueDate: string;
  installments: {
    number: number;
    dueDate: string;
    mainValue: number;
    iof: number;
    policyCost: number;
    installmentValue: number;
    fractionationValue: number;
  }[];
}
