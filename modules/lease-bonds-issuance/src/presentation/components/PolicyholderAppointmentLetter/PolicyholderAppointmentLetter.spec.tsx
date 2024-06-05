/* eslint-disable prefer-promise-reject-errors */
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { BrokerPlatformAuthService } from '@services';
import { fireEvent, render, waitFor } from '../../../config/testUtils';
import { store } from '../../../config/store';
import PolicyholderAppointmentLetter from './PolicyholderAppointmentLetter';
import PolicyholderSelectionApi from '../../../application/features/policyholderSelection/PolicyholderSelectionApi';
import { brokerMock } from '../../../__mocks__';

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('PolicyholderAppointmentLetter', () => {
  const windowOpen = jest.fn();
  window.open = windowOpen;

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
    jest
      .spyOn(BrokerPlatformAuthService, 'getBroker')
      .mockReturnValue(brokerMock);
  });

  const file = new File(['(⌐□_□)'], 'file.pdf', {
    type: 'application/pdf',
  });

  it('should be able to download appointment letter template', async () => {
    const { getByTestId } = render(<PolicyholderAppointmentLetter />);
    const button = getByTestId(
      'policyholderAppointmentLetter-button-download-template',
    );
    await act(async () => {
      await fireEvent.click(button);
    });
    expect(window.open).toHaveBeenCalledWith(
      'https://static.juntoseguros.com/docs/Carta+de+Nomeac%CC%A7a%CC%83o+do+Corretor.docx',
      '_blank',
    );
  });

  it('Should be able to upload appointment letter', async () => {
    jest
      .spyOn(PolicyholderSelectionApi, 'postAppointmentLetter')
      .mockImplementation(() => Promise.resolve());
    const { getByTestId, queryByTestId } = render(
      <PolicyholderAppointmentLetter />,
    );
    await act(async () => {
      await fireEvent.change(getByTestId('input-files'), {
        target: { files: [file] },
      });
    });
    await act(async () => {
      await fireEvent.click(getByTestId('remove-file'));
    });
    const fileList = await queryByTestId('list-files');
    expect(fileList).not.toBeInTheDocument();
    await act(async () => {
      await fireEvent.change(getByTestId('input-files'), {
        target: { files: [file] },
      });
    });
    await act(async () => {
      await fireEvent.click(
        getByTestId('policyholderAppointmentLetter-submit-button'),
      );
    });
    const state = store.getState();
    await waitFor(() => {
      expect(state.policyholderSelection.policyholderSearchValue).toEqual('');
      expect(state.policyholderSelection.policyholderOptions).toEqual([]);
      expect(mockHistoryPush).toHaveBeenCalledWith('/appointment-sent');
    });
  });

  it('should be able to display an error if the document is not sent successfully', async () => {
    jest
      .spyOn(PolicyholderSelectionApi, 'postAppointmentLetter')
      .mockImplementation(() =>
        Promise.reject({ data: { message: 'Erro ao enviar do documento' } }),
      );
    const { getByTestId, getAllByText } = render(
      <PolicyholderAppointmentLetter />,
    );
    await act(async () => {
      await fireEvent.change(getByTestId('input-files'), {
        target: { files: [file] },
      });
    });
    await act(async () => {
      await fireEvent.click(
        getByTestId('policyholderAppointmentLetter-submit-button'),
      );
    });
    expect(getAllByText('Erro ao enviar do documento')[0]).toBeInTheDocument();
  });
});
