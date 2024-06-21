import { render } from '@testing-library/react';
import { MailIllustration } from './MailIllustration';
import '@testing-library/jest-dom';

describe('Mail Illustration', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MailIllustration />);
    expect(baseElement).toBeInTheDocument();
  });
});
