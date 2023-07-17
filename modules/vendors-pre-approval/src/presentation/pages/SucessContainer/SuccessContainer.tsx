import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router';

import { ThemeContext, Button } from 'junto-design-system';

import { CheckIconIllustration, AlertTriangleIllustration } from '@shared/ui';
import styles from './SuccessContainer.module.scss';

const SuccessContainer: React.FC = () => {
  const [url, setUrl] = useState('');
  const theme = useContext(ThemeContext);
  const history = useHistory();
  const hasApprove = history.location.state;

  const redirectToHome = () => {
    setUrl(`${process.env}['NX_GLOBAL_VENDORS_PLATFORM_URL']/policies`);
    window.location.href = url;
  };

  return (
    <div className={styles['success-container__wrapper']}>
      {hasApprove ? <CheckIconIllustration /> : <AlertTriangleIllustration />}
      <h1 className={styles[theme]}>
        {hasApprove
          ? 'Tudo certo! Já recebemos sua aprovação e estamos preparando sua apólice'
          : 'Sua proposta não seguirá para emissão'}
      </h1>
      <p className={styles[theme]}>
        {hasApprove
          ? 'Caso esteja tudo certo com a contratação, você receberá em breve um email com a apólice de seguro e o boleto para pagamento.'
          : 'Encaminhamos sua mensagem para nossa equipe técnica. Agradecemos o retorno.'}
      </p>
      <div className={styles['success-container-btn']}>
        <Button onClick={() => redirectToHome()}> Acessar meu painel </Button>
      </div>
    </div>
  );
};

export default SuccessContainer;
