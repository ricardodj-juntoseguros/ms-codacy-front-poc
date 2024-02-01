import '@testing-library/jest-dom';
import * as reactRedux from 'react-redux';
import ObjectPreviewApi from '../../../application/features/objectPreview/ObjectPreviewApi';
import { fireEvent, render, waitFor } from '../../../config/testUtils';
import {
  insuredMock,
  modalityBidderMock,
  objectPreviewMock,
  objectPreviewResultMock,
  quoteResultMock,
  storeMock,
} from '../../../__mocks__';
import ObjectPreviewModal from './ObjectPreviewModal';

describe('ObjectPreviewModal', () => {
  const toggleModalMock = jest.fn();
  const mockDispatch = jest.fn();
  const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const updatedStoreMock = {
    ...storeMock,
    quote: {
      ...storeMock.quote,
      identification: {
        ProposalId: 12345,
        QuotationId: 12223,
        NewQuoterId: 123333,
      },
      durationInDays: 365,
      securedAmount: 1000000,
      endDateValidity: '14/11/2024',
      startDateValidity: '14/11/2023',
      totalPrize: 2600,
      currentQuote: quoteResultMock,
      modality: modalityBidderMock,
      policyholder: {
        ...storeMock.quote.policyholder,
        economicGroupId: 63076,
        economicGroupName: 'TOMADOR TESTE – SQUAD DESACOPLAMENTO',
      },
    },
    proposal: {
      identification: {
        PolicyId: 4236048,
      },
      insured: insuredMock,
      insuredAddress: insuredMock.addresses[0],
      loadingProposal: false,
      createProposalSuccess: false,
      hasProposalChanges: true,
      biddingDescription: '98765',
      biddingNumber: '12345',
    },
  };

  beforeEach(() => {
    useSelectorMock.mockClear();
    useDispatchMock.mockClear();
  });

  it('should be able to call toggle modal correctly', async () => {
    const getObjectPreviewMock = jest
      .spyOn(ObjectPreviewApi, 'getObjectPreview')
      .mockImplementation(() => Promise.resolve(objectPreviewResultMock));
    useSelectorMock.mockImplementation(select =>
      select({ ...updatedStoreMock }),
    );
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { baseElement, getByText, getByTestId } = render(
      <ObjectPreviewModal isModalOpen onToggleModal={toggleModalMock} />,
    );
    expect(baseElement).toBeInTheDocument();
    await waitFor(async () => {
      await expect(getObjectPreviewMock).toHaveBeenCalledWith(
        objectPreviewMock,
      );
    });
    expect(
      getByText('O objeto da sua apólice de seguro vai ficar assim:'),
    ).toBeInTheDocument();
    fireEvent.click(getByTestId('modal-close-button'));
    expect(toggleModalMock).toHaveBeenCalled();
    fireEvent.click(getByTestId('modal-backdrop'));
    expect(toggleModalMock).toHaveBeenCalled();
  });
});
