import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import ItemDetail from './ItemDetail';

const ItemDetailPropsMock = {
  label: 'Label',
  value: 'Value',
};

describe('ItemDetail', () => {
  it('Should render correctly', () => {
    const { container } = render(
      <ItemDetail {...{ ...ItemDetailPropsMock }} />,
    );
    expect(container).toBeInTheDocument();
    expect.objectContaining({
      ...ItemDetailPropsMock,
    });
  });
});
