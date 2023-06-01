import { useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { SearchInput, SearchOptions } from 'junto-design-system';
import { federalIdFormatter, federalIdValidator } from '@shared/utils';
import { useDebounce } from '@shared/hooks';
import {
  selectInsuredAndPolicyholderSelection,
  insuredAndPolicyholderSelectionActions,
  searchPolicyholders,
  getPolicyholderAffiliates,
} from '../../../application/features/insuredAndPolicyholderSelection/InsuredAndPolicyholderSelectionSlice';
import {
  proposalActions,
  selectProposalPolicyholder,
} from '../../../application/features/proposal/ProposalSlice';
import styles from './PolicyholderSelector.module.scss';

const PolicyholderSelector: React.FC = () => {
  const dispatch = useDispatch();
  const {
    policyholderInputValue,
    policyholderResults,
    loadingPolicyholders,
    isValidFederalId,
  } = useSelector(selectInsuredAndPolicyholderSelection);
  const { federalId } = useSelector(selectProposalPolicyholder);

  const hasInputtedFederalId = (value: string) => {
    const strippedValue = value.replace(/[^\d]+/g, '');
    return !new RegExp(/[^\d./-]/).test(value) && strippedValue.length === 14;
  };

  const mappedOptions = useMemo(() => {
    if (policyholderResults === null) return [];
    if (policyholderResults.length === 0) {
      if (policyholderInputValue.length < 4) {
        return [];
      }
      if (hasInputtedFederalId(policyholderInputValue)) {
        return isValidFederalId
          ? [
              {
                label: 'CNPJ válido. O fornecedor será cadastrado.',
                value: '-1',
              },
            ]
          : [{ label: 'Ops, parece que esse CNPJ não existe.', value: '-1' }];
      }
      return [
        {
          label: 'Sem registro. Digite o CNPJ para cadastrar o fornecedor.',
          value: '-1',
        },
      ];
    }
    return policyholderResults.map(policyholder => {
      const { corporateName, federalId } = policyholder;
      return {
        value: federalId,
        label: `${corporateName} - ${federalIdFormatter(federalId)}`,
        ...policyholder,
      };
    });
  }, [policyholderResults, isValidFederalId, policyholderInputValue]);

  const isCurrentValueFromOptions = useMemo(() => {
    return !!mappedOptions.find(opt => opt.label === policyholderInputValue);
  }, [mappedOptions, policyholderInputValue]);

  useEffect(() => {
    if (!isCurrentValueFromOptions && !!federalId) {
      dispatch(proposalActions.setPolicyholder({}));
      dispatch(
        insuredAndPolicyholderSelectionActions.setPolicyholderAffiliateResults(
          null,
        ),
      );
    }
    if (hasInputtedFederalId(policyholderInputValue)) {
      dispatch(
        insuredAndPolicyholderSelectionActions.setIsValidFederalId(
          federalIdValidator(policyholderInputValue, 'full'),
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, policyholderInputValue]);

  useDebounce(
    () => {
      if (!isCurrentValueFromOptions && policyholderInputValue.length >= 3) {
        dispatch(searchPolicyholders(policyholderInputValue));
      }
    },
    1000,
    [policyholderInputValue],
  );

  const handleInputChange = (value: string) => {
    dispatch(
      insuredAndPolicyholderSelectionActions.setPolicyholderInputValue(value),
    );
  };

  const handleSearchSelect = (option: SearchOptions) => {
    const { label, value } = option;
    if (value === '-1') return;
    dispatch(
      proposalActions.setPolicyholder({
        externalId: option['externalPolicyholderId'] as number,
        federalId: value,
        corporateName: option['corporateName'] as string,
      }),
    );
    dispatch(
      insuredAndPolicyholderSelectionActions.setPolicyholderInputValue(label),
    );
    dispatch(getPolicyholderAffiliates(value));
  };

  return (
    <div
      className={classNames(styles['policyholder-selector__wrapper'], {
        [styles['policyholder-selector__wrapper--loading']]:
          loadingPolicyholders,
      })}
    >
      <SearchInput
        data-testid="policyholderSelector-search-input"
        value={policyholderInputValue}
        label="CNPJ ou Razão social do Fornecedor"
        placeholder="CNPJ ou Razão social do Fornecedor"
        emptyMessage="Digite o CNPJ ou Razão social para buscar"
        icon={loadingPolicyholders ? 'loading' : 'search'}
        errorMessage={
          hasInputtedFederalId(policyholderInputValue) && !isValidFederalId
            ? 'Ops, parece que esse CNPJ não existe.'
            : undefined
        }
        options={mappedOptions}
        changeValueOnSelect={false}
        onValueSelected={v => handleSearchSelect(v)}
        onChange={v => handleInputChange(v)}
        onFocus={e => e.target.select()}
      />
    </div>
  );
};

export default PolicyholderSelector;
