import '@testing-library/jest-dom';
import {
  act,
  fireEvent,
  render,
  cleanup,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UploaderFile from './UploaderFile';
import ImportMappingApi from '../../../application/features/importMapping/ImportMappingApi';

const historyMock = jest.fn();
window.open = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useHistory: () => ({
    push: historyMock,
  }),
}));

jest
  .spyOn(ImportMappingApi.prototype, 'generateUploadProcessId')
  .mockImplementation(async () => {
    return { id: 123456 };
  });

const mockUpload = jest
  .spyOn(ImportMappingApi.prototype, 'sendUploadFile')
  .mockImplementation(() => Promise.resolve());

const mockCheckout = jest
  .spyOn(ImportMappingApi.prototype, 'finalizeUploadProcess')
  .mockImplementation(() => Promise.resolve());

describe('UploaderFile', () => {
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
    cleanup();
  });

  const file = new File(['(⌐□_□)'], 'sheet01.xls', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const fileWord = new File(['(⌐□_□)'], 'doc01.docx', {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });

  const mockClearDAta = jest.fn();

  it('should upload component render successfully', async () => {
    const { baseElement, getByText } = render(<UploaderFile />);

    expect(baseElement).toBeTruthy();
    expect(getByText('Clique aqui')).toBeTruthy();
  });

  it('should download link button call window open to download the sample file', () => {
    const { getByTestId } = render(<UploaderFile />);

    const btnLink = getByTestId('download-link');
    fireEvent.click(btnLink);

    expect(window.open).toBeCalled();
  });

  it('Should input file work successfully', async () => {
    jest
      .spyOn(ImportMappingApi.prototype, 'generateUploadProcessId')
      .mockImplementation(() => Promise.resolve({ id: 123456 }));

    const { getByTestId, findByText } = render(<UploaderFile />);
    const uploaderInput = getByTestId('input-files') as HTMLInputElement;

    fireEvent.change(uploaderInput, {
      target: { files: [file] },
    });

    expect(await findByText('sheet01.xls')).toBeTruthy();

    const inputFiles = { ...uploaderInput.files };

    expect(uploaderInput).toBeInTheDocument();
    expect(uploaderInput.files?.length).toBe(1);
    expect(inputFiles[0].name).toBe('sheet01.xls');
    expect(inputFiles[0].type).toBe(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
  });

  it('Should show error toast using multiple files', async () => {
    jest
      .spyOn(ImportMappingApi.prototype, 'generateUploadProcessId')
      .mockImplementation(() => Promise.resolve({ id: 123456 }));

    const { getByTestId, getByText } = render(<UploaderFile />);
    const uploaderInput = getByTestId('input-files') as HTMLInputElement;

    fireEvent.change(uploaderInput, {
      target: { files: [file, fileWord] },
    });
    expect(getByText('Envie somente 1 arquivo por vez')).toBeInTheDocument();
  });

  it('Should render upload drop  successfully', async () => {
    const { getByTestId } = render(<UploaderFile />);
    const uploaderDrop = getByTestId('drop-files');

    await act(async () => {
      fireEvent.drop(uploaderDrop, {
        dataTransfer: { files: [file], clearData: mockClearDAta },
      });
    });

    expect(uploaderDrop).toBeInTheDocument();
  });

  it('Should show error toast dropping multiple files', async () => {
    const { getByTestId, findAllByText } = render(<UploaderFile />);
    const uploaderDrop = getByTestId('drop-files');

    await act(async () => {
      fireEvent.drop(uploaderDrop, {
        dataTransfer: { files: [file, fileWord], clearData: mockClearDAta },
      });
    });

    expect(await findAllByText('Envie somente 1 arquivo por vez')).toBeTruthy();
  });

  it('Should to call upload and checkout processes and call home page using history', async () => {
    const { findByText, getByTestId } = render(
      <MemoryRouter>
        <UploaderFile />
      </MemoryRouter>,
    );
    const uploaderInput = getByTestId('input-files') as HTMLInputElement;

    await waitFor(async () => {
      fireEvent.change(uploaderInput, {
        target: { files: [file] },
      });

      const btnSend = getByTestId('btn-send');
      fireEvent.click(btnSend);
      expect(mockUpload).toBeCalledTimes(1);
      expect(mockCheckout).toBeCalledTimes(1);

      const btnOk = await findByText('Ok');
      fireEvent.click(btnOk);
      expect(historyMock).toHaveBeenCalledWith('/');
    });
  });

  it('Should finish upload process and stay on same page to enable a new request ', async () => {
    const { findByTestId, findByText, getByTestId } = render(
      <MemoryRouter>
        <UploaderFile />
      </MemoryRouter>,
    );
    const uploaderInput = getByTestId('input-files') as HTMLInputElement;

    await waitFor(async () => {
      fireEvent.change(uploaderInput, {
        target: { files: [file] },
      });
      const btnSend = await findByTestId('btn-send');
      fireEvent.click(btnSend);
      const btnNewSolicitation = await findByTestId('new-request-btn');
      fireEvent.click(btnNewSolicitation);
      expect(await findByText('Baixar planilha modelo')).toBeTruthy();
    });
  });
});
