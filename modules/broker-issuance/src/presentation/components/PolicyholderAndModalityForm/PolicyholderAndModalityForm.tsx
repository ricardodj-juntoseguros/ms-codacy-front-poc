import { FunctionComponent } from 'react';
import { GenericComponentProps } from '@shared/hooks';
import { useSelector } from 'react-redux';
import { selectPolicyholder } from '../../../application/features/policyholderSelection/PolicyholderSelectionSlice';
import PolicyholderAppointmentLetter from '../PolicyholderAppointmentLetter';
import PolicyholderSelection from '../PolicyholderSelection';
import ModalitySelection from '../ModalitySelection';
import PolicyInProgress from '../PolicyInProgress';
import PolicyholderAndModalityFooter from '../PolicyholderAndModalityFooter';
import PolicyholderAndModalityFormWrapper from '../PolicyholderAndModalityFormWrapper';

const PolicyholderAndModalityForm: FunctionComponent<GenericComponentProps> = ({
  name,
}) => {
  const { needAppointmentLetter } = useSelector(selectPolicyholder);
  return (
    <PolicyholderAndModalityFormWrapper name={name}>
      <PolicyholderSelection />
      {needAppointmentLetter ? (
        <PolicyholderAppointmentLetter />
      ) : (
        <>
          <ModalitySelection />
          <PolicyInProgress />
          <PolicyholderAndModalityFooter />
        </>
      )}
    </PolicyholderAndModalityFormWrapper>
  );
};

export default PolicyholderAndModalityForm;
