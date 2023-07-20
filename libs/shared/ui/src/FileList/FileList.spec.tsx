import '@testing-library/jest-dom';
import { act, fireEvent, render } from '@testing-library/react';
import { downloadFile } from '@shared/utils';
import { FileList } from './FileList';

jest.mock('@shared/utils', () => {
  const original = jest.requireActual('@shared/utils');
  return {
    ...original,
    downloadFile: jest.fn(),
  };
});

describe('FileList', () => {
  const filesMock = [
    { filename: 'file01', size: 12345614, url: 'url1' },
    { filename: 'file02', size: 123456123, url: 'url2' },
  ];

  it('should render correctly', async () => {
    const { getByTestId, getByText } = render(<FileList files={filesMock} />);

    const downloadButton = getByTestId('fileList-button-dowload-files');
    const filename01 = getByText('file01');
    const filename02 = getByText('file02');

    expect(downloadButton).toBeInTheDocument();
    expect(filename01).toBeInTheDocument();
    expect(filename02).toBeInTheDocument();
  });

  it('should call download files correctly', async () => {
    const { getByTestId } = render(<FileList files={filesMock} />);

    const downloadButton = getByTestId('fileList-button-dowload-files');
    await act(async () => {
      await fireEvent.click(downloadButton);
    });

    expect(downloadButton).toBeInTheDocument();
    expect(downloadFile).toBeCalledWith('url1');
    expect(downloadFile).toBeCalledWith('url2');
  });

  it('should not render button if files list empty', async () => {
    const { queryByTestId } = render(<FileList files={[]} />);

    const downloadButton = await queryByTestId('fileList-button-dowload-files');

    expect(downloadButton).not.toBeInTheDocument();
  });
});
