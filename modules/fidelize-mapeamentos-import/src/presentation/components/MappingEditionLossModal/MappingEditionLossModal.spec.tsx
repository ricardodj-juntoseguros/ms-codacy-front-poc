import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import MappingEditionLossModal from './MappingEditionLossModal';
import { store } from '../../../config/store';

describe('MappingEditionLossModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render without crashing', () => {
    const { getByText } = render(
      <Provider store={store}>
        <MappingEditionLossModal
          isOpen
          onModalClose={jest.fn()}
          onDiscardSelection={jest.fn()}
        />
      </Provider>,
    );
    expect(
      getByText('A edição de uma solicitação será perdida'),
    ).toBeInTheDocument();
    expect(
      getByText(
        'Você ainda não salvou as alterações que fez em uma solicitação, ao realizar essa ação você perderá a sua edição.',
      ),
    ).toBeInTheDocument();
  });

  it('Should call onModalClose callback on keep selection button click', () => {
    const onModalCloseMock = jest.fn();
    const { getByTestId } = render(
      <Provider store={store}>
        <MappingEditionLossModal
          isOpen
          onModalClose={onModalCloseMock}
          onDiscardSelection={jest.fn()}
        />
      </Provider>,
    );
    const btn = getByTestId('btn-discard-selection');
    fireEvent.click(btn);
    expect(onModalCloseMock).toHaveBeenCalled();
  });

  it('Should call onModalClose callback on modal close button click', () => {
    const onModalCloseMock = jest.fn();
    const { getByTestId } = render(
      <Provider store={store}>
        <MappingEditionLossModal
          isOpen
          onModalClose={onModalCloseMock}
          onDiscardSelection={jest.fn()}
        />
      </Provider>,
    );
    const btn = getByTestId('modal-close-button');
    fireEvent.click(btn);
    expect(onModalCloseMock).toHaveBeenCalled();
  });
});
