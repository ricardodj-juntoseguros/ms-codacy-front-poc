import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import UploaderFile from './UploaderFile';

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
  const file = new File(['(⌐□_□)'], 'sheet01.xls', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const fileWord = new File(['(⌐□_□)'], 'doc01.docx', {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });

  const mockClearDAta = jest.fn();

  it('should upload component render successfully', () => {
    const { baseElement, getByText } = render(<UploaderFile />);

    expect(baseElement).toBeTruthy();
    expect(getByText('Clique aqui')).toBeTruthy();
  });

  it('Should input file work successfully', async () => {
    const { getByTestId } = render(<UploaderFile />);
    const uploaderInput = getByTestId('input-files') as HTMLInputElement;

    await fireEvent.change(uploaderInput, {
      target: { files: [file] },
    });

    const inputFiles = { ...uploaderInput.files };

    expect(uploaderInput).toBeInTheDocument();
    expect(uploaderInput.files?.length).toBe(1);
    expect(inputFiles[0].name).toBe('sheet01.xls');
    expect(inputFiles[0].type).toBe(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
  });

  it('Should show error toast using multiple files', async () => {
    const { getByTestId, getByText } = render(<UploaderFile />);
    const uploaderInput = getByTestId('input-files') as HTMLInputElement;

    await fireEvent.change(uploaderInput, {
      target: { files: [file, fileWord] },
    });

    expect(getByText('Envie somente 1 arquivo por vez')).toBeInTheDocument();
  });

  it('Should render upload drop  successfully', async () => {
    const { getByTestId } = render(<UploaderFile />);
    const uploaderDrop = getByTestId('drop-files');

    await fireEvent.drop(uploaderDrop, {
      dataTransfer: { files: [file], clearData: mockClearDAta },
    });

    expect(uploaderDrop).toBeInTheDocument();
  });

  it('Should show error toast dropping multiple files', async () => {
    const { getByTestId, getByText } = render(<UploaderFile />);
    const uploaderDrop = getByTestId('drop-files');
    setTimeout(async () => {
      await fireEvent.drop(uploaderDrop, {
        dataTransfer: { files: [file, fileWord], clearData: mockClearDAta },
      });
    }, 4000);

    expect(getByText('Envie somente 1 arquivo por vez')).toBeInTheDocument();
  });
});
