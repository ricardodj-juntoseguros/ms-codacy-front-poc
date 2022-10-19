import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import { store } from '../config/store';
import OpportunitySelectionLossModal from '../presentation/components/OpportunitySelectionLossModal';

export const renderOpportunitySelectionLossModal = (
  container: Element | null,
  onDiscardCallback?: () => void,
  isDiscardFirst = false,
) => {
  const renderContainer =
    container || (document.querySelector('body') as Element);
  return render(
    <Provider store={store}>
      <OpportunitySelectionLossModal
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
