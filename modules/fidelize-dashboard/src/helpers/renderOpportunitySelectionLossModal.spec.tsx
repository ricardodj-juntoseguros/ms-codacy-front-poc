import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from 'junto-design-system';
import { useRef } from 'react';
import { renderOpportunitySelectionLossModal } from './renderOpportunitySelectionLossModal';

const onDiscardCallbackMock = jest.fn();

describe('Render OpportunitySelectionLossModal helper', () => {
  const WrapperComponent: React.FC<any> = ({ isDiscardFirst = false }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleButtonClick = () => {
      renderOpportunitySelectionLossModal(
        wrapperRef.current,
        onDiscardCallbackMock,
        isDiscardFirst,
      );
    };

    return (
      <>
        <div ref={wrapperRef} />
        <Button
          data-testid="btn-open-modal"
          onClick={() => handleButtonClick()}
        >
          Open Modal
        </Button>
      </>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render OpportunitySelectionLossModal component correctly', () => {
    const { getByTestId, getByText } = render(<WrapperComponent />);
    const trigger = getByTestId('btn-open-modal');
    fireEvent.click(trigger);
    expect(
      getByText('A sua seleção de oportunidades será perdida'),
    ).toBeInTheDocument();
    fireEvent.click(getByTestId('modal-close-button'));
  });

  it('Should call onDiscardCallback and unmount modal on discard button click', () => {
    const { getByTestId, queryByText } = render(<WrapperComponent />);
    const trigger = getByTestId('btn-open-modal');
    fireEvent.click(trigger);
    const discardBtn = getByTestId('btn-discard-selection');
    fireEvent.click(discardBtn);
    expect(
      queryByText('A sua seleção de oportunidades será perdida'),
    ).not.toBeInTheDocument();
    expect(onDiscardCallbackMock).toHaveBeenCalledTimes(1);
  });

  it('Should unmount modal on kepp selection button click', () => {
    const { getByTestId, queryByText } = render(<WrapperComponent />);
    const trigger = getByTestId('btn-open-modal');
    fireEvent.click(trigger);
    const discardBtn = getByTestId('btn-keep-selection');
    fireEvent.click(discardBtn);
    expect(
      queryByText('A sua seleção de oportunidades será perdida'),
    ).not.toBeInTheDocument();
    expect(onDiscardCallbackMock).toHaveBeenCalledTimes(0);
  });

  it('Should render OpportunitySelectionLossModal component correctly with discard first flag set to true', () => {
    const { getByTestId, getByText } = render(
      <WrapperComponent isDiscardFirst />,
    );
    const trigger = getByTestId('btn-open-modal');
    fireEvent.click(trigger);
    expect(
      getByText('Tem certeza que deseja descartar sua seleção?'),
    ).toBeInTheDocument();
    fireEvent.click(getByTestId('modal-close-button'));
  });
});
