import { FunctionComponent } from 'react';
import { GenericComponentProps } from '@shared/hooks';
import InsuredSelection from '../InsuredSelection';
import ContractualCondition from '../ContractualCondition';
import NoticeData from '../NoticeData';
import NoticeAnnex from '../NoticeAnnex';
import InsuredDataFooter from '../InsuredDataFooter';
import InsuredDataFormWrapper from '../InsuredDataFormWrapper';

const InsuredDataBidderForm: FunctionComponent<GenericComponentProps> = ({
  name,
}) => {
  return (
    <InsuredDataFormWrapper name={name}>
      <InsuredSelection />
      <NoticeData>
        <NoticeAnnex />
      </NoticeData>
      <ContractualCondition />
      <InsuredDataFooter />
    </InsuredDataFormWrapper>
  );
};

export default InsuredDataBidderForm;
