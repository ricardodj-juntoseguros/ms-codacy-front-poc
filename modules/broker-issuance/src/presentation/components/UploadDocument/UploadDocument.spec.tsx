import '@testing-library/jest-dom';
import {
  fireEvent,
  render,
} from 'modules/broker-issuance/src/config/testUtils';
import UploadDocument from './UploadDocument';

describe('UploadDocument', () => {
  const file = new File(['(⌐□_□)'], 'fileTest2.pdf', {
    type: 'application/pdf',
  });
  const postDocumentMock = jest.fn();
  const removeDocumentMock = jest.fn();
  const storeDocuments = [
    {
      size: 12345,
      url: 'url',
      name: 'fileTest.pdf',
    },
  ];

  it('should be able to upload a document', async () => {
    const { getByTestId, getByText } = render(
      <UploadDocument
        onUploadDocuments={postDocumentMock}
        onRemoveDocument={removeDocumentMock}
        storeDocuments={storeDocuments}
        hasError={false}
      />,
    );
    const inputFiles = getByTestId('input-files');
    fireEvent.change(inputFiles, { target: { files: [file] } });
    expect(getByText('fileTest2.pdf')).toBeInTheDocument();
    expect(postDocumentMock).toHaveBeenCalled();
  });

  it('should be able to remove a document', async () => {
    const { getByTestId } = render(
      <UploadDocument
        onUploadDocuments={postDocumentMock}
        onRemoveDocument={removeDocumentMock}
        storeDocuments={storeDocuments}
        hasError={false}
      />,
    );
    const removeButton = getByTestId('remove-file');
    fireEvent.click(removeButton);
    expect(removeDocumentMock).toHaveBeenCalled();
  });
});
