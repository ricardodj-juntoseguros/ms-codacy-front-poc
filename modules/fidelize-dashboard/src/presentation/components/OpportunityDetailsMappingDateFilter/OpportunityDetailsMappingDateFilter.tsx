import { Button, DateInput, CustomDropdown } from 'junto-design-system';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TagManager from 'react-gtm-module';
import classNames from 'classnames';
import {
  format,
  formatISO,
  isAfter,
  isSameDay,
  parse,
  parseISO,
} from 'date-fns';
import { ModalityEnum } from '../../../application/types/model';
import {
  opportunitiesDetailsActions,
  selectFilterValues,
} from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsSlice';
import styles from './OpportunityDetailsMappingDateFilter.module.scss';
import { MODALITIES_IDS } from '../../../constants';

interface OpportunityDetailsMappingDateFilterProps {
  filterName: string;
  modality: ModalityEnum;
}

interface MappingDateFilterFormProps
  extends OpportunityDetailsMappingDateFilterProps {
  storeFilterValues: { min: string; max: string } | null;
  closeDropdown?: () => void;
}

const OpportunityDetailsMappingDateFilter: React.FC<OpportunityDetailsMappingDateFilterProps> =
  ({ filterName, modality }) => {
    const storeFilterValues = useSelector(
      selectFilterValues(modality, filterName),
    ) as { min: string; max: string } | null;

    const hasAppliedFilter = () => {
      return (
        !!storeFilterValues &&
        !!(storeFilterValues.max || storeFilterValues.min)
      );
    };

    return (
      <div
        className={classNames(
          styles['opportunity-details-mapping-date-filter__wrapper'],
          {
            [styles[
              'opportunity-details-mapping-date-filter__wrapper--applied'
            ]]: hasAppliedFilter(),
          },
        )}
      >
        <CustomDropdown
          inputValue="Data do mapeamento"
          variant="medium"
          data-testid={`${modality}-${filterName}-filter`}
          closeActionToChildren
        >
          <MappingDateFilterForm
            modality={modality}
            filterName={filterName}
            storeFilterValues={storeFilterValues}
          />
        </CustomDropdown>
      </div>
    );
  };

const MappingDateFilterForm: React.FC<MappingDateFilterFormProps> = ({
  storeFilterValues,
  filterName,
  modality,
  closeDropdown,
}) => {
  const dispatch = useDispatch();
  const [minDate, setMinDate] = useState<string | null>(null);
  const [validMinDate, setValidMinDate] = useState<boolean>(true);
  const [maxDate, setMaxDate] = useState<string | null>(null);
  const [validMaxDate, setValidMaxDate] = useState<boolean>(true);
  const [minMaxError, setMinMaxError] = useState(false);

  useEffect(() => {
    setMinMaxError(false);
  }, [minDate, maxDate]);

  useEffect(() => {
    if (storeFilterValues) {
      setMaxDate(parseToBrazilianDateString(storeFilterValues.max));
      setMinDate(parseToBrazilianDateString(storeFilterValues.min));
    } else {
      setMinDate(null);
      setMaxDate(null);
    }
  }, [storeFilterValues]);

  const isFilledDatesValid = useMemo(() => {
    if (!maxDate && !minDate) return true;
    return (!!maxDate && validMaxDate) || (!!minDate && validMinDate);
  }, [minDate, maxDate, validMaxDate, validMinDate]);

  const handleClearClick = () => {
    setMinMaxError(false);
    setMinDate(null);
    setMaxDate(null);
    setValidMaxDate(true);
    setValidMinDate(true);
  };

  const handleApplyClick = () => {
    if (!isFilledDatesValid) {
      return;
    }
    if (!validateDatesRange()) {
      setMinMaxError(true);
      return;
    }
    setMinMaxError(false);

    let maxValueDispatch: string | null = null;
    if (maxDate !== null && maxDate !== '' && !maxDate.includes('_')) {
      maxValueDispatch = parseToISODateString(maxDate);
    }
    let minValueDispatch: string | null = null;
    if (minDate !== null && minDate !== '' && !minDate.includes('_')) {
      minValueDispatch = parseToISODateString(minDate);
    }
    dispatch(
      opportunitiesDetailsActions.setFilter({
        modality,
        filter: {
          key: filterName,
          values: { max: maxValueDispatch, min: minValueDispatch },
        },
      }),
    );
    TagManager.dataLayer({
      dataLayer: {
        event: 'ClickApplyOpportunityListFilterButton',
        modalityId: MODALITIES_IDS[modality],
        filterType: filterName,
        selectedFilters: `max:${maxDate || 'Vazio'},min:${minDate || 'Vazio'}`,
      },
    });
    if (closeDropdown) closeDropdown();
  };

  const validateDatesRange = () => {
    if (
      minDate === null ||
      minDate === '' ||
      maxDate === null ||
      maxDate === ''
    )
      return true;
    const minDateActualValue = minDate.includes('_')
      ? null
      : parse(minDate, 'dd/MM/yyyy', new Date());
    const maxDateActualValue = maxDate.includes('_')
      ? null
      : parse(maxDate, 'dd/MM/yyyy', new Date());
    if (minDateActualValue === null || maxDateActualValue === null) return true;
    return (
      isSameDay(maxDateActualValue, minDateActualValue) ||
      isAfter(maxDateActualValue, minDateActualValue)
    );
  };

  const parseToISODateString = (brazilianDateString: string) => {
    return formatISO(parse(brazilianDateString, 'dd/MM/yyyy', new Date()), {
      representation: 'date',
    });
  };

  const parseToBrazilianDateString = (isoDateString: string) => {
    if (isoDateString === null) return null;
    return format(parseISO(isoDateString), 'dd/MM/yyyy');
  };

  return (
    <div className={styles['opportunity-details-mapping-date-filter__form']}>
      <DateInput
        value={minDate || ''}
        onChange={(value, valid) => {
          setMinDate(value);
          setValidMinDate(valid);
        }}
        label="Data inicial"
        variant="medium"
        data-testid="min-mapping-date-input"
      />
      <DateInput
        value={maxDate || ''}
        onChange={(value, valid) => {
          setMaxDate(value);
          setValidMaxDate(valid);
        }}
        label="Data final"
        variant="medium"
        data-testid="max-mapping-date-input"
        errorMessage={
          minMaxError ? 'A data final deve ser posterior a data inicial!' : ''
        }
      />
      <div>
        <Button
          variant="secondary"
          size="medium"
          data-testid="mapping-date-filter-clear-btn"
          onClick={() => handleClearClick()}
        >
          Limpar
        </Button>
        <Button
          variant="primary"
          size="medium"
          data-testid="mapping-date-filter-apply-btn"
          onClick={() => handleApplyClick()}
          disabled={!isFilledDatesValid}
        >
          Aplicar
        </Button>
      </div>
    </div>
  );
};

export default OpportunityDetailsMappingDateFilter;
