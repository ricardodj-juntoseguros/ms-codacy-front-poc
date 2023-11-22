import { RouteComponentProps } from 'react-router';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, LinkButton } from 'junto-design-system';
import { BankDTO } from 'modules/broker-signup/src/application/types/dto';
import styles from './BrokerDetailsContainer.module.scss';
import { ResponsibleInformation } from '../../components/ResponsibleInformation/ResponsibleInformation';
import { BankDetails } from '../../components/BankDetails/BankDetails';
import { BrokerGeneralInformation } from '../../components/BrokerGeneralInformation/BrokerGeneralInformation';
import ListBankApi from '../../../application/features/Bank/ListBankApi';
import RegisterBrokerApi from '../../../application/features/RegisterBroker/RegisterBrokerApi';
import {
  brokerInformationSliceActions,
  selectBroker,
} from '../../../application/features/brokerInformation/BrokerInformationSlice';
import {
  validationActions,
  selectValidation,
} from '../../../application/features/validation/ValidationSlice';
import { TextHelper } from '../../components/TextHelper';
import LogoJuntoSeguros from '../../components/LogoJunto/LogoJuntoSeguros';
import { selectResponsibleInformation } from '../../../application/features/responsibleInformation/ResponsibleInformationSlice';

const BrokerDetailsContainer = ({ history }: RouteComponentProps) => {
  const [isDisableGoNextStep, setIsDisableGoNextStep] = useState(true);
  const [bankOptions, setbankOptions] = useState<BankDTO[]>();
  const dispatch = useDispatch();
  const brokerInformation = useSelector(selectBroker);
  const { errors } = useSelector(selectValidation);
  const { bankDetails } = brokerInformation;
  const { name, accounDigit, accounNumber, bankNumber } = bankDetails;
  const sreenWidth = window.screen.width;
  const [showTextHelper, setShowTextHelper] = useState(sreenWidth > 680);
  const textHelper = [
    'Nós atrelamos os dados da corretora a uma pessoa física (que será responsável pelo relacionamento na plataforma).',
    'Além disso, a comissão será depositada única e exclusivamente em uma conta jurídica, atrelada ao CNPJ da empresa.',
  ];
  const responsibleInformation = useSelector(selectResponsibleInformation);

  useEffect(() => {
    if (brokerInformation.information.federalId === '') {
      history.push('/');
    }
    if (
      brokerInformation.information.federalId !== '' &&
      responsibleInformation.emailBroker !== '' &&
      !responsibleInformation.emailHasValidated
    ) {
      history.push('/validation-email');
    }
  }, [brokerInformation.information.federalId]);

  useEffect(() => {
    const hasBankDetailsNotInputEmpty =
      name !== '' && bankNumber && accounNumber && accounDigit !== '';

    const hasInputError = Object.values(errors).length;

    if (hasBankDetailsNotInputEmpty && hasInputError === 0) {
      setIsDisableGoNextStep(false);
    } else {
      setIsDisableGoNextStep(true);
    }
  }, [accounDigit, accounNumber, bankNumber, errors, name]);

  const fetchBanks = useCallback(async () => {
    await ListBankApi.getBanks()
      .then(response => {
        setbankOptions(response);
      })
      .catch(() => setIsDisableGoNextStep(true));
  }, []);

  const fetchRegisterResponsibleBroker = useCallback(
    async (broker, responsibleInformation, pathUpdate) => {
      const payload = [
        {
          op: 'replace',
          path: '/cpfResponsable',
          value: responsibleInformation.cpfResponsable
            .trim()
            .replaceAll(/[./-]/g, ''),
        },
        {
          op: 'replace',
          path: '/phoneNumberResponsable',
          value: responsibleInformation.phoneNumberResponsable.replaceAll(
            /[()-]/g,
            '',
          ),
        },
        {
          op: 'replace',
          path: '/bankName',
          value: broker.bankDetails.name,
        },
        {
          op: 'replace',
          path: '/bankNumber',
          value: broker.bankDetails.bankCode,
        },
        {
          op: 'replace',
          path: '/currentAccountNumber',
          value: broker.bankDetails.accounNumber,
        },
        {
          op: 'replace',
          path: '/branchNumber',
          value: broker.bankDetails.bankNumber,
        },
        {
          op: 'replace',
          path: '/digitalContactNumber',
          value: broker.bankDetails.accounDigit,
        },
        {
          op: 'replace',
          path: '/iss',
          value: broker.iss,
        },
      ];
      let updateBankDigit: { op: string; path: string; value: any }[] = [];
      if (broker.bankDetails.bankDigit !== '') {
        updateBankDigit = [
          {
            op: 'replace',
            path: '/digitalAgencyNumber',
            value: broker.bankDetails.bankDigit,
          },
        ];
      }
      await RegisterBrokerApi.updateRegisterBroker(
        [...payload, ...updateBankDigit],
        pathUpdate,
      ).then(() => {
        history.push('/broker-data-review');
      });
    },
    [history],
  );

  useEffect(() => {
    if (bankOptions === undefined) {
      fetchBanks();
    }
  }, [bankOptions, fetchBanks]);

  const onSubmit = () => {
    fetchRegisterResponsibleBroker(
      brokerInformation,
      responsibleInformation,
      brokerInformation.pathUpdate,
    );
  };

  const handleGoBackClick = () => {
    history.push('/register-responsible');
  };

  function handleBankSelection(bank: BankDTO) {
    dispatch(brokerInformationSliceActions.setBank(bank));
    dispatch(validationActions.removeErrorMessage('bankName'));
  }

  return (
    <div className={styles['broker_details_container__wrapper']}>
      <LogoJuntoSeguros />
      <div className={styles['broker_details_container_section_form']}>
        <h1>Dados de cadastro</h1>
        <h2>Complete o cadastro com os dados a seguir:</h2>
        <ResponsibleInformation />
        <BankDetails
          bankOptions={bankOptions || []}
          onSelectBank={handleBankSelection}
        />
        <BrokerGeneralInformation />
        <div className={styles['broker_details_container__button']}>
          <Button
            id="brokerDetails-onSubmit-button"
            data-testid="button-broker-details"
            onClick={() => onSubmit()}
            disabled={isDisableGoNextStep}
          >
            Continuar
          </Button>
        </div>
        {sreenWidth <= 680 && (
          <div
            className={
              styles['broker_details_container_section_form_show_text_helper']
            }
          >
            <LinkButton
              id="brokerDetails-showTextHelper-button"
              onClick={() => setShowTextHelper(!showTextHelper)}
              label="Por quê precisamos desses dados?"
              icon={!showTextHelper ? 'help-circle' : 'chevron-up'}
              iconPosition="left"
            />
          </div>
        )}
      </div>
      {showTextHelper && (
        <TextHelper
          title="Por quê precisamos desses dados?"
          text={textHelper}
        />
      )}
    </div>
  );
};

export default BrokerDetailsContainer;
