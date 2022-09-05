import { Button, CurrencyInput, CustomDropdown } from 'junto-design-system';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TagManager from 'react-gtm-module';
import classNames from 'classnames';
import {
  ModalityEnum,
  OpportunitiesDetailsFilterModel,
} from '../../../application/types/model';
import {
  opportunitiesDetailsActions,
  selectFilterValues,
} from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsSlice';
import styles from './OpportunityDetailsSecurityAmountFilter.module.scss';
import { MODALITIES_IDS } from '../../../constants';

interface OpportunityDetailsSecurityAmountFilterProps {
  filterName: string;
  modality: ModalityEnum;
}

const OpportunityDetailsSecurityAmountFilter: React.FC<OpportunityDetailsSecurityAmountFilterProps> =
  ({ filterName, modality }) => {
    const dispatch = useDispatch();
    const storeFilterValues = useSelector(
      selectFilterValues(modality, filterName),
    ) as { min: number; max: number } | null;

    const [minSecurityAmount, setMinSecurityAmount] =
      useState<number | null>(null);
    const [maxSecurityAmount, setMaxSecurityAmount] =
      useState<number | null>(null);
    const [minMaxError, setMinMaxError] = useState(false);

    useEffect(() => {
      setMinMaxError(false);
    }, [minSecurityAmount, maxSecurityAmount]);

    useEffect(() => {
      if (storeFilterValues) {
        setMaxSecurityAmount(storeFilterValues.max || null);
        setMinSecurityAmount(storeFilterValues.min || null);
      } else {
        setMinSecurityAmount(null);
        setMaxSecurityAmount(null);
      }
    }, [storeFilterValues]);

    const handleClearClick = () => {
      setMinMaxError(false);
      setMinSecurityAmount(null);
      setMaxSecurityAmount(null);
    };

    const handleApplyClick = () => {
      if (
        minSecurityAmount &&
        maxSecurityAmount &&
        maxSecurityAmount < minSecurityAmount
      ) {
        setMinMaxError(true);
        return;
      }
      setMinMaxError(false);
      const filter: OpportunitiesDetailsFilterModel = {
        key: filterName,
        values: { max: maxSecurityAmount, min: minSecurityAmount },
      };
      dispatch(opportunitiesDetailsActions.setFilter({ modality, filter }));
      if (minSecurityAmount && maxSecurityAmount) {
        TagManager.dataLayer({
          dataLayer: {
            event: 'ClickApplyOpportunityListFilterButton',
            modalityId: MODALITIES_IDS[modality],
            filterType: filterName,
            selectedFilters: `max:${maxSecurityAmount},min:${minSecurityAmount}`,
          },
        });
      }
    };

    const hasAppliedFilter = () => {
      return (
        !!storeFilterValues &&
        !!(storeFilterValues.max || storeFilterValues.min)
      );
    };

    return (
      <div
        className={classNames(
          styles['opportunity-details-security-amount-filter__wrapper'],
          {
            [styles[
              'opportunity-details-security-amount-filter__wrapper--applied'
            ]]: hasAppliedFilter(),
          },
        )}
      >
        <CustomDropdown
          inputValue="Valor IS"
          variant="medium"
          data-testid={`${modality}-${filterName}-filter`}
        >
          <div
            className={
              styles['opportunity-details-security-amount-filter__form']
            }
          >
            <CurrencyInput
              value={minSecurityAmount}
              onChange={v => setMinSecurityAmount(v)}
              label="Valor mínimo"
              variant="medium"
              placeholder="R$ 0,00"
              data-testid="min-security-amount-input"
            />
            <CurrencyInput
              value={maxSecurityAmount}
              onChange={v => setMaxSecurityAmount(v)}
              label="Valor máximo"
              variant="medium"
              placeholder="R$ 0,00"
              data-testid="max-security-amount-input"
              errorMessage={
                minMaxError
                  ? 'O valor máximo precisa ser maior que o valor mínimo'
                  : ''
              }
            />
            <div>
              <Button
                variant="secondary"
                size="medium"
                data-testid="security-amount-filter-clear-btn"
                onClick={() => handleClearClick()}
              >
                Limpar
              </Button>
              <Button
                variant="primary"
                size="medium"
                data-testid="security-amount-filter-apply-btn"
                onClick={() => handleApplyClick()}
              >
                Aplicar
              </Button>
            </div>
          </div>
        </CustomDropdown>
      </div>
    );
  };

export default OpportunityDetailsSecurityAmountFilter;
