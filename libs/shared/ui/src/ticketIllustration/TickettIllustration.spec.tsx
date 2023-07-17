import { render } from '@testing-library/react';
import { TicketIllustration } from './TicketIllustration';
import '@testing-library/jest-dom';

describe('Ticket Illustration', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TicketIllustration />);
    expect(baseElement).toBeInTheDocument();
  });
});
