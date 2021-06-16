/* eslint-disable */
export function useOptionsMapper(
  optionsToMap: any[],
  labelName: string,
  secondaryLabel = '',
  id = '',
  selectCallback: (selectedItem: any) => void,
  customLabel?: (item: any) => string,
) {
  const mappedOptions = optionsToMap.map(item => {
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

  const selectOption = (option: any) => {
    const selectedOption = optionsToMap.find(opt => opt[id] === option.value);
    if (selectedOption) {
      selectCallback(selectedOption);
    }
  };

  return { mappedOptions, selectOption };
}
