import '@testing-library/jest-dom';
import { downloadFile } from '@shared/utils';
import { PROCESS_STATUS } from '../../../constants';
import DocumentAPI from '../../../application/features/document/DocumentAPI';
import { act, fireEvent, render } from '../../../config/testUtils';
import ProcessDetailsHeader from './ProcessDetailsHeader';

jest.mock('@shared/utils', () => {
  const original = jest.requireActual('@shared/utils');
  return {
    ...original,
    downloadFile: jest.fn(),
  };
});

describe('ProcessDetailsHeader', () => {
  const windowOpen = jest.fn();
  window.open = windowOpen;
  process.env.NX_GLOBAL_MS_DOCUMENTS = '';
  const detailsHeaderMock = {
    createdAt: new Date().toISOString(),
    policyId: 123,
    proposalId: 12345,
    processStatusConfig: PROCESS_STATUS[3],
    userType: 'policyholder',
    dateIssuance: new Date().toISOString(),
    policyNumber: 'a21bds213',
  };
  const file = {
    fieldname: 'file',
    originalname: '3880885.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    buffer: Buffer.alloc(253397, 1),
    size: 415423,
    stream: undefined,
    destination: undefined,
    filename: undefined,
    path: undefined,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  jest.spyOn(DocumentAPI, 'getPolicyDocument').mockImplementation(async () => ({
    linkDocumento: 'link_document',
  }));
  jest.spyOn(DocumentAPI, 'getProposalDocument').mockImplementation(() => {
    return Promise.resolve(file);
  });

  it('Should render correctly', async () => {
    const { getByTestId } = render(
      <ProcessDetailsHeader {...detailsHeaderMock} />,
    );

    const downloadPolicyButton = getByTestId(
      'processDetailsHeader-button-download-action',
    );
    expect(downloadPolicyButton).toBeInTheDocument();

    await act(async () => {
      await fireEvent.click(downloadPolicyButton);
    });

    expect(downloadFile).toHaveBeenCalledWith('link_document');
  });

  it('Should download proposal document', async () => {
    const updatedDetailsHeaderMock = {
      ...detailsHeaderMock,
      processStatusConfig: PROCESS_STATUS[1],
    };

    const { getByTestId } = render(
      <ProcessDetailsHeader {...updatedDetailsHeaderMock} />,
    );

    const downloadButton = getByTestId(
      'processDetailsHeader-button-download-action',
    );
    expect(downloadButton).toBeInTheDocument();

    await act(async () => {
      await fireEvent.click(downloadButton);
    });

    expect(downloadFile).toHaveBeenCalledWith(new Blob(), 'proposta_123.pdf');
  });
});
