import { FunctionComponent } from 'react';
import { GenericComponentProps } from '@shared/hooks';
import InsuredSelection from '../InsuredSelection';
import ContractualCondition from '../ContractualCondition';
import NoticeData from '../NoticeData';
import InsuredDataFooter from '../InsuredDataFooter';
import InsuredDataFormWrapper from '../InsuredDataFormWrapper';

const InsuredDataForm: FunctionComponent<GenericComponentProps> = ({
  name,
}) => {
  return (
    <InsuredDataFormWrapper name={name}>
      <InsuredSelection />
      <NoticeData />
      <ContractualCondition />
      <InsuredDataFooter />
    </InsuredDataFormWrapper>
  );
};

export default InsuredDataForm;
