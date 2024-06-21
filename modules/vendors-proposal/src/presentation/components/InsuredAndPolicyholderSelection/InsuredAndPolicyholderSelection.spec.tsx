import '@testing-library/jest-dom';
import { insuredAddressesMock, insuredListMock } from '../../../__mocks__';
import { act, fireEvent, render, waitFor } from '../../../config/testUtils';
import InsuredAndPolicyholderSelection from './InsuredAndPolicyholderSelection';
import InsuredAndPolicyholderSelectionApi from '../../../application/features/insuredAndPolicyholderSelection/InsuredAndPolicyholderSelectionApi';
import { store } from '../../../config/store';
import { proposalActions } from '../../../application/features/proposal/ProposalSlice';
import { insuredAndPolicyholderSelectionActions } from '../../../application/features/insuredAndPolicyholderSelection/InsuredAndPolicyholderSelectionSlice';

describe('InsuredAndPolicyholderSelection', () => {
  it('Should display skeleton initially and then display fields when insureds are loaded', async () => {
    jest
      .spyOn(InsuredAndPolicyholderSelectionApi, 'getInsuredList')
      .mockImplementationOnce(async () => {
        return insuredListMock;
      });

    const { getByTestId, findByTestId, queryByTestId } = render(
      <InsuredAndPolicyholderSelection handleNextStep={jest.fn()} />,
    );

    expect(
      getByTestId('insuredAndPolicyholderSelectionSkeleton-div-skeleton'),
    ).toBeInTheDocument();
    await waitFor(async () => {
      expect(
        await findByTestId('insuredSelector-input-dropdown'),
      ).toBeVisible();
    });
    expect(
      queryByTestId('insuredAndPolicyholderSelectionSkeleton-div-skeleton'),
    ).not.toBeInTheDocument();
  });

  it('Should enable next button when store values are correcly filled', async () => {
    jest
      .spyOn(InsuredAndPolicyholderSelectionApi, 'getInsuredList')
      .mockImplementationOnce(async () => {
        return insuredListMock;
      });
    jest
      .spyOn(InsuredAndPolicyholderSelectionApi, 'getInsuredAddresses')
      .mockImplementationOnce(async () => {
        return insuredAddressesMock;
      });

    const { getByTestId, findByTestId } = render(
      <InsuredAndPolicyholderSelection handleNextStep={jest.fn()} />,
    );
    await waitFor(async () => {
      expect(
        await findByTestId('insuredSelector-input-dropdown'),
      ).toBeVisible();
    });
    expect(
      getByTestId('insuredPolicyholderSelection-button-submit'),
    ).toBeDisabled();

    act(() => {
      store.dispatch(
        proposalActions.setInsuredValues({
          id: 123,
          name: 'Teste segurado',
          federalId: '11223344556677',
        }),
      );
    });
    expect(
      await findByTestId('insuredAddressSelector-input-dropdown'),
    ).toBeVisible();
    act(() => {
      store.dispatch(proposalActions.setInsuredAddressId(123));
    });
    act(() => {
      store.dispatch(
        proposalActions.setPolicyholder({
          federalId: '12312312312312',
        }),
      );
    });
    act(() => {
      store.dispatch(
        insuredAndPolicyholderSelectionActions.setIsValidFederalId(true),
      );
    });
    expect(
      getByTestId('insuredPolicyholderSelection-button-submit'),
    ).toBeEnabled();
  });

  it('Should call handleNextStep callback with insured and policyholder corporateName if policyholder is present in proposal', async () => {
    jest
      .spyOn(InsuredAndPolicyholderSelectionApi, 'getInsuredList')
      .mockImplementationOnce(async () => {
        return insuredListMock;
      });
    jest
      .spyOn(InsuredAndPolicyholderSelectionApi, 'getInsuredAddresses')
      .mockImplementationOnce(async () => {
        return insuredAddressesMock;
      });

    const mockCallback = jest.fn();

    const { getByTestId, findByTestId } = render(
      <InsuredAndPolicyholderSelection handleNextStep={mockCallback} />,
    );
    await waitFor(async () => {
      expect(
        await findByTestId('insuredSelector-input-dropdown'),
      ).toBeVisible();
    });
    act(() => {
      store.dispatch(
        proposalActions.setInsuredValues({
          id: 123,
          name: 'Teste segurado',
          federalId: '11223344556677',
        }),
      );
    });
    await waitFor(async () => {
      expect(
        await findByTestId('insuredAddressSelector-input-dropdown'),
      ).toBeVisible();
    });
    act(() => {
      store.dispatch(proposalActions.setInsuredAddressId(123));
    });
    act(() => {
      store.dispatch(
        proposalActions.setPolicyholder({
          federalId: '12312312312312',
          corporateName: 'Teste tomador',
        }),
      );
    });
    act(() => {
      store.dispatch(
        insuredAndPolicyholderSelectionActions.setIsValidFederalId(true),
      );
    });

    fireEvent.click(getByTestId('insuredPolicyholderSelection-button-submit'));
    expect(mockCallback).toHaveBeenCalledWith('Teste segurado e Teste tomador');
  });

  it('Should call handleNextStep callback with insured and policyholder search input value if policyholder is not present in proposal', async () => {
    jest
      .spyOn(InsuredAndPolicyholderSelectionApi, 'getInsuredList')
      .mockImplementationOnce(async () => {
        return insuredListMock;
      });
    jest
      .spyOn(InsuredAndPolicyholderSelectionApi, 'getInsuredAddresses')
      .mockImplementationOnce(async () => {
        return insuredAddressesMock;
      });

    const mockCallback = jest.fn();

    const { getByTestId, findByTestId } = render(
      <InsuredAndPolicyholderSelection handleNextStep={mockCallback} />,
    );
    await waitFor(async () => {
      expect(
        await findByTestId('insuredSelector-input-dropdown'),
      ).toBeVisible();
    });

    act(() => {
      store.dispatch(
        proposalActions.setInsuredValues({
          id: 123,
          name: 'Teste segurado',
          federalId: '11223344556677',
        }),
      );
    });

    await waitFor(async () => {
      expect(
        await findByTestId('insuredAddressSelector-input-dropdown'),
      ).toBeVisible();
    });
    act(() => {
      store.dispatch(proposalActions.setPolicyholder({}));
    });
    act(() => {
      store.dispatch(proposalActions.setInsuredAddressId(123));
    });
    act(() => {
      store.dispatch(
        insuredAndPolicyholderSelectionActions.setPolicyholderInputValue(
          '06376081000105',
        ),
      );
    });
    act(() => {
      store.dispatch(
        insuredAndPolicyholderSelectionActions.setIsValidFederalId(true),
      );
    });

    fireEvent.click(getByTestId('insuredPolicyholderSelection-button-submit'));
    expect(mockCallback).toHaveBeenCalledWith(
      'Teste segurado e 06.376.081/0001-05',
    );
  });

  it('Should display alert if the policyholder is not selected and inputted policyholder value is an affiliate federalId', async () => {
    jest
      .spyOn(InsuredAndPolicyholderSelectionApi, 'getInsuredList')
      .mockImplementationOnce(async () => {
        return insuredListMock;
      });
    jest
      .spyOn(InsuredAndPolicyholderSelectionApi, 'getInsuredAddresses')
      .mockImplementationOnce(async () => {
        return insuredAddressesMock;
      });
    const { getByText } = render(
      <InsuredAndPolicyholderSelection handleNextStep={jest.fn()} />,
    );
    act(() => {
      store.dispatch(
        insuredAndPolicyholderSelectionActions.setPolicyholderInputValue(
          '45543915000424',
        ),
      );
    });
    act(() => {
      store.dispatch(
        insuredAndPolicyholderSelectionActions.setIsValidFederalId(true),
      );
    });
    expect(
      getByText(
        /Ops, parece que esse CNPJ é de uma filial. Precisamos do CNPJ da Matriz para continuar. Caso precise de ajuda/,
      ),
    ).toBeInTheDocument();
  });
});
