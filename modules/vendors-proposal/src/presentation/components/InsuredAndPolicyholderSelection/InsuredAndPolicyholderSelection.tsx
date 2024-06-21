import { useContext, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Button, ThemeContext } from 'junto-design-system';
import { ChatUtils, federalIdFormatter } from '@shared/utils';
import { GenericComponentProps } from '../../../application/types/model';
import { selectProposal } from '../../../application/features/proposal/ProposalSlice';
import { selectInsuredAndPolicyholderSelection } from '../../../application/features/insuredAndPolicyholderSelection/InsuredAndPolicyholderSelectionSlice';
import { isAffiliateFederalId } from '../../../helpers/isAffiliateFederalId';
import { InsuredAndPolicyholderSelectionSkeleton } from '../Skeletons';
import InsuredSelector from '../InsuredSelector';
import InsuredAddressSelector from '../InsuredAddressSelector';
import PolicyholderSelector from '../PolicyholderSelector';
import PolicyholderAffiliateSelector from '../PolicyholderAffiliateSelector';
import styles from './InsuredAndPolicyholderSelection.module.scss';

const InsuredAndPolicyholderSelection: React.FC<GenericComponentProps> = ({
  handleNextStep,
}) => {
  const theme = useContext(ThemeContext);
  const { insuredAddressId, insuredFederalId, insuredName, policyholder } =
    useSelector(selectProposal);
  const {
    isValidFederalId,
    loadingPolicyholders,
    policyholderInputValue,
    policyholderAffiliateResults,
  } = useSelector(selectInsuredAndPolicyholderSelection);
  const [displaySkeleton, setDisplaySkeleton] = useState<boolean>(true);

  const hasTypedAffiliateFederalId = useMemo(() => {
    if (isValidFederalId) {
      return isAffiliateFederalId(policyholderInputValue);
    }
    return false;
  }, [isValidFederalId, policyholderInputValue]);

  const shouldEnableNextButton = useMemo(() => {
    const hasSelectedInsuredAndAddress =
      insuredFederalId !== '' && insuredAddressId !== 0;
    const hasSelectedPolicyholder = !!policyholder.federalId;
    return (
      !loadingPolicyholders &&
      hasSelectedInsuredAndAddress &&
      (hasSelectedPolicyholder || isValidFederalId)
    );
  }, [
    insuredAddressId,
    insuredFederalId,
    loadingPolicyholders,
    isValidFederalId,
    policyholder.federalId,
  ]);

  const handleNextButtonClick = () => {
    if (policyholder.corporateName) {
      handleNextStep(`${insuredName} e ${policyholder.corporateName}`);
      return;
    }
    const formattedFederalId = federalIdFormatter(
      policyholderInputValue.replace(/[^\d]+/g, ''),
    );
    handleNextStep(`${insuredName} e ${formattedFederalId}`);
  };

  return (
    <div className={styles['insured-policyholder-selection__wrapper']}>
      {displaySkeleton && <InsuredAndPolicyholderSelectionSkeleton />}
      <div
        className={
          styles[
            `insured-policyholder-selection__form${
              displaySkeleton ? '--hidden' : ''
            }`
          ]
        }
      >
        <div>
          <p className={styles[theme]}>Empresa contratante</p>
          <div className={styles['insured-policyholder-selection__field']}>
            <InsuredSelector
              onLoadedInsureds={() => setDisplaySkeleton(false)}
            />
          </div>
          <div className={styles['insured-policyholder-selection__field']}>
            <InsuredAddressSelector />
          </div>
        </div>
        <div>
          <p className={styles[theme]}>Empresa contratada</p>
          <div className={styles['insured-policyholder-selection__field']}>
            <PolicyholderSelector />
          </div>
          {hasTypedAffiliateFederalId && (
            <div
              className={
                styles['insured-policyholder-selection__affiliate-alert']
              }
            >
              <Alert
                text="Ops, parece que esse CNPJ é de uma filial. Precisamos do CNPJ da Matriz para continuar. Caso precise de ajuda, %ACTION_BUTTON%"
                variant="neutral"
                actionButtonText="acesse nosso chat"
                onActionButtonClick={() => ChatUtils.zenDesk.open()}
                arrow="top-start"
                width={504}
              />
            </div>
          )}
          {policyholderAffiliateResults &&
            policyholderAffiliateResults.length > 1 && (
              <div className={styles['insured-policyholder-selection__field']}>
                <PolicyholderAffiliateSelector />
              </div>
            )}
        </div>
      </div>
      <div className={styles['insured-policyholder-selection__submit']}>
        <Button
          data-testid="insuredPolicyholderSelection-button-submit"
          fullWidth
          disabled={!shouldEnableNextButton || hasTypedAffiliateFederalId}
          onClick={() => handleNextButtonClick()}
        >
          Avançar
        </Button>
      </div>
    </div>
  );
};

export default InsuredAndPolicyholderSelection;
