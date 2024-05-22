import '@testing-library/jest-dom';
import { fireEvent, render, act } from '../../../config/testUtils';
import ProposalApi from '../../../application/features/proposal/ProposalApi';
import { quoteSliceActions } from '../../../application/features/quote/QuoteSlice';
import {
  insuredMock,
  objectPreviewResultMock,
  policyholderDetailsMock,
  proposalMock,
} from '../../../__mocks__';
import {
  proposalActions,
  putProposal,
} from '../../../application/features/proposal/ProposalSlice';
import ObjectPreviewApi from '../../../application/features/objectPreview/ObjectPreviewApi';
import { store } from '../../../config/store';
import InsuredDataFooter from './InsuredDataFooter';

const updateProposalMock = jest.fn();
jest.mock('../../hooks', () => {
  const rest = jest.requireActual('../../hooks');
  return {
    ...rest,
    useProposal: () => updateProposalMock,
  };
});

describe('InsuredDataFooter', () => {
  const mockResult = {
    ProposalId: 12345,
    PolicyId: 11111,
    QuotationId: 12223,
    NewQuoterId: 123333,
    createdAt: '2024-01-01T12:00:00.000Z',
  };
  const mockSubmit = jest.fn();

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
  });

  it('should be able to call submit form function', async () => {
    jest
      .spyOn(ProposalApi, 'putProposal')
      .mockImplementation(() => Promise.resolve(mockResult));
    await store.dispatch(
      quoteSliceActions.setPolicyholder(
        policyholderDetailsMock.registrationData,
      ),
    );
    await store.dispatch(
      putProposal({ proposalId: 12345, proposalData: proposalMock }),
    );
    store.dispatch(proposalActions.setInsured(insuredMock));
    store.dispatch(proposalActions.setInsuredAddress(insuredMock.addresses[0]));
    store.dispatch(proposalActions.setBiddingNumber('123456'));
    const { getByTestId } = render(
      <form onSubmit={() => mockSubmit()}>
        <InsuredDataFooter />
      </form>,
    );
    const submitButton = getByTestId('insuredDataFooter-submit-button');
    expect(submitButton).not.toBeDisabled();
    await act(async () => {
      await fireEvent.click(submitButton);
    });
    expect(mockSubmit).toHaveBeenCalled();
  });

  it('should be able to open object preview modal', async () => {
    const objectPreviewApiMock = jest
      .spyOn(ObjectPreviewApi, 'getObjectPreview')
      .mockImplementation(() => Promise.resolve(objectPreviewResultMock));
    jest
      .spyOn(ProposalApi, 'putProposal')
      .mockImplementation(() => Promise.resolve(mockResult));
    await store.dispatch(
      quoteSliceActions.setPolicyholder(
        policyholderDetailsMock.registrationData,
      ),
    );
    await store.dispatch(
      putProposal({ proposalId: 12345, proposalData: proposalMock }),
    );
    const { getByTestId } = render(
      <form onSubmit={() => mockSubmit}>
        <InsuredDataFooter />
      </form>,
    );
    const objectPreviewButton = getByTestId(
      'insuredDataFooter-show-object-preview-button',
    );
    store.dispatch(proposalActions.setInsured(insuredMock));
    store.dispatch(proposalActions.setInsuredAddress(insuredMock.addresses[0]));
    store.dispatch(proposalActions.setBiddingNumber('123456'));
    expect(objectPreviewButton).not.toBeDisabled();
    await act(async () => {
      await fireEvent.click(objectPreviewButton);
    });
    expect(getByTestId('modal-backdrop')).toBeInTheDocument();
    expect(objectPreviewApiMock).toHaveBeenCalled();
  });
});
