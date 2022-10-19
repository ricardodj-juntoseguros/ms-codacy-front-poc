import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import OpportunitySelectionLossModal from './OpportunitySelectionLossModal';
import { store } from '../../../config/store';

describe('OpportunitySelectionLossModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render without crashing', () => {
    const { getByText } = render(
      <Provider store={store}>
        <OpportunitySelectionLossModal
          isOpen
          onModalClose={jest.fn()}
          onDiscardSelection={jest.fn()}
        />
      </Provider>,
    );
    expect(
      getByText('A sua seleção de oportunidades será perdida'),
    ).toBeInTheDocument();
    expect(
      getByText(
        'Você ainda não solicitou detalhes da(s) oportunidade(s) selecionada(s), ao realizar essa ação você perderá a sua seleção.',
      ),
    ).toBeInTheDocument();
  });

  it('Should render without crashing with discard-first variant', () => {
    const { getByText } = render(
      <Provider store={store}>
        <OpportunitySelectionLossModal
          isOpen
          variant="discard-first"
          onModalClose={jest.fn()}
          onDiscardSelection={jest.fn()}
        />
      </Provider>,
    );
    expect(
      getByText('Tem certeza que deseja descartar sua seleção?'),
    ).toBeInTheDocument();
    expect(
      getByText(
        'Você ainda não solicitou detalhes da(s) oportunidade(s) selecionada(s), ao realizar essa ação você perderá a sua seleção.',
      ),
    ).toBeInTheDocument();
  });

  it('Should call onModalClose callback on keep selection button click', () => {
    const onModalCloseMock = jest.fn();
    const { getByTestId } = render(
      <Provider store={store}>
        <OpportunitySelectionLossModal
          isOpen
          onModalClose={onModalCloseMock}
          onDiscardSelection={jest.fn()}
        />
      </Provider>,
    );
    const btn = getByTestId('btn-keep-selection');
    fireEvent.click(btn);
    expect(onModalCloseMock).toHaveBeenCalled();
  });

  it('Should call onModalClose callback on keep selection button click with discard-first variant', () => {
    const onModalCloseMock = jest.fn();
    const { getByTestId } = render(
      <Provider store={store}>
        <OpportunitySelectionLossModal
          isOpen
          variant="discard-first"
          onModalClose={onModalCloseMock}
          onDiscardSelection={jest.fn()}
        />
      </Provider>,
    );
    const btn = getByTestId('btn-keep-selection');
    fireEvent.click(btn);
    expect(onModalCloseMock).toHaveBeenCalled();
  });

  it('Should call onModalClose callback on modal close button click', () => {
    const onModalCloseMock = jest.fn();
    const { getByTestId } = render(
      <Provider store={store}>
        <OpportunitySelectionLossModal
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

  it('Should call onDiscardSelection callback on discard selection button click', () => {
    const onDiscardMock = jest.fn();
    const { getByTestId } = render(
      <Provider store={store}>
        <OpportunitySelectionLossModal
          isOpen
          onModalClose={jest.fn()}
          onDiscardSelection={onDiscardMock}
        />
      </Provider>,
    );
    const btn = getByTestId('btn-discard-selection');
    fireEvent.click(btn);
    expect(onDiscardMock).toHaveBeenCalled();
  });

  it('Should call onDiscardSelection callback on discard selection button click with discard-first variant', () => {
    const onDiscardMock = jest.fn();
    const { getByTestId } = render(
      <Provider store={store}>
        <OpportunitySelectionLossModal
          isOpen
          variant="discard-first"
          onModalClose={jest.fn()}
          onDiscardSelection={onDiscardMock}
        />
      </Provider>,
    );
    const btn = getByTestId('btn-discard-selection');
    fireEvent.click(btn);
    expect(onDiscardMock).toHaveBeenCalled();
  });
});
