/* eslint-disable prefer-promise-reject-errors */
import '@testing-library/jest-dom';
import { BrokerPlatformAuthService } from '@services';
import { AFFILIATE_DEFAULT_OPTIONS } from '../../../constants';
import ModalitySelecionApi from '../../../application/features/modalitySelection/ModalitySelecionApi';
import PolicyholderSelectionApi from '../../../application/features/policyholderSelection/PolicyholderSelectionApi';
import { act, fireEvent, render, waitFor } from '../../../config/testUtils';
import PolicyholderSelection from './PolicyholderSelection';
import {
  brokerMock,
  policyholderDetailsMock,
  policyholderSearchMock,
} from '../../../__mocks__';
import { store } from '../../../config/store';

describe('PolicyholderSelection', () => {
  const setNeedAppointmentLetterMock = jest.fn();
  let policyholderSearchApiMock: any = null;
  let getPolicyholderDetails: any = null;
  jest.spyOn(ModalitySelecionApi, 'fetchModalities').mockResolvedValue([]);

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    policyholderSearchApiMock = jest
      .spyOn(PolicyholderSelectionApi, 'searchPolicyHolder')
      .mockImplementation(() => Promise.resolve(policyholderSearchMock));
    getPolicyholderDetails = jest
      .spyOn(PolicyholderSelectionApi, 'getPolicyholderDetails')
      .mockImplementation(() => Promise.resolve(policyholderDetailsMock));
    jest
      .spyOn(BrokerPlatformAuthService, 'getBroker')
      .mockReturnValue(brokerMock);
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <PolicyholderSelection
        needAppointmentLetter={false}
        setNeedAppointmentLetter={setNeedAppointmentLetterMock}
        readonlyFields={false}
      />,
    );
    expect(baseElement).toBeTruthy();
  });

  it('should not dispatch searchPolicyholders thunk if inputted search value is less than 3 chars length', async () => {
    jest.useFakeTimers();
    jest.spyOn(PolicyholderSelectionApi, 'searchPolicyHolder');
    const { getByTestId } = render(
      <PolicyholderSelection
        needAppointmentLetter={false}
        setNeedAppointmentLetter={setNeedAppointmentLetterMock}
        readonlyFields={false}
      />,
    );
    const input = getByTestId('policyholderSelection-input-search');
    fireEvent.change(input, { target: { value: 'te' } });
    jest.runAllTimers();
    expect(PolicyholderSelectionApi.searchPolicyHolder).toHaveBeenCalledTimes(
      0,
    );
  });

  it('Should search policyholders, set store values', async () => {
    jest.useFakeTimers();
    policyholderSearchApiMock = jest
      .spyOn(PolicyholderSelectionApi, 'searchPolicyHolder')
      .mockImplementation(() => Promise.resolve(policyholderSearchMock));
    const { getByTestId } = render(
      <PolicyholderSelection
        needAppointmentLetter={false}
        setNeedAppointmentLetter={setNeedAppointmentLetterMock}
        readonlyFields={false}
      />,
    );
    fireEvent.change(getByTestId('policyholderSelection-input-search'), {
      target: { value: 'test' },
    });
    jest.runAllTimers();
    await waitFor(() => {
      expect(policyholderSearchApiMock).toHaveBeenCalledTimes(1);
    });
    expect(
      store.getState().policyholderSelection.policyholderSearchValue,
    ).toEqual('test');
  });

  it('Should search policyholders, set details on store', async () => {
    jest.useFakeTimers();
    policyholderSearchApiMock = jest
      .spyOn(PolicyholderSelectionApi, 'searchPolicyHolder')
      .mockImplementation(() => Promise.resolve(policyholderSearchMock));
    getPolicyholderDetails = jest
      .spyOn(PolicyholderSelectionApi, 'getPolicyholderDetails')
      .mockImplementation(() => Promise.resolve(policyholderDetailsMock));
    jest
      .spyOn(BrokerPlatformAuthService, 'getBroker')
      .mockReturnValue(brokerMock);

    const { getByTestId, getByText } = render(
      <PolicyholderSelection
        needAppointmentLetter={false}
        setNeedAppointmentLetter={setNeedAppointmentLetterMock}
        readonlyFields={false}
      />,
    );
    fireEvent.change(getByTestId('policyholderSelection-input-search'), {
      target: { value: 'test' },
    });
    jest.runAllTimers();
    await waitFor(() => {
      expect(policyholderSearchApiMock).toHaveBeenCalledWith('test');
    });
    await act(async () => {
      await fireEvent.click(getByText('99.999.999/9999-99 - Test'));
    });
    const state = store.getState();
    expect(getPolicyholderDetails).toHaveBeenCalledWith(9999, '99999999999999');
    expect(state.quote.policyholder).toEqual(
      policyholderDetailsMock.registrationData,
    );
    expect(state.policyholderSelection.affiliatesOptions.length).toEqual(3);
  });

  it('should be able a render toast error if policyholder details call fails', async () => {
    jest.useFakeTimers();
    policyholderSearchApiMock = jest
      .spyOn(PolicyholderSelectionApi, 'searchPolicyHolder')
      .mockImplementation(() => Promise.resolve(policyholderSearchMock));
    getPolicyholderDetails = jest
      .spyOn(PolicyholderSelectionApi, 'getPolicyholderDetails')
      .mockImplementation(() => Promise.reject({ data: { message: 'error' } }));
    jest
      .spyOn(BrokerPlatformAuthService, 'getBroker')
      .mockReturnValue(brokerMock);

    const { getByTestId, getByText } = render(
      <PolicyholderSelection
        needAppointmentLetter={false}
        setNeedAppointmentLetter={setNeedAppointmentLetterMock}
        readonlyFields={false}
      />,
    );
    fireEvent.change(getByTestId('policyholderSelection-input-search'), {
      target: { value: 'test' },
    });
    jest.runAllTimers();
    await waitFor(() => {
      expect(policyholderSearchApiMock).toHaveBeenCalledWith('test');
    });
    await act(async () => {
      await fireEvent.click(getByText('99.999.999/9999-99 - Test'));
    });
    await waitFor(() => {
      expect(getPolicyholderDetails).toHaveBeenCalledWith(
        9999,
        '99999999999999',
      );
    });
    const toast = getByText('Houve um erro ao buscar os dados do tomador');
    expect(toast).toBeInTheDocument();
  });

  it('should define the status for sending a letter with name if the policyholder is linked to another user', async () => {
    getPolicyholderDetails = jest
      .spyOn(PolicyholderSelectionApi, 'getPolicyholderDetails')
      .mockImplementation(() =>
        Promise.reject({
          data: {
            message:
              'Erro ao trazer detalhes do tomador, empresa está vinculada a outro corretor',
          },
        }),
      );
    jest
      .spyOn(BrokerPlatformAuthService, 'getBroker')
      .mockReturnValue(brokerMock);

    const { getByTestId, getByText } = render(
      <PolicyholderSelection
        needAppointmentLetter={false}
        setNeedAppointmentLetter={setNeedAppointmentLetterMock}
        readonlyFields={false}
      />,
    );
    fireEvent.change(getByTestId('policyholderSelection-input-search'), {
      target: { value: '99999999999999' },
    });
    await act(async () => {
      await fireEvent.click(getByText('99.999.999/9999-99 - Test'));
    });
    await waitFor(() => {
      expect(getPolicyholderDetails).toHaveBeenCalledWith(
        9999,
        '99999999999999',
      );
    });
    expect(setNeedAppointmentLetterMock.mock.calls[1][0]).toEqual(true);
  });

  it('should be able to selecte policyholder affiliate', async () => {
    const { getByTestId, getByText } = render(
      <PolicyholderSelection
        needAppointmentLetter={false}
        setNeedAppointmentLetter={setNeedAppointmentLetterMock}
        readonlyFields={false}
      />,
    );
    await act(async () => {
      await fireEvent.change(
        getByTestId('policyholderSelection-input-search'),
        {
          target: { value: 'test' },
        },
      );
    });
    await act(async () => {
      await fireEvent.click(getByText('99.999.999/9999-99 - Test'));
    });
    await waitFor(() => {
      expect(getPolicyholderDetails).toHaveBeenCalledWith(
        9999,
        '99999999999999',
      );
    });
    await act(async () => {
      await fireEvent.click(
        getByText('BOTUCATU - SP - CNPJ: 97.837.181/0020-00'),
      );
    });
    await waitFor(() => {
      const state = store.getState();
      expect(state.quote.policyholderAffiliate?.id).toEqual(
        policyholderDetailsMock.affiliates[0].id,
      );
      expect(state.quote.policyholderAffiliate?.companyName).toEqual(
        policyholderDetailsMock.affiliates[0].companyName,
      );
      expect(state.quote.policyholderAffiliate?.federalId).toEqual(
        policyholderDetailsMock.affiliates[0].federalId,
      );
      expect(state.quote.policyholderAffiliate?.city).toEqual(
        policyholderDetailsMock.affiliates[0].city,
      );
      expect(state.quote.policyholderAffiliate?.state).toEqual(
        policyholderDetailsMock.affiliates[0].state,
      );
    });
  });

  it('should be able to render not found affiliate alert', async () => {
    const { getByTestId, getByText, findByText } = render(
      <PolicyholderSelection
        needAppointmentLetter={false}
        setNeedAppointmentLetter={setNeedAppointmentLetterMock}
        readonlyFields={false}
      />,
    );
    await act(async () => {
      await fireEvent.change(
        getByTestId('policyholderSelection-input-search'),
        {
          target: { value: 'test' },
        },
      );
    });
    await act(async () => {
      await fireEvent.click(getByText('99.999.999/9999-99 - Test'));
    });
    await waitFor(() => {
      expect(getPolicyholderDetails).toHaveBeenCalledWith(
        9999,
        '99999999999999',
      );
    });
    await act(async () => {
      await fireEvent.click(getByText('Não encontrei minha filial'));
    });
    const state = store.getState();
    const alert = await findByText(
      'Seguiremos sua proposta com os dados da Matriz. Caso necessite cadastrar uma nova filial, entre em contato',
    );
    expect(state.quote.policyholderAffiliate).toEqual(
      AFFILIATE_DEFAULT_OPTIONS.notFoundAffiliate,
    );
    expect(alert).toBeInTheDocument();
  });
});
