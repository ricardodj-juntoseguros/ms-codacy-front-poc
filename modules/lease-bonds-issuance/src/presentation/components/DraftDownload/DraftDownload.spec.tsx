import '@testing-library/jest-dom';
import { makeToast } from 'junto-design-system';
import { downloadFile } from '@shared/utils';
import { act, render } from '../../../config/testUtils';
import DraftDownload from './DraftDownload';

const writeText = jest.fn();
Object.assign(navigator, {
  clipboard: {
    writeText,
  },
});

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

describe('DraftDownload', () => {
  it('should be able to correctly render direct issuance text', () => {
    const { getByText } = render(
      <DraftDownload isAutomaticPolicy proposalDraft="url" />,
    );
    const text = getByText(
      'Tudo certo até aqui! Agora você já pode baixar a sua minuta.',
    );
    expect(text).toBeInTheDocument();
  });

  it('should be able to correctly render internalized issuance text', () => {
    const { getByText } = render(
      <DraftDownload isAutomaticPolicy={false} proposalDraft="url" />,
    );
    const text = getByText(
      'Agora você já pode baixar a sua minuta e validar sua garantia.',
    );
    expect(text).toBeInTheDocument();
  });

  it('should be able to copy the link to the clipboard correctly', async () => {
    const { getByTestId } = render(
      <DraftDownload isAutomaticPolicy proposalDraft="url" />,
    );
    const button = getByTestId('draftDownload-copy-draft-click');
    await act(async () => {
      await button.click();
    });
    expect(writeText).toHaveBeenCalledWith('url');
    expect(makeToast).toHaveBeenCalledWith('success', 'Link copiado!');
  });
  it('should be able to download the draft correctly', async () => {
    const { getByTestId } = render(
      <DraftDownload isAutomaticPolicy proposalDraft="url" />,
    );
    const button = getByTestId('draftDownload-download-draft-click');
    await act(async () => {
      await button.click();
    });
    expect(downloadFile).toHaveBeenCalledWith('url', undefined, true);
  });
});
