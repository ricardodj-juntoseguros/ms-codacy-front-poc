import '@testing-library/jest-dom';
import * as reactRedux from 'react-redux';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { MODALITIES_INFORMATION } from '../../../constants';
import ModalitySelectionAPI from '../../../application/features/ModalitySelection/ModalitySelectionAPI';
import { proposalActions } from '../../../application/features/proposal/ProposalSlice';
import { act, fireEvent, render } from '../../../config/testUtils';
import { modalityListMock, storeMock } from '../../../__mocks__';
import WarrantyData from './WarrantyData';

const mockHistoryPush = jest.fn();
jest.mock('react-router', () => {
  const rest = jest.requireActual('react-router');

  return {
    ...rest,
    useHistory: () => ({
      push: mockHistoryPush,
    }),
  };
});

describe('WarrantyData', () => {
  const handleNextStepMock = jest.fn();
  const updateTitle = jest.fn();
  const mockDispatch = jest.fn();
  const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  jest
    .spyOn(ModalitySelectionAPI, 'getModalities')
    .mockImplementation(() => Promise.resolve(modalityListMock));

  beforeEach(() => {
    useSelectorMock.mockClear();
    useDispatchMock.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    useSelectorMock.mockImplementation(select =>
      select({
        ...storeMock,
        proposal: {
          ...storeMock.proposal,
          contractValue: 1000,
          insuredFederalId: '99999999999999',
        },
      }),
    );
    useDispatchMock.mockImplementation(() => mockDispatch);
    const { baseElement } = render(
      <WarrantyData
        handleNextStep={handleNextStepMock}
        updateTitle={updateTitle}
      />,
    );

    expect(baseElement).toBeInTheDocument();
  });

  it('should go to summary page if create proposal success is true', () => {
    useSelectorMock.mockImplementation(select =>
      select({
        ...storeMock,
        proposal: {
          ...storeMock.proposal,
          contractValue: 1000,
          createProposalSuccess: true,
        },
      }),
    );
    useDispatchMock.mockImplementation(() => mockDispatch);
    render(
      <WarrantyData
        handleNextStep={handleNextStepMock}
        updateTitle={updateTitle}
      />,
    );

    expect(mockHistoryPush).toHaveBeenCalled();
  });

  it('should allow the user to fill in the fields', async () => {
    const updatedStoreMock = {
      ...storeMock,
      proposal: {
        ...storeMock.proposal,
        modality: {
          modalityId: 96,
          externalDescription: 'Executante construtor',
          allowsAdditionalCoverageLabor: true,
          submodalities: [
            {
              subModalityId: 1,
              externalDescription: 'Convencional',
              additionalCoverage: false,
            },
            {
              submodalityId: 26,
              externalDescription: 'Trabalhista e Previdenciária',
              additionalCoverage: true,
            },
          ],
          label: 'Executante construtor',
          value: '96',
        },
      },
      validation: {
        ...storeMock.validation,
        errors: {
          warrantyPercentage: ['O preenchimento deste campo é obrigatório'],
          modality: ['O preenchimento deste campo é obrigatório'],
        },
      },
    };
    useSelectorMock.mockImplementation(select =>
      select({ ...updatedStoreMock }),
    );
    useDispatchMock.mockImplementation(() => mockDispatch);

    const { getByTestId, getByText, queryAllByText } = render(
      <WarrantyData
        handleNextStep={handleNextStepMock}
        updateTitle={updateTitle}
      />,
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      proposalActions.setInitialValidity({
        value: format(new Date(), 'dd/MM/yyyy', { locale: ptBR }),
        isValid: true,
      }),
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      proposalActions.setEndValidity({ value: '', isValid: false }),
    );

    const warrantyPercentageInput = getByTestId(
      'warrantyData-input-warranty-percentage',
    );
    expect(warrantyPercentageInput).toBeInTheDocument();

    await act(async () => {
      await fireEvent.change(warrantyPercentageInput, {
        target: { value: 80 },
      });
    });
    expect(mockDispatch).toHaveBeenCalledWith(
      proposalActions.setWarrantyPercentage(80),
    );
    await act(async () => {
      await fireEvent.blur(warrantyPercentageInput);
    });

    const modalityInput = getByTestId('warrantyData-dropdown-modality');
    expect(modalityInput).toBeInTheDocument();

    const modality = getByText(modalityListMock[0].externalDescription);
    await act(async () => {
      await fireEvent.click(modality);
    });

    expect(mockDispatch).toHaveBeenNthCalledWith(
      6,
      proposalActions.setModality({
        ...modalityListMock[0],
        label: modalityListMock[0].externalDescription,
        value: modalityListMock[0].modalityId.toString(),
      }),
    );

    const additionalCoverageLaborInput = getByTestId(
      'warrantyData-toogle-additional-coverage',
    );
    expect(additionalCoverageLaborInput).toBeInTheDocument();

    await act(async () => {
      await fireEvent.click(additionalCoverageLaborInput);
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      proposalActions.setAdditionalCoverageLabor(true),
    );

    const errorMessage = await queryAllByText(
      'O preenchimento deste campo é obrigatório',
    );
    expect(errorMessage.length).not.toEqual(0);
  });

  it('should open the information modal of the modalities', async () => {
    const { getByTestId, getByText } = render(
      <WarrantyData
        handleNextStep={handleNextStepMock}
        updateTitle={updateTitle}
      />,
    );

    const linkButton = getByTestId(
      'warrantyData-link-button-modality-information',
    );
    await act(async () => {
      await fireEvent.click(linkButton);
    });

    const text = getByText('Qual é a finalidade do contrato a ser garantido?');
    expect(text).toBeInTheDocument();

    const infoText = getByText(MODALITIES_INFORMATION[0].text);
    expect(infoText).toBeInTheDocument();
  });

  it('should render the calculated coverage value', async () => {
    const updatedStoreMock = {
      ...storeMock,
      proposal: {
        ...storeMock.proposal,
        totalValue: 800,
      },
    };
    useSelectorMock.mockImplementation(select =>
      select({ ...updatedStoreMock }),
    );
    useDispatchMock.mockImplementation(() => mockDispatch);

    const { getByText } = render(
      <WarrantyData
        handleNextStep={handleNextStepMock}
        updateTitle={updateTitle}
      />,
    );

    const value = getByText('R$ 800,00');

    expect(value).toBeInTheDocument();
  });
});
