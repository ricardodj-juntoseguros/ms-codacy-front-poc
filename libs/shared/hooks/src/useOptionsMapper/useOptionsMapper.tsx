/* eslint-disable */
export interface MappedOptions {
  value: string;
  label: string;
  [x: string]: unknown;
}

export function useOptionsMapper(
  optionsToMap: any[],
  labelName: string,
  secondaryLabel = '',
  id = '',
  selectCallback: (selectedItem: any, label: string) => void,
  customLabel?: (item: any) => string,
) {
  const mappedOptions: MappedOptions[] = optionsToMap.map(item => {
    if (customLabel) {
      return {
        ...item,
        label: customLabel(item),
        value: item[id],
      };
    }

    return {
      ...item,
      label: !secondaryLabel
        ? item[labelName]
        : `${item[labelName]} - ${item[secondaryLabel]}`,
      value: item[id],
    };
  });

  const selectOption = (option: MappedOptions) => {
    const selectedOption = optionsToMap.find(opt => opt[id] === option.value);

    if (selectedOption) {
      selectCallback(option, option.label);
    }
  };

  return { mappedOptions, selectOption };
}
