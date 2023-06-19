import '@testing-library/jest-dom';
import { MODALITIES_INFORMATION } from 'modules/vendors-proposal/src/constants';
import { ModalityModel } from '../../../application/types/model';
import { fireEvent, act, render } from '../../../config/testUtils';
import ModalitiesInformationModal from './ModalitiesInformationModal';

describe('ModalitiesInformationModal', () => {
  const setOpenModalMock = jest.fn();
  const modalitiesMock: ModalityModel[] = [
    {
      modalityId: 96,
      externalDescription: 'Executante construtor',
      allowsAdditionalCoverageLabor: true,
      submodalities: [
        {
          subModalityId: 90,
          externalDescription: 'Convencional',
        },
      ],
      value: '96',
      label: 'Executante construtor',
    },
  ];

  it('should render correctly', async () => {
    const { baseElement, getByText } = render(
      <ModalitiesInformationModal
        openModal
        setOpenModal={setOpenModalMock}
        modalityOptionsMapped={modalitiesMock}
      />,
    );

    const text = await getByText(MODALITIES_INFORMATION[0].text);

    expect(baseElement).toBeInTheDocument();
    expect(text).toBeInTheDocument();
  });

  it('should allow the user to close the modal by the backdrop or button', async () => {
    const { getByTestId } = render(
      <ModalitiesInformationModal
        openModal
        setOpenModal={setOpenModalMock}
        modalityOptionsMapped={modalitiesMock}
      />,
    );

    const backdrop = getByTestId('modal-backdrop');
    const closeButton = getByTestId('modal-close-button');

    await act(async () => {
      await fireEvent.click(backdrop);
    });

    expect(setOpenModalMock).toHaveBeenCalledWith(false);

    await act(async () => {
      await fireEvent.click(closeButton);
    });

    expect(setOpenModalMock).toHaveBeenCalledWith(false);
  });
});
