import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import { store } from '../config/store';
import MappingEditionLossModal from '../presentation/components/MappingEditionLossModal/MappingEditionLossModal';

export const renderMappingEditionLossModal = (
  container: Element | null,
  onDiscardCallback?: () => void,
  isDiscardFirst = false,
) => {
  const renderContainer =
    container || (document.querySelector('body') as Element);
  return render(
    <Provider store={store}>
      <MappingEditionLossModal
        isOpen
        variant={isDiscardFirst ? 'discard-first' : 'keep-first'}
        onDiscardSelection={() => {
          if (onDiscardCallback) {
            onDiscardCallback();
          }
          unmountComponentAtNode(renderContainer);
        }}
        onModalClose={() => unmountComponentAtNode(renderContainer)}
      />
    </Provider>,
    renderContainer,
  );
};
