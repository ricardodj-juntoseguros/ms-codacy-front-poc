import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import MainInfo from './MainInfo';

const mainInfoPropsMock = {
  policyholder: 'Dexco',
  modality: 'EPS',
  totalPremiumValue: 1000.0,
  duration: 180,
  durationStart: '2023-06-27T16:51:02.597Z',
  durationEnd: '2023-06-27T16:51:02.597Z',
};

describe('MainInfo', () => {
  it('Should render correctly', () => {
    const { container } = render(<MainInfo {...mainInfoPropsMock} />);

    expect(container).toBeInTheDocument();
    expect.objectContaining({ ...mainInfoPropsMock });
  });
});
