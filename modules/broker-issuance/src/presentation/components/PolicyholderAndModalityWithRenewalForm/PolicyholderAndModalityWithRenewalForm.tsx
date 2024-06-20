import { FunctionComponent } from 'react';
import { GenericComponentProps } from '@shared/hooks';
import { useSelector } from 'react-redux';
import { selectPolicyholder } from '../../../application/features/policyholderSelection/PolicyholderSelectionSlice';
import PolicyholderAppointmentLetter from '../PolicyholderAppointmentLetter';
import PolicyholderSelection from '../PolicyholderSelection';
import ModalitySelection from '../ModalitySelection';
import PolicyholderAndModalityFooter from '../PolicyholderAndModalityFooter';
import PolicyholderAndModalityFormWrapper from '../PolicyholderAndModalityFormWrapper';
import PolicyRenewal from '../PolicyRenewal';
import FidelizeProspectionToggle from '../FidelizeProspectionToggle';

const PolicyholderAndModalityWithRenewalForm: FunctionComponent<GenericComponentProps> =
  ({ name }) => {
    const { needAppointmentLetter } = useSelector(selectPolicyholder);
    return (
      <PolicyholderAndModalityFormWrapper name={name}>
        <PolicyholderSelection />
        {needAppointmentLetter ? (
          <PolicyholderAppointmentLetter />
        ) : (
          <>
            <ModalitySelection />
            <PolicyRenewal />
            <FidelizeProspectionToggle />
            <PolicyholderAndModalityFooter />
          </>
        )}
      </PolicyholderAndModalityFormWrapper>
    );
  };

export default PolicyholderAndModalityWithRenewalForm;
