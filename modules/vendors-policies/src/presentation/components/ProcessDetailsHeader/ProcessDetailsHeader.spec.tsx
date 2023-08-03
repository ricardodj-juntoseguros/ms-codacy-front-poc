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
    processStatusConfig: PROCESS_STATUS[5],
    userType: 'policyholder',
    dateIssuance: new Date().toISOString(),
    policyNumber: 'a21bds213',
  };
  jest.spyOn(DocumentAPI, 'getPolicyDocument').mockImplementation(async () => ({
    linkDocumento: 'link_document',
  }));

  it('Should render correctly', async () => {
    const { getByTestId } = render(
      <ProcessDetailsHeader {...detailsHeaderMock} />,
    );

    const downloadPolicyButton = getByTestId(
      'processDetailsHeader-button-download-policy',
    );
    expect(downloadPolicyButton).toBeInTheDocument();

    await act(async () => {
      await fireEvent.click(downloadPolicyButton);
    });

    expect(downloadFile).toHaveBeenCalledWith('link_document');
  });
});
