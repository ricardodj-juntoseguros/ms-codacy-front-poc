import '@testing-library/jest-dom';
import { act, fireEvent, render } from '@testing-library/react';
import { VendorsAuthService } from 'libs/services/src';
import { MemoryRouter } from 'react-router';
import { VendorsHeader } from './VendorsHeader';

describe('VendorsHeader', () => {
  beforeAll(() => {
    global.innerWidth = 1024;
    global.dispatchEvent(new Event('resize'));
    jest
      .spyOn(VendorsAuthService, 'getUsername')
      .mockImplementation(() => 'Test user');
    jest
      .spyOn(VendorsAuthService, 'getUserEmail')
      .mockImplementation(() => 'testuser@email.com');
  });

  it('should render correctly for userType insured', () => {
    jest
      .spyOn(VendorsAuthService, 'getUserAccessCookie')
      .mockImplementationOnce(() => ({
        userType: 'insured',
      }));
    const { getByText, getAllByText } = render(
      <MemoryRouter>
        <VendorsHeader />
      </MemoryRouter>,
    );

    const user = getAllByText('Test user');
    const email = getAllByText('testuser@email.com');

    expect(getByText('Meu painel')).toBeInTheDocument();
    expect(getByText('Solicitar garantia')).toBeInTheDocument();
    expect(user[0]).toBeInTheDocument();
    expect(email[0]).toBeInTheDocument();
  });

  it('should render correctly without the menus', async () => {
    const { queryByTestId, getAllByText } = render(
      <MemoryRouter>
        <VendorsHeader showMenuItems={false} />
      </MemoryRouter>,
    );

    const proposal = queryByTestId('header-anchor-/proposal');
    const policies = queryByTestId('header-anchor-/policies');
    const user = getAllByText('Test user');
    const email = getAllByText('testuser@email.com');

    expect(proposal).not.toBeInTheDocument();
    expect(policies).not.toBeInTheDocument();
    expect(user[0]).toBeInTheDocument();
    expect(email[0]).toBeInTheDocument();
  });

  it('should call the function back correctly', async () => {
    const backFunctionMock = jest.fn();
    const { getByTestId } = render(
      <MemoryRouter>
        <VendorsHeader
          showMenuItems={false}
          backButton={() => backFunctionMock()}
        />
      </MemoryRouter>,
    );

    const backButton = getByTestId('header-button-back');
    await act(async () => {
      await fireEvent.click(backButton);
    });

    expect(backFunctionMock).toHaveBeenCalled();
  });

  it('should call the function back correctly', async () => {
    const removeEventMock = jest.fn();
    await act(async () => {
      global.innerWidth = 575;
      global.dispatchEvent(new Event('resize'));
      global.removeEventListener = removeEventMock;
    });
    const backFunctionMock = jest.fn();

    const wrapper = render(
      <MemoryRouter>
        <VendorsHeader
          showMenuItems={false}
          backButton={() => backFunctionMock()}
        />
      </MemoryRouter>,
    );

    const backButton = await wrapper.queryByText('Voltar');
    expect(backButton).not.toBeInTheDocument();

    const button = wrapper.getByTestId('header-button-back');
    await act(async () => {
      await fireEvent.click(button);
    });
    expect(backFunctionMock).toHaveBeenCalled();

    wrapper.unmount();
    expect(removeEventMock).toHaveBeenCalled();
  });
});
