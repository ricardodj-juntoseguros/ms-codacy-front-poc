import '@testing-library/jest-dom';
import { render } from '../../../config/testUtils';
import DetailField from './DetailField';

describe('DetailField', () => {
  it('should render correctly', () => {
    const { baseElement, getByText } = render(
      <DetailField title="Title" values={['text']} helpText="help text" />,
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
