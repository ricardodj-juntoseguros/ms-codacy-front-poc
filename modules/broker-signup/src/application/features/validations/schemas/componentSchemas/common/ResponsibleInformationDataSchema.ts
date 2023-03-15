import { object, string, } from 'yup';
import { emailValidator} from '@shared/utils';
import { VALIDATION_MESSAGES } from '../../../../../../constants/validationMessages';

export const ResponsibleInformationDataSchema = object().shape({
    nameResponsible: string()
      .test(
        'nameResponsible',
        function validateNameResponsible() {
          const { nameResponsible  } = this.parent;
          return !(nameResponsible.trim().split(' ').length < 2 );
        },
      )
    .required(),
    documentNumber: string().test(
      'nameResponsible',
      function isValidCPF() {
        const { documentNumber  } = this.parent;
        if (typeof documentNumber !== 'string') return false

        const  cpfNoFormat = documentNumber.replace(/[^\d]+/g, '')

        if (cpfNoFormat.length !== 11 || !!cpfNoFormat.match(/(\d)\1{10}/)) return false

         const cpf = cpfNoFormat.split('')

        const validator = cpf.filter((digit, index, array) => index >= array.length - 2 && digit)
            .map( el => +el )

        const toValidate = (pop: number) => cpf
            .filter((digit, index, array) => index < array.length - pop && digit)
            .map(el => +el)

        const rest = (count: number, pop: number) => (toValidate(pop)
            .reduce((soma, el, i) => soma + el * (count - i), 0) * 10)
            % 11
            % 10

        return !(rest(10,2) !== validator[0] || rest(11,1) !== validator[1])
    }
    ).required(),
    phone: string().min(14).required(),
    email: string().email().required(),
});
