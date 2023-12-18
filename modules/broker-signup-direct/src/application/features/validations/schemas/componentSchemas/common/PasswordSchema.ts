import { object, string } from 'yup';

export const PasswordSchema = object().shape({
  password: string()
    .test('minChar', 'minChar', function validateMinChar(value) {
      const password = value || '';
      return !(password?.length < 10);
    })
    .test(
      'notNumberSequence',
      'notNumberSequence',
      function validateNotNumberSequence(value) {
        const password = value?.split(/[^0-9]/g) || '';
        const sequence = '0123456789';
        const inverseSequence = '9876543210';
        for (let i = 0; i < password.length; i += 1) {
          if (password[i].length > 1) {
            if (
              sequence.includes(password[i]) ||
              inverseSequence.includes(password[i])
            ) {
              return false;
            }
          }
        }
        return true;
      },
    )
    .test('specialChar', 'specialChar', function validateSpecialChar(value) {
      const regex = /\W|_/;
      if (!value?.match(regex)) {
        return false;
      }
      return true;
    })
    .test(
      'min3charDifferent',
      'min3charDifferent',
      function validateMin3charDifferent(value) {
        const threeTypes = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{3,100}$/;
        if (!value?.match(threeTypes)) {
          return false;
        }
        return true;
      },
    )
    .test(
      'differentUserName',
      'differentUserName',
      function validateDifferentUserName() {
        const { userName, password } = this.parent;
        if (userName === password) {
          return false;
        }
        return true;
      },
    )
    .test(
      'differentCompanyName',
      'differentCompanyName',
      function validateDifferentCompanyName() {
        const { name, password } = this.parent;
        const nameVerify = name?.split(' ') || '';

        for (let i = 0; i < nameVerify.length; i += 1) {
          if (nameVerify[i].length > 2) {
            if (password.toUpperCase().includes(nameVerify[i].toUpperCase())) {
              return false;
            }
          }
        }

        return true;
      },
    )
    .test('samePasswords', 'samePasswords', function validateSamePasswords() {
      const { confirmPassword, password } = this.parent;
      if (confirmPassword !== password) {
        return false;
      }
      return true;
    }),
});
