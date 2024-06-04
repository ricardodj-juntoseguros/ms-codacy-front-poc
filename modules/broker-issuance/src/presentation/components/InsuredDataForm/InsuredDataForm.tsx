import { FunctionComponent } from 'react';
import { GenericComponentProps } from '@shared/hooks';
import InsuredSelection from '../InsuredSelection';
import NoticeData from '../NoticeData';
import InsuredDataFooter from '../InsuredDataFooter';
import InsuredDataFormWrapper from '../InsuredDataFormWrapper';
import ProposalParticularities from '../ProposalParticularities';

const InsuredDataForm: FunctionComponent<GenericComponentProps> = ({
  name,
}) => {
  return (
    <InsuredDataFormWrapper name={name}>
      <InsuredSelection />
      <NoticeData />
      <ProposalParticularities />
      <InsuredDataFooter />
    </InsuredDataFormWrapper>
  );
};

export default InsuredDataForm;
