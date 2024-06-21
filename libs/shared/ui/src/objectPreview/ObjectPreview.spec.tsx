import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ObjectPreview } from './ObjectPreview';

describe('ObjectPreview', () => {
  const titleMock = 'titleMock';
  const descriptionMock = 'descriptionMock';

  it('should render successfully', () => {
    const { baseElement } = render(
      <ObjectPreview title={titleMock} description={descriptionMock} />,
    );
    expect(baseElement).toBeInTheDocument();
  });

  it('should show correct title and description', () => {
    const { getByText } = render(
      <ObjectPreview title={titleMock} description={descriptionMock} />,
    );

    expect(getByText(titleMock)).toBeInTheDocument();
    expect(getByText(descriptionMock)).toBeInTheDocument();
  });
});
