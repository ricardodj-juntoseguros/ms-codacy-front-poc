import '@testing-library/jest-dom';
import { downloadFile } from '@shared/utils';
import {
  postQuotation,
  putQuotation,
  quoteSliceActions,
} from '../../../application/features/quote/QuoteSlice';
import { store } from '../../../config/store';
import { act, fireEvent, render, waitFor } from '../../../config/testUtils';
import ValidityAndValueForm from './ValidityAndValueForm';
import {
  createQuoteMock,
  proposalResumeMock,
  quoteResultMock,
} from '../../../__mocks__';
import QuoteApi from '../../../application/features/quote/QuoteApi';
import { QuotationDTO } from '../../../application/types/dto';

const advanceStepMock = jest.fn();
const mockHook = jest.fn();

jest.mock('@shared/hooks', () => {
  const originalModule = jest.requireActual('@shared/hooks');
  return {
    __esModule: true,
    ...originalModule,
    useFlow: () => ({
      advanceStep: advanceStepMock,
    }),
  };
});
jest.mock('@shared/utils', () => {
  const originalModule = jest.requireActual('@shared/utils');
  return {
    __esModule: true,
    ...originalModule,
    downloadFile: jest.fn(),
  };
});
jest.mock('../../hooks', () => {
  const rest = jest.requireActual('../../hooks');
  return {
    ...rest,
    useQuotation: () => mockHook,
  };
});
jest.mock('junto-design-system', () => {
  const original = jest.requireActual('junto-design-system');
  return {
    ...original,
    makeToast: jest.fn(),
  };
});
describe('ValidityAndValueForm', () => {
  beforeEach(() => {
    store.dispatch(quoteSliceActions.resetQuote());
  });

  it('Should have submit button disabled if there is no currentQuote in store', async () => {
    const { findByTestId } = render(
      <ValidityAndValueForm name="validityAndValue" />,
    );
    expect(await findByTestId('validityAndValue-button-submit')).toBeDisabled();
  });

  it('Should have submit button disabled if hasQuoteChanges flag in store is true', async () => {
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResultMock);
    await store.dispatch(postQuotation(createQuoteMock));
    store.dispatch(quoteSliceActions.setProposalFee(0.5));

    const { findByTestId } = render(
      <ValidityAndValueForm name="validityAndValue" />,
    );
    expect(await findByTestId('validityAndValue-button-submit')).toBeDisabled();
  });

  it('Should call advanceStep on useFlow hook on submit', async () => {
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResultMock);
    const { findByTestId } = render(
      <ValidityAndValueForm name="validityAndValue" />,
    );
    await store.dispatch(postQuotation(createQuoteMock));
    const submit = await findByTestId('validityAndValue-button-submit');
    expect(submit).not.toBeDisabled();
    await act(async () => {
      await fireEvent.click(submit);
    });
    expect(advanceStepMock).toHaveBeenCalledWith('validityAndValue');
  });

  it('Should be able to download quotation document if there is a valid current quote', async () => {
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResultMock);
    const downloadMock = jest
      .spyOn(QuoteApi, 'getQuotationDocument')
      .mockImplementation(async () => 'Ok');
    const { findByTestId } = render(
      <ValidityAndValueForm name="validityAndValue" />,
    );
    await store.dispatch(postQuotation(createQuoteMock));
    const download = await findByTestId('validityAndValue-button-download');
    await act(async () => {
      await fireEvent.click(download);
    });
    expect(downloadMock).toHaveBeenCalledWith(1868859);
    expect(downloadFile).toHaveBeenCalled();
  });

  it('Should call useQuotation hook on render if there is current quote without prize and isQuoteResume is true', async () => {
    store.dispatch(quoteSliceActions.setQuoteResumeData(proposalResumeMock));
    const { container } = render(
      <ValidityAndValueForm name="validityAndValue" />,
    );
    expect(container).toBeInTheDocument();

    await waitFor(() => {
      expect(mockHook).toHaveBeenCalled();
    });
  });

  it('Should display error alert if a quotation update or create fails', async () => {
    jest
      .spyOn(QuoteApi, 'putQuotation')
      .mockImplementation(async () => Promise.reject());
    const { findByText } = render(
      <ValidityAndValueForm name="validityAndValue" />,
    );
    store.dispatch(
      putQuotation({ proposalId: 90895, quoteData: {} as QuotationDTO }),
    );
    expect(
      await findByText(
        'Ops! Parece que tivemos um problema ao gerar a sua cotação.',
      ),
    ).toBeInTheDocument();
  });
});
