import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { federalIdFormatter } from '@shared/utils';
import {
  Dropdown,
  DropdownOptions,
  InputBase,
  makeToast,
} from 'junto-design-system';
import { InsuredDTO } from '../../../application/types/dto';
import {
  selectProposal,
  proposalActions,
} from '../../../application/features/proposal/ProposalSlice';
import InsuredAndPolicyholderSelectionApi from '../../../application/features/insuredAndPolicyholderSelection/InsuredAndPolicyholderSelectionApi';

interface InsuredSelectorProps {
  onLoadedInsureds: () => void;
}

const InsuredSelector: React.FC<InsuredSelectorProps> = ({
  onLoadedInsureds,
}) => {
  const dispatch = useDispatch();
  const { insuredFederalId, insuredName } = useSelector(selectProposal);
  const [insuredsData, setInsuredsData] = useState<InsuredDTO[]>([]);

  useEffect(() => {
    const fetchInsureds = () => {
      InsuredAndPolicyholderSelectionApi
        .getInsuredList()
        .then(data => {
          if (data.length === 1) {
            const { federalId, name } = data[0];
            dispatch(proposalActions.setInsuredValues({ federalId, name }));
          }
          setInsuredsData(data);
        })
        .catch(() =>
          makeToast(
            'error',
            'Ocorreu um erro inesperado ao buscar os contratantes.',
          ),
        )
        .finally(() => onLoadedInsureds());
    };
    fetchInsureds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const getSelectedInsuredInputValue = () => {
    if (insuredFederalId !== '' && insuredName !== '')
      return `${insuredName} - ${federalIdFormatter(insuredFederalId)}`;
    return '';
  };

  const handleInsuredSelect = (option: DropdownOptions) => {
    const { value } = option;
    const insured = insuredsData.find(ins => ins.federalId === value);
    if (insured) {
      const { federalId, name } = insured;
      dispatch(proposalActions.setInsuredValues({ federalId, name }));
    }
  };

  const getDropdownOptions = () => {
    return insuredsData.map(insured => ({
      value: insured.federalId,
      label: `${insured.name} - ${federalIdFormatter(insured.federalId)}`,
    }));
  };

  if (insuredsData.length === 1 && insuredFederalId !== '') {
    return (
      <InputBase
        data-testid="insuredSelector-input-readonly"
        readOnly
        label="CNPJ ou Razão social do contratante"
        value={getSelectedInsuredInputValue()}
      />
    );
  }
  return (
    <Dropdown
      data-testid="insuredSelector-input-dropdown"
      label="CNPJ ou Razão social do Contratante"
      placeholder="Selecione uma opção"
      options={getDropdownOptions()}
      value={
        insuredFederalId !== ''
          ? {
              value: insuredFederalId,
              label: getSelectedInsuredInputValue(),
            }
          : null
      }
      onValueSelected={v => handleInsuredSelect(v)}
    />
  );
};

export default InsuredSelector;
