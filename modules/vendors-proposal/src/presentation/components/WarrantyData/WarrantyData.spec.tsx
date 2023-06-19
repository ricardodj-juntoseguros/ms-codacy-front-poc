import '@testing-library/jest-dom';
import * as reactRedux from 'react-redux';
import { MODALITIES_INFORMATION } from 'modules/vendors-proposal/src/constants';
import { format } from 'date-fns';
import { WarrantyDataSchema } from '../../../application/validations/schemas';
import { ValidationTypesEnum } from '../../../application/types/model';
import ModalitySelectionAPI from '../../../application/features/ModalitySelection/ModalitySelectionAPI';
import { proposalActions } from '../../../application/features/proposal/ProposalSlice';
import {
  act,
  fireEvent,
  queryAllByText,
  render,
} from '../../../config/testUtils';
import { modalityListMock, storeMock } from '../../../__mocks__';
import WarrantyData from './WarrantyData';

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
              subModalityId: 90,
              externalDescription: 'Convencional',
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
    expect(mockDispatch).toHaveBeenCalledWith(
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
        contractValue: 1000,
        warrantyPercentage: 80,
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
