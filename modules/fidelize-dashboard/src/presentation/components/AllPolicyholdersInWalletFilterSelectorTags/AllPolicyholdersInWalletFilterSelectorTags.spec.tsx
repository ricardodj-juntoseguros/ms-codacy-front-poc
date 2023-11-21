import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import AllPolicyholdersInWalletFilterSelectorTags from '.';
import { AllPolicyholdersInWalletDTO } from '../../../application/types/dto';

describe('AllPolicyholdersInWalletFilterSelectorTags', () => {
  const removeMock = jest.fn();
  const clearMock = jest.fn();
  const selectedPolicyholdersMock: AllPolicyholdersInWalletDTO[] = [
    {
      policyholderExternalId: 2978,
      modalityExternalId: 122,
      policyholderFederalId: '71487374000121',
      policyholderName: 'Teste Tomador 1',
    },
    {
      policyholderExternalId: 6672,
      modalityExternalId: 122,
      policyholderFederalId: '69685575000191',
      policyholderName: 'Teste Tomador 2',
    },
    {
      policyholderExternalId: 9090,
      modalityExternalId: 122,
      policyholderFederalId: '07727482000125',
      policyholderName: 'Teste Tomador 3',
    },
    {
      policyholderExternalId: 9849,
      modalityExternalId: 122,
      policyholderFederalId: '01902764000135',
      policyholderName: 'Teste Tomador 4',
    },
    {
      policyholderExternalId: 206594,
      modalityExternalId: 122,
      policyholderFederalId: '18036869000151',
      policyholderName: 'Teste Tomador 5',
    },
    {
      policyholderExternalId: 206594,
      modalityExternalId: 122,
      policyholderFederalId: '68277690000164',
      policyholderName: 'Teste Tomador 6',
    },
    {
      policyholderExternalId: 206594,
      modalityExternalId: 122,
      policyholderFederalId: '29257443000144',
      policyholderName: 'Teste Tomador 7',
    },
    {
      policyholderExternalId: 206594,
      modalityExternalId: 122,
      policyholderFederalId: '69854329000116',
      policyholderName: 'Teste Tomador 8',
    },
    {
      policyholderExternalId: 206594,
      modalityExternalId: 122,
      policyholderFederalId: '41524211000100',
      policyholderName: 'Teste Tomador 9',
    },
    {
      policyholderExternalId: 206594,
      modalityExternalId: 122,
      policyholderFederalId: '23455678838127',
      policyholderName: 'Teste Tomador 10',
    },
  ];

  it('Should render tags correctly', () => {
    const { getByText } = render(
      <AllPolicyholdersInWalletFilterSelectorTags
        selectedPolicyholders={selectedPolicyholdersMock}
        onClear={clearMock}
        onRemove={removeMock}
        showMaxAlert={false}
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
  });

  it('Should call onRemove callback when tag X button click', () => {
    const { getByText } = render(
      <AllPolicyholdersInWalletFilterSelectorTags
        selectedPolicyholders={selectedPolicyholdersMock}
        onClear={clearMock}
        onRemove={removeMock}
        showMaxAlert={false}
      />,
    );

    const closeBtn = getByText('Teste Tomador 1').querySelectorAll('button')[0];
    fireEvent.click(closeBtn);
    expect(removeMock).toHaveBeenCalledWith(selectedPolicyholdersMock[0]);
  });

  it('Should call onClear callback when button is clicked', () => {
    const { getByTestId } = render(
      <AllPolicyholdersInWalletFilterSelectorTags
        selectedPolicyholders={selectedPolicyholdersMock}
        onClear={clearMock}
        onRemove={removeMock}
        showMaxAlert={false}
      />,
    );

    const clearBtn = getByTestId('btn-clear-policyholders');
    fireEvent.click(clearBtn);
    expect(clearMock).toHaveBeenCalled();
  });

  it('Should show alert message if showMaxAlert prop is true', () => {
    const { getByText } = render(
      <AllPolicyholdersInWalletFilterSelectorTags
        selectedPolicyholders={selectedPolicyholdersMock}
        onClear={clearMock}
        onRemove={removeMock}
        showMaxAlert
      />,
    );

    expect(
      getByText('Você pode selecionar no máximo 5 tomadores.'),
    ).toBeInTheDocument();
  });
});
