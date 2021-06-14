export function OptionsMapper(OptionsToMap: Array<any>, LabelName: string, SecondaryLabel = "") {

  const mappedOptions = OptionsToMap.map(option => ({
    ...option,
    label: !SecondaryLabel ? option[LabelName] : `${option[LabelName]} - ${option[SecondaryLabel]}`,
    value: option.id,
  }));
  return mappedOptions;
}

export function SelectionHandler(
  option: any,
  options: Array<any>,
  propToSet: any,
) {
  const selectedOption = options.find(opt => opt.id === option.id);
  if (selectedOption) {
    propToSet(selectedOption);
  }
  return selectedOption;
}
