import '@testing-library/jest-dom';
import QuoteApi from '../../../application/features/quote/QuoteApi';
import {
  postQuotation,
  quoteSliceActions,
} from '../../../application/features/quote/QuoteSlice';
import {
  createQuoteMock,
  modalityServiceProfiderPerformerMock,
  quoteResultMock,
} from '../../../__mocks__';
import { fireEvent, render, waitFor } from '../../../config/testUtils';
import { store } from '../../../config/store';
import CoverageLabor from './CoverageLabor';

const mockHook = jest.fn();
jest.mock('../../hooks', () => {
  const rest = jest.requireActual('../../hooks');
  return {
    ...rest,
    useQuotation: () => mockHook,
  };
});

describe('CoverageLabor', () => {
  it('should be able to call the handleLaborChange function', async () => {
    store.dispatch(
      quoteSliceActions.setModality(modalityServiceProfiderPerformerMock),
    );
    const { getByTestId } = render(<CoverageLabor />);
    fireEvent.click(getByTestId('coverageLabor-labor-toggle'));
    let state = store.getState();
    expect(state.additionalCoverage.labor).toBe(true);
    expect(state.quote.submodality).toMatchObject({
      id: 26,
      newQuoterId: 13,
      description:
        'Trabalhista e Previdenciária (Nova Público - Sem Reembolso)',
      useBill: true,
      isSubstitute: false,
      isRecursal: false,
      payments: [
        {
          id: 1,
          description: 'Boleto',
        },
      ],
      appealJudicialPremium: null,
    });
    await waitFor(() => {
      expect(mockHook).toHaveBeenCalled();
    });
    fireEvent.click(getByTestId('coverageLabor-labor-toggle'));
    state = store.getState();
    expect(state.additionalCoverage.labor).toBe(false);
    expect(state.quote.submodality).toMatchObject({
      id: 1,
      newQuoterId: 1,
      description: 'Convencional',
      useBill: false,
      isSubstitute: false,
      isRecursal: false,
      payments: [
        {
          id: 1,
          description: 'Boleto',
        },
      ],
      appealJudicialPremium: null,
    });
    await waitFor(() => {
      expect(mockHook).toHaveBeenCalled();
    });
  });

  it('should be able to disable the rate aggravation', async () => {
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResultMock);
    await store.dispatch(postQuotation(createQuoteMock));
    await store.dispatch(quoteSliceActions.setToggleRateFlex());
    await store.dispatch(quoteSliceActions.setCommissionFlex(20));
    await store.dispatch(quoteSliceActions.setFeeFlex(2.0));
    await store.dispatch(quoteSliceActions.setProposalFee(2.5));
    const { getByTestId } = render(<CoverageLabor />);
    await fireEvent.click(getByTestId('coverageLabor-labor-toggle'));
    fireEvent.click(getByTestId('coverageLabor-rate-aggravation-toggle'));
    const state = store.getState();
    expect(state.additionalCoverage.rateAggravation).toBe(false);
    expect(state.quote.toggleRateFlex).toBe(false);
    expect(state.quote.commissionFlex).toBeNaN();
    expect(state.quote.feeFlex).toBeNaN();
    expect(state.quote.proposalFee).toBe(0.26);
    await waitFor(() => {
      expect(mockHook).toHaveBeenCalled();
    });
  });

  it('should be able to show tooltip message', async () => {
    const { getByTestId, queryByText } = render(<CoverageLabor />);
    fireEvent.mouseEnter(getByTestId('coverageLabor-tooltip-button'));
    expect(
      await queryByText(
        'Nessa modalidade é possível contratar uma cobertura adicional para risco Trabalhista e Previdenciário, que garante o pagamento ao segurado de prejuízos referente a ações trabalhistas decorrentes do contrato firmado.',
      ),
    ).toBeInTheDocument();
    fireEvent.mouseLeave(getByTestId('coverageLabor-tooltip-button'));
    expect(
      await queryByText(
        'Nessa modalidade é possível contratar uma cobertura adicional para risco Trabalhista e Previdenciário, que garante o pagamento ao segurado de prejuízos referente a ações trabalhistas decorrentes do contrato firmado.',
      ),
    ).not.toBeInTheDocument();
  });
});
