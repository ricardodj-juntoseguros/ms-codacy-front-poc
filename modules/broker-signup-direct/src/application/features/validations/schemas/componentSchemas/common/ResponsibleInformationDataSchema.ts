import { object, string } from 'yup';

export const ResponsibleInformationDataSchema = object().shape({
  documentNumber: string()
    .test('documentNumber', function isValidCPF() {
      const { documentNumber } = this.parent;
      if (typeof documentNumber !== 'string') return false;

      const cpfNoFormat = documentNumber.replace(/[^\d]+/g, '');

      if (cpfNoFormat.length !== 11 || !!cpfNoFormat.match(/(\d)\1{10}/))
        return false;

      const cpf = cpfNoFormat.split('');

      const validator = cpf
        .filter((digit, index, array) => index >= array.length - 2 && digit)
        .map(el => +el);

      const toValidate = (pop: number) =>
        cpf
          .filter((digit, index, array) => index < array.length - pop && digit)
          .map(el => +el);

      const rest = (count: number, pop: number) =>
        ((toValidate(pop).reduce((soma, el, i) => soma + el * (count - i), 0) *
          10) %
          11) %
        10;

      return !(rest(10, 2) !== validator[0] || rest(11, 1) !== validator[1]);
    })
    .required(),
  documentNumberIsNull: string().required(),
  phone: string().min(14).required(),
  phoneIsNull: string().required(),
});
