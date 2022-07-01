import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import { store } from '../config/store';
import OpportunitySelectionLossModal from '../presentation/components/OpportunitySelectionLossModal';

export const renderOpportunitySelectionLossModal = (
  onDiscardCallback: () => void,
  container: Element | null,
) => {
  const renderContainer =
    container || (document.querySelector('body') as Element);
  return render(
    <Provider store={store}>
      <OpportunitySelectionLossModal
        isOpen
        onDiscardSelection={() => {
          onDiscardCallback();
          unmountComponentAtNode(renderContainer);
        }}
        onModalClose={() => unmountComponentAtNode(renderContainer)}
      />
    </Provider>,
    renderContainer,
  );
};
