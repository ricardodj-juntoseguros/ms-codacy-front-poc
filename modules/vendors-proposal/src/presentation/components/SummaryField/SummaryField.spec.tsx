import '@testing-library/jest-dom';
import { render } from '../../../config/testUtils';
import SummaryField from './SummaryField';

describe('SummaryField', () => {
  it('should render correctly', () => {
    const { baseElement, getByText } = render(
      <SummaryField title="Title" values={['text']} helpText="help text" />,
    );

    const title = getByText('Title');
    const text = getByText('text');
    const helpText = getByText('help text');

    expect(baseElement).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(text).toBeInTheDocument();
    expect(helpText).toBeInTheDocument();
  });
});
