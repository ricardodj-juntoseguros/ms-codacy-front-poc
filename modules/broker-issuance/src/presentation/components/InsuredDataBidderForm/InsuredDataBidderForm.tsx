import { FunctionComponent } from 'react';
import { GenericComponentProps } from '@shared/hooks';
import InsuredSelection from '../InsuredSelection';
import NoticeData from '../NoticeData';
import NoticeAnnex from '../NoticeAnnex';
import InsuredDataFooter from '../InsuredDataFooter';
import InsuredDataFormWrapper from '../InsuredDataFormWrapper';
import ProposalParticularities from '../ProposalParticularities';

const InsuredDataBidderForm: FunctionComponent<GenericComponentProps> = ({
  name,
}) => {
  return (
    <InsuredDataFormWrapper name={name}>
      <InsuredSelection />
      <NoticeData>
        <NoticeAnnex />
      </NoticeData>
      <ProposalParticularities />
      <InsuredDataFooter />
    </InsuredDataFormWrapper>
  );
};

export default InsuredDataBidderForm;
