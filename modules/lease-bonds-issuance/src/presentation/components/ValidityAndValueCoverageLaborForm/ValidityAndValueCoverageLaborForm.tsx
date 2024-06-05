import { GenericComponentProps } from '@shared/hooks';
import ValidityFields from '../ValidityFields';
import SecuredAmount from '../SecuredAmount';
import Pricing from '../Pricing';
import ResolutionCNSP382 from '../ResolutionCNSP382';
import ValidityAndValueFooter from '../ValidityAndValueFooter';
import QuoteErrorFeedback from '../QuoteErrorFeedback/QuoteErrorFeedback';
import ValidityAndValueFormWrapper from '../ValidityAndValueFormWrapper';
import CoverageLabor from '../CoverageLabor';

const ValidityAndValueCoverageLaborForm: React.FC<GenericComponentProps> = ({
  name,
}) => {
  return (
    <ValidityAndValueFormWrapper name={name}>
      <ValidityFields />
      <SecuredAmount title="Valor de cobertura e taxas">
        <CoverageLabor />
        <Pricing />
      </SecuredAmount>
      <QuoteErrorFeedback />
      <ResolutionCNSP382 />
      <ValidityAndValueFooter />
    </ValidityAndValueFormWrapper>
  );
};

export default ValidityAndValueCoverageLaborForm;
