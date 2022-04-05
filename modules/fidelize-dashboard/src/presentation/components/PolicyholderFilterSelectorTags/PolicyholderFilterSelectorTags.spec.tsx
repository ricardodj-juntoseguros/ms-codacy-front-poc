import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import PolicyholderFilterSelectorTags from '.';
import { PolicyholderDTO } from '../../../application/types/dto';

describe('PolicyholderFilterSelectorTags', () => {
  const removeMock = jest.fn();
  const clearMock = jest.fn();
  const selectedPolicyholdersMock: PolicyholderDTO[] = [
    { name: 'Teste Tomador 1', federalId: '71487374000121' },
    { name: 'Teste Tomador 2', federalId: '69685575000191' },
    { name: 'Teste Tomador 3', federalId: '07727482000125' },
    { name: 'Teste Tomador 4', federalId: '01902764000135' },
    { name: 'Teste Tomador 5', federalId: '18036869000151' },
    { name: 'Teste Tomador 6', federalId: '68277690000164' },
    { name: 'Teste Tomador 7', federalId: '29257443000144' },
    { name: 'Teste Tomador 8', federalId: '69854329000116' },
    { name: 'Teste Tomador 9', federalId: '41524211000100' },
    { name: 'Teste Tomador 10', federalId: '23455678838127' },
  ];

  it('Should render tags correctly', () => {
    const { getByText } = render(
      <PolicyholderFilterSelectorTags
        selectedPolicyholders={selectedPolicyholdersMock}
        onClear={clearMock}
        onRemove={removeMock}
      />,
    );

    expect(getByText('Teste Tomador 1')).toBeInTheDocument();
    expect(getByText('Teste Tomador 2')).toBeInTheDocument();
    expect(getByText('Teste Tomador 3')).toBeInTheDocument();
    expect(getByText('Teste Tomador 4')).toBeInTheDocument();
    expect(getByText('Teste Tomador 5')).toBeInTheDocument();
    expect(getByText('Teste Tomador 6')).toBeInTheDocument();
    expect(getByText('Teste Tomador 7')).toBeInTheDocument();
    expect(getByText('Teste Tomador 8')).toBeInTheDocument();
    expect(getByText('Teste Tomador 9')).toBeInTheDocument();
    expect(getByText('Teste Tomador 10')).toBeInTheDocument();
    expect(
      getByText('Você pode selecionar no máximo 10 tomadores.'),
    ).toBeInTheDocument();
  });

  it('Should call onRemove callback when tag X button click', () => {
    const { getByText } = render(
      <PolicyholderFilterSelectorTags
        selectedPolicyholders={selectedPolicyholdersMock}
        onClear={clearMock}
        onRemove={removeMock}
      />,
    );

    const closeBtn = getByText('Teste Tomador 1').querySelectorAll('button')[0];
    fireEvent.click(closeBtn);

    expect(removeMock).toHaveBeenCalledWith(selectedPolicyholdersMock[0]);
  });

  it('Should call onClear callback when button is clicked', () => {
    const { getByTestId } = render(
      <PolicyholderFilterSelectorTags
        selectedPolicyholders={selectedPolicyholdersMock}
        onClear={clearMock}
        onRemove={removeMock}
      />,
    );

    const clearBtn = getByTestId('btn-clear-policyholders');
    fireEvent.click(clearBtn);

    expect(clearMock).toHaveBeenCalled();
  });
});
