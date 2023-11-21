import { fireEvent, render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import { fetchAllMappedPolicyholdersInWallet } from 'modules/fidelize-dashboard/src/application/features/viewAllPolicyholdersInWallet/ViewAllPolicyholdersInWalletSlice';
import SummariesQuantitativeApi from 'modules/fidelize-dashboard/src/application/features/summariesQuantitative/SummariesQuantitativeApi';
import { SummariesQuantitativeByPolicyholderDTO } from 'modules/fidelize-dashboard/src/application/types/dto/SummariesQuantitativeByPolicyholderDTO';
import { AllPolicyholdersInWalletDTO } from '../../../application/types/dto';
import AllPolicyholdersInWalletFilterSelector from '.';
import { store } from '../../../config/store';
import ViewAllPolicyholdersInWalletApi from '../../../application/features/viewAllPolicyholdersInWallet/ViewAllPolicyholdersInWalletApi';

describe('AllPolicyholdersInWalletFilterSelector', () => {
  beforeAll(async () => {
    jest
      .spyOn(SummariesQuantitativeApi, 'getSummariesByPolicyholdersList')
      .mockImplementation(async () => {
        return {
          companyName: 'CONSTRUTORA SAO JUDAS TADEU LTDA',
          federalId: '30540454000116',
          processesFound: {
            total: 130,
            federal: 100,
            labor: 30,
          },
        } as SummariesQuantitativeByPolicyholderDTO;
      });

    jest
      .spyOn(ViewAllPolicyholdersInWalletApi, 'getAllPolicyholdersInWallet')
      .mockImplementation(async () => {
        return [
          {
            policyholderExternalId: 1111,
            modalityExternalId: 122,
            policyholderFederalId: '30540454000116',
            policyholderName: 'CONSTRUTORA SAO JUDAS TADEU LTDA',
          },
          {
            policyholderExternalId: 2222,
            modalityExternalId: 122,
            policyholderFederalId: '07950702000185',
            policyholderName: 'CONSTRUTORA MARQUISE S/A',
          },
          {
            policyholderExternalId: 3333,
            modalityExternalId: 122,
            policyholderFederalId: '01618992000188',
            policyholderName: 'RAVI PARTICIPAÇÕES E INVESTIMENTOS LTDA',
          },
          {
            policyholderExternalId: 4444,
            modalityExternalId: 122,
            policyholderFederalId: '61532644000115',
            policyholderName: 'ITAÚSA INVESTIMENTOS ITAÚ S/A',
          },
          {
            policyholderExternalId: 5555,
            modalityExternalId: 122,
            policyholderFederalId: '03470727000473',
            policyholderName: 'FORD MOTOR COMPANY BRASIL LTDA',
          },
          {
            policyholderExternalId: 6666,
            modalityExternalId: 122,
            policyholderFederalId: '03470727000473',
            policyholderName: 'K9 CONSTRUCOES, TRANSPORTES E LOCACOES EIRELI',
          },
        ] as AllPolicyholdersInWalletDTO[];
      });
    await store.dispatch(fetchAllMappedPolicyholdersInWallet());
  });

  it('Should render policyholder list from store', async () => {
    const { findByText } = render(
      <Provider store={store}>
        <AllPolicyholdersInWalletFilterSelector />
      </Provider>,
    );

    expect(
      await findByText('CONSTRUTORA SAO JUDAS TADEU LTDA - 30.540.454/0001-16'),
    ).toBeInTheDocument();
    expect(
      await findByText('CONSTRUTORA MARQUISE S/A - 07.950.702/0001-85'),
    ).toBeInTheDocument();
    expect(
      await findByText(
        'RAVI PARTICIPAÇÕES E INVESTIMENTOS LTDA - 01.618.992/0001-88',
      ),
    ).toBeInTheDocument();
    expect(
      await findByText('ITAÚSA INVESTIMENTOS ITAÚ S/A - 61.532.644/0001-15'),
    ).toBeInTheDocument();
    expect(
      ViewAllPolicyholdersInWalletApi.getAllPolicyholdersInWallet,
    ).toHaveBeenCalledTimes(1);
  });

  it('Should filter options on input change', async () => {
    const { queryByText, findByTestId, getAllByText } = render(
      <Provider store={store}>
        <AllPolicyholdersInWalletFilterSelector />
      </Provider>,
    );

    const input = await (
      await findByTestId('search-input')
    ).querySelectorAll('input')[0];

    await act(async () => {
      fireEvent.change(input, { target: { value: 'Brasil' } });
    });

    expect(
      getAllByText('FORD MOTOR COMPANY BRASIL LTDA - 03.470.727/0004-73'),
    ).toBeTruthy();
    expect(
      queryByText('DHL LOGISTICS - 51.485.949/0001-60'),
    ).not.toBeInTheDocument();
  });

  it('Should add policyholder tag to selection and enable apply button when selected on list', async () => {
    const { findByText, getByText, getByTestId } = render(
      <Provider store={store}>
        <AllPolicyholdersInWalletFilterSelector />
      </Provider>,
    );

    const option = await findByText(
      'CONSTRUTORA SAO JUDAS TADEU LTDA - 30.540.454/0001-16',
    );
    await act(async () => {
      fireEvent.click(option);
    });
    expect(getByText('CONSTRUTORA SAO JUDAS TADEU...')).toBeInTheDocument();
    expect(getByTestId('btn-apply-policyholders-filter')).toBeEnabled();
  });

  it('Should show alert message on try select over five policyholder', async () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');

    const { findByText, getByText } = render(
      <Provider store={store}>
        <AllPolicyholdersInWalletFilterSelector />
      </Provider>,
    );

    const option1 = await findByText(
      'CONSTRUTORA SAO JUDAS TADEU LTDA - 30.540.454/0001-16',
    );

    const option2 = await findByText(
      'CONSTRUTORA MARQUISE S/A - 07.950.702/0001-85',
    );

    const option3 = await findByText(
      'RAVI PARTICIPAÇÕES E INVESTIMENTOS LTDA - 01.618.992/0001-88',
    );

    const option4 = await findByText(
      'ITAÚSA INVESTIMENTOS ITAÚ S/A - 61.532.644/0001-15',
    );

    const option5 = await findByText(
      'FORD MOTOR COMPANY BRASIL LTDA - 03.470.727/0004-73',
    );

    const option6 = await findByText(
      'K9 CONSTRUCOES, TRANSPORTES E LOCACOES EIRELI - 03.470.727/0004-73',
    );

    await act(async () => {
      fireEvent.click(option1);
      fireEvent.click(option2);
      fireEvent.click(option3);
      fireEvent.click(option4);
      fireEvent.click(option5);
      fireEvent.click(option6);
    });

    expect(
      getByText('FORD MOTOR COMPANY BRASIL LTDA - 03.470.727/0004-73'),
    ).toBeInTheDocument();
    waitFor(async () => {
      expect(
        await findByText('Você pode selecionar no máximo 5 tomadores.'),
      ).toBeInTheDocument();
    });
  });

  it('Should call filter by policyholders list ', async () => {
    const { getByTestId, findByText } = render(
      <Provider store={store}>
        <AllPolicyholdersInWalletFilterSelector />
      </Provider>,
    );

    const option = await findByText(
      'CONSTRUTORA SAO JUDAS TADEU LTDA - 30.540.454/0001-16',
    );
    const applyBtn = getByTestId('btn-apply-policyholders-filter');

    await act(async () => {
      fireEvent.click(option);
      waitFor(() => fireEvent.click(applyBtn));
    });

    waitFor(() =>
      expect(findByText('Estimativa de processos ativos')).toBeInTheDocument(),
    );
  });

  it('Should disable apply button when selection is applied', async () => {
    const { findByText, getByText, getByTestId } = render(
      <Provider store={store}>
        <AllPolicyholdersInWalletFilterSelector />
      </Provider>,
    );

    const option = await findByText(
      'CONSTRUTORA SAO JUDAS TADEU LTDA - 30.540.454/0001-16',
    );
    const applyBtn = getByTestId('btn-apply-policyholders-filter');
    waitFor(async () => {
      fireEvent.click(option);
    });
    expect(getByText('CONSTRUTORA SAO JUDAS TADEU...')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(applyBtn);
    });
    expect(getByTestId('btn-apply-policyholders-filter')).toBeDisabled();
  });

  it('Should remove selected policyholder on tag button click', async () => {
    const { findByText, getByText, queryByText } = render(
      <Provider store={store}>
        <AllPolicyholdersInWalletFilterSelector />
      </Provider>,
    );
    const option = await findByText(
      'CONSTRUTORA SAO JUDAS TADEU LTDA - 30.540.454/0001-16',
    );
    await act(async () => {
      fireEvent.click(option);
    });
    expect(getByText('CONSTRUTORA SAO JUDAS TADEU...')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(
        getByText('CONSTRUTORA SAO JUDAS TADEU...').querySelectorAll(
          'button',
        )[0],
      );
    });
    expect(
      queryByText('CONSTRUTORA SAO JUDAS TADEU...'),
    ).not.toBeInTheDocument();
  });

  it('Should clear all selection on component and store on clear button click', async () => {
    const { findByText, getByText, queryByText, getByTestId } = render(
      <Provider store={store}>
        <AllPolicyholdersInWalletFilterSelector />
      </Provider>,
    );
    const option = await findByText(
      'CONSTRUTORA SAO JUDAS TADEU LTDA - 30.540.454/0001-16',
    );
    await act(async () => {
      fireEvent.click(option);
    });

    expect(getByText('CONSTRUTORA SAO JUDAS TADEU...')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(getByTestId('btn-clear-policyholders'));
    });

    expect(
      queryByText('CONSTRUTORA SAO JUDAS TADEU...'),
    ).not.toBeInTheDocument();
  });
});
