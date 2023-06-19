import '@testing-library/jest-dom';
import { act, fireEvent, render } from '@testing-library/react';
import { VendorsAuthService } from '@services';
import { MemoryRouter } from 'react-router';
import Header from './Header';

describe('Header', () => {
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

  it('should render correctly', () => {
    const { getByText, getAllByText } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    const panel = getByText('Meu painel');
    const insureds = getByText('Meu painel');
    const suppliers = getByText('Administrar Fornecedores');
    const user = getAllByText('Test user');
    const email = getAllByText('testuser@email.com');

    expect(panel).toBeInTheDocument();
    expect(insureds).toBeInTheDocument();
    expect(suppliers).toBeInTheDocument();
    expect(user[0]).toBeInTheDocument();
    expect(email[0]).toBeInTheDocument();
  });

  it('should render correctly without the menus', async () => {
    const { queryByTestId, getAllByText } = render(
      <MemoryRouter>
        <Header showMenuItems={false} />
      </MemoryRouter>,
    );

    const panel = await queryByTestId('header-anchor-/panel');
    const insureds = await queryByTestId('header-anchor-/insured');
    const suppliers = await queryByTestId('header-anchor-/suppliers');
    const user = getAllByText('Test user');
    const email = getAllByText('testuser@email.com');

    expect(panel).not.toBeInTheDocument();
    expect(insureds).not.toBeInTheDocument();
    expect(suppliers).not.toBeInTheDocument();
    expect(user[0]).toBeInTheDocument();
    expect(email[0]).toBeInTheDocument();
  });

  it('should call the function back correctly', async () => {
    const backFunctionMock = jest.fn();
    const { getByTestId } = render(
      <MemoryRouter>
        <Header showMenuItems={false} backButton={() => backFunctionMock()} />
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
        <Header showMenuItems={false} backButton={() => backFunctionMock()} />
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
