import { useContext } from 'react';
import { Button, Divider, ThemeContext } from 'junto-design-system';
import { UserTypeEnum } from '@services';
import { ReactComponent as EmptyIllustration } from './assets/empty-illustration.svg';
import { ReactComponent as EmptyWithFiltersIllustration } from './assets/empty-with-filters.svg';
import styles from './EmptyProcessList.module.scss';

interface EmptyProcessListProps {
  hasAppliedFilter: boolean;
  userType: UserTypeEnum | null;
}

const EmptyProcessList: React.FC<EmptyProcessListProps> = ({
  hasAppliedFilter,
  userType,
}) => {
  const theme = useContext(ThemeContext);

  const handleButtonClick = () => {
    window.location.assign('/proposal');
  };

  return (
    <div className={styles['empty-process-list__wrapper']}>
      <Divider orientation="horizontal" />
      <div>
        {hasAppliedFilter ? (
          <EmptyWithFiltersIllustration />
        ) : (
          <EmptyIllustration />
        )}
        <h2 className={styles[theme]}>
          {hasAppliedFilter
            ? 'Não encontramos processos para sua busca'
            : 'Você ainda não possui processos'}
        </h2>
        <p className={styles[theme]}>
          {hasAppliedFilter
            ? 'Tente usar outros parâmetros e busque novamente. Caso ainda encontre dificuldades você pode falar com um de nossos especialistas no Chat.'
            : 'Assim que houverem garantias solicitadas, elas serão listadas aqui para acompanhamento.'}
        </p>
        {!hasAppliedFilter && userType === UserTypeEnum.INSURED && (
          <Button
            data-testid="emptyProcessList-button-proposal"
            onClick={() => handleButtonClick()}
          >
            Solicitar garantia
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyProcessList;
