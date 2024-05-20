import '@testing-library/jest-dom';
import { FlowProvider, StepStatusEnum } from '@shared/hooks';
import { modalityBidderMock, policyholderMock } from '../../../__mocks__';
import { store } from '../../../config/store';
import { act, fireEvent, render } from '../../../config/testUtils';
import * as ALL_STEPS from '../../../constants/steps';
import { quoteSliceActions } from '../../../application/features/quote/QuoteSlice';
import { PolicyholderAffiliatesModel } from '../../../application/types/model';
import { policyholderSelectionActions } from '../../../application/features/policyholderSelection/PolicyholderSelectionSlice';
import { proposalActions } from '../../../application/features/proposal/ProposalSlice';
import SideSummary from './SideSummary';

describe('SideSummary', () => {
  const Component = () => {
    return <h1>Component</h1>;
  };

  const mockSteps = [
    {
      name: 'ComponentA',
      status: StepStatusEnum.FINISHED,
      component: Component,
      summaryTitle: 'ComponentA',
      title: {
        text: 'ComponentA',
        boldWords: [],
      },
    },
    {
      name: 'ComponentB',
      status: StepStatusEnum.FINISHED,
      component: Component,
      summaryTitle: 'ComponentB',
      title: {
        text: 'ComponentB',
        boldWords: [],
      },
    },
  ];

  it('should be able to edit any step', async () => {
    const { getByTestId, findByTestId } = render(
      <FlowProvider
        allSteps={mockSteps}
        initialSteps={mockSteps}
        showFinishedSteps={false}
      >
        <SideSummary />
      </FlowProvider>,
    );
    const editButtonComponentB = getByTestId(
      'sideSummary-editStep-link-button-ComponentB',
    );
    fireEvent.click(editButtonComponentB);
    const editButtonComponentA = await findByTestId(
      'sideSummary-editStep-link-button-ComponentA',
    );
    expect(editButtonComponentB).not.toBeInTheDocument();
    expect(editButtonComponentA).toBeInTheDocument();
  });

  it('should be able to view the menu in the mobile version', async () => {
    global.innerWidth = 743;
    global.innerHeight = 1038;
    global.dispatchEvent(new Event('resize'));
    const { getByTestId } = render(
      <FlowProvider
        allSteps={mockSteps}
        initialSteps={mockSteps}
        showFinishedSteps={false}
      >
        <SideSummary />
      </FlowProvider>,
    );
    const drawer = getByTestId('sideSummary-mobile-drawer');
    const aside = getByTestId('sideSummary-container-aside');
    await act(async () => {
      await fireEvent.touchStart(drawer, {
        touches: [{ clientY: 972.3 }],
      });
      await fireEvent.touchEnd(drawer, {
        changedTouches: [{ clientY: 764.76 }],
      });
    });
    expect(aside).toHaveClass('side-summary__wrapper--open');
    await act(async () => {
      await fireEvent.touchStart(drawer, {
        touches: [{ clientY: 764.76 }],
      });
      await fireEvent.touchEnd(drawer, {
        changedTouches: [{ clientY: 972.3 }],
      });
    });
    expect(aside).not.toHaveClass('side-summary__wrapper--open');
  });

  it('Should be able to open and render step summary details', async () => {
    store.dispatch(quoteSliceActions.setPolicyholder(policyholderMock));
    store.dispatch(
      quoteSliceActions.setPolicyholderAffiliate({
        id: 1234,
        companyName: 'TOMADOR TESTE – SQUAD DESACOPLAMENTO',
        city: 'CURITIBA',
        state: 'PR',
        federalId: '97.837.181/0020-00',
      } as PolicyholderAffiliatesModel),
    );
    store.dispatch(quoteSliceActions.setModality(modalityBidderMock));
    const { getByTestId, getByText } = render(
      <FlowProvider
        allSteps={Object.values(ALL_STEPS).flat()}
        initialSteps={ALL_STEPS.DEFAULT_STEP}
        showFinishedSteps={false}
      >
        <SideSummary />
      </FlowProvider>,
    );
    const button = getByTestId(
      'sideSummary-toggle-details-button-PolicyholderAndModalityForm',
    );
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(getByText('CNPJ')).toBeInTheDocument();
    expect(getByText('91.833.813/0001-18')).toBeInTheDocument();
    expect(getByText('Razão Social')).toBeInTheDocument();
    expect(
      getByText('TOMADOR TESTE – SQUAD DESACOPLAMENTO'),
    ).toBeInTheDocument();
    expect(getByText('Modalidade')).toBeInTheDocument();
    expect(getByText('Licitante')).toBeInTheDocument();
  });

  it('Should be able to render document summary', async () => {
    store.dispatch(
      policyholderSelectionActions.setCurrentAppointmentLetter({
        filename: 'carta-nomeacao.pdf',
        size: 200000,
      }),
    );
    const { getByText } = render(
      <FlowProvider
        allSteps={Object.values(ALL_STEPS).flat()}
        initialSteps={ALL_STEPS.DEFAULT_STEP}
        showFinishedSteps={false}
      >
        <SideSummary />
      </FlowProvider>,
    );
    expect(getByText('Documentos enviados')).toBeInTheDocument();
    expect(getByText('carta-nomeacao.pdf')).toBeInTheDocument();
    expect(getByText('0.19 MB')).toBeInTheDocument();
  });

  it('should be able to render proposal contacts summary', async () => {
    store.dispatch(proposalActions.setContacts(['teste@juntoseguros.com']));
    const { getByText } = render(
      <FlowProvider
        allSteps={Object.values(ALL_STEPS).flat()}
        initialSteps={ALL_STEPS.DEFAULT_STEP}
        showFinishedSteps={false}
      >
        <SideSummary />
      </FlowProvider>,
    );
    expect(getByText('Envio de apólice por e-mail')).toBeInTheDocument();
    expect(getByText('teste@juntoseguros.com')).toBeInTheDocument();
  });
});
