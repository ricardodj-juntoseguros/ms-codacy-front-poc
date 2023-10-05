import { useState } from 'react';
import { InputBase, LinkButton } from 'junto-design-system';
import classNames from 'classnames';
import styles from './ProcessListProcessFilter.module.scss';

interface ProcessListProcessFilterProps {
  isLoadingProcesses: boolean;
  showClearButton: boolean;
  changeProcessValueCallback: (value: string | null) => void;
}

const ProcessListProcessFilter: React.FC<ProcessListProcessFilterProps> = ({
  isLoadingProcesses,
  showClearButton,
  changeProcessValueCallback,
}) => {
  const [inputValue, setInputValue] = useState<string>();
  const [inputValueOnFocus, setInputValueOnFocus] = useState<string>();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const keyPressed = event.key;
    if (keyPressed !== 'Enter') return;
    changeProcessValueCallback(inputValue || null);
  };

  const handleChangeInput = (value: string) => {
    const onlyNumbersAndTrace = value.replace(new RegExp(/[^\d-]/), '');
    setInputValue(onlyNumbersAndTrace);
  };

  const handleClearClick = () => {
    setInputValue('');
    changeProcessValueCallback(null);
  };

  return (
    <div
      className={classNames(styles['process-list-process-filter__wrapper'], {
        [styles['process-list-process-filter__wrapper--loading']]:
          isLoadingProcesses,
      })}
    >
      <InputBase
        data-testid="processListProcessFilter-input"
        variant="medium"
        placeholder="Busque por nº da apólice/solicitação"
        label="Busque por nº da apólice/solicitação"
        icon={isLoadingProcesses ? 'loading' : 'search'}
        value={inputValue}
        onChange={e => handleChangeInput(e.target.value)}
        onActionIconClick={() => changeProcessValueCallback(inputValue || null)}
        onKeyDown={e => handleKeyDown(e)}
        onFocus={() => setInputValueOnFocus(inputValue)}
        onBlur={() => {
          if (inputValueOnFocus && !inputValue)
            changeProcessValueCallback(null);
        }}
      />
      {showClearButton && (
        <LinkButton
          data-testid="processListProcessFilter-btn-clear"
          label="Limpar busca"
          onClick={() => handleClearClick()}
        />
      )}
    </div>
  );
};

export default ProcessListProcessFilter;
