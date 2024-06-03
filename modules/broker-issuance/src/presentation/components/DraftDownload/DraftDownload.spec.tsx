/* eslint-disable prefer-promise-reject-errors */
import '@testing-library/jest-dom';
import { makeToast } from 'junto-design-system';
import { downloadFile } from '@shared/utils';
import { act, render, waitFor } from '../../../config/testUtils';
import ProposalApi from '../../../application/features/proposal/ProposalApi';
import DraftDownload from './DraftDownload';
import { store } from '../../../config/store';
import {
  proposalActions,
  putProposal,
} from '../../../application/features/proposal/ProposalSlice';
import { proposalMock } from '../../../__mocks__';

jest.mock('junto-design-system', () => {
  const original = jest.requireActual('junto-design-system');
  return {
    ...original,
    makeToast: jest.fn(),
  };
});
jest.mock('@shared/utils', () => {
  const original = jest.requireActual('@shared/utils');
  return {
    ...original,
    downloadFile: jest.fn(),
  };
});
const writeText = jest.fn();
Object.assign(navigator, {
  clipboard: {
    writeText,
  },
});

describe('DraftDownload', () => {
  let getProposalDraftMock: any = null;

  beforeAll(async () => {
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
    jest.spyOn(ProposalApi, 'putProposal').mockImplementation(() =>
      Promise.resolve({
        ProposalId: 12345,
        PolicyId: 11111,
        QuotationId: 12223,
        NewQuoterId: 123333,
        createdAt: '2021-01-01T00:00:00',
      }),
    );
    await store.dispatch(
      putProposal({ proposalId: 12345, proposalData: proposalMock }),
    );
  });

  beforeEach(() => {
    getProposalDraftMock = jest
      .spyOn(ProposalApi, 'getProposalDraft')
      .mockImplementation(() =>
        Promise.resolve({
          draftLink: 'draftLink',
        }),
      );
  });

  it('should be able to render an error if get proposal draft fails', async () => {
    getProposalDraftMock = jest
      .spyOn(ProposalApi, 'getProposalDraft')
      .mockImplementation(() => Promise.reject({ data: { message: 'error' } }));
    render(<DraftDownload />);
    await waitFor(async () => {
      await expect(getProposalDraftMock).toHaveBeenCalled();
    });
    expect(makeToast).toHaveBeenCalledWith('error', 'error');
  });

  it('should be able to correctly render direct issuance text', () => {
    store.dispatch(proposalActions.setIsAutomaticPolicy(true));
    const { getByText } = render(<DraftDownload />);
    const text = getByText(
      'Tudo certo até aqui! Agora você já pode baixar a sua minuta.',
    );
    expect(text).toBeInTheDocument();
  });

  it('should be able to correctly render internalized issuance text', () => {
    store.dispatch(proposalActions.setIsAutomaticPolicy(false));
    const { getByText } = render(<DraftDownload />);
    const text = getByText(
      'Agora você já pode baixar a sua minuta e validar sua garantia.',
    );
    expect(text).toBeInTheDocument();
  });

  it('should be able to copy the link to the clipboard correctly', async () => {
    const { getByTestId } = render(<DraftDownload />);
    const button = getByTestId('draftDownload-copy-draft-click');
    await waitFor(() => {
      expect(getByTestId('draftDownload-copy-draft-click')).toBeEnabled();
    });
    await act(async () => {
      await button.click();
    });
    expect(writeText).toHaveBeenCalledWith('draftLink');
    expect(makeToast).toHaveBeenCalledWith('success', 'Link copiado!');
  });
  it('should be able to download the draft correctly', async () => {
    const { getByTestId } = render(<DraftDownload />);
    const button = getByTestId('draftDownload-download-draft-click');
    await waitFor(() => {
      expect(getByTestId('draftDownload-download-draft-click')).toBeEnabled();
    });
    await act(async () => {
      await button.click();
    });
    expect(downloadFile).toHaveBeenCalledWith('draftLink', undefined, true);
  });
});
