/* eslint-disable react/no-unescaped-entities */
import { RouteComponentProps } from 'react-router';
import { useState } from 'react';
import { LinkButton } from 'junto-design-system';
import styles from './SearchRegistrationContainer.module.scss';
import { ReactComponent as LogoJunto } from '../../assets/logoJunto.svg';
import SearchBrokerFederalId from '../../components/SearchBrokerFederalId/SearchBrokerFederalId';

const SearchRegistrationContainer = ({ history }: RouteComponentProps) => {
  const sreenWidth = window.screen.width;
  const [showTextHelper, setShowTextHelper] = useState(sreenWidth > 680);

  const handleGoNextClick = () => {
      history.push('/register-responsible');
  };

  const handleBackButtonClick = () => {
    const brokerProcessesUrl = process.env.NX_GLOBAL_LOGIN_NOVOS_CLIENTES || '';
    window.location.assign(brokerProcessesUrl);
  };

  return (
    <div className={styles['search_registration_container_wrapper']}>
    <div className={styles['search_registration_container_section_form_logo']}>
     <LogoJunto />
     </div>
 <div className={styles['search_registration_container_section_form']}>
     <div className={styles['search_registration_container_section_form_section']}>
       <h1>Qual é o CNPJ?</h1>
       <h2>Informe o CNPJ de uma empresa cadastrada na Susep.</h2>
       <SearchBrokerFederalId handleGoNextClick={handleGoNextClick}/>
       <div className={styles['search_registration_container_section_form_redirect_access']}>
         <p>Você não é corretor?</p>
         <LinkButton onClick={() => handleBackButtonClick()} label="Acesse sua plataforma" icon="arrow-right" iconPosition="right"/>
         { sreenWidth <= 680 &&
           <div className={styles['search_registration_container_section_form_show_text_helper']}>
          <LinkButton onClick={() => setShowTextHelper(!showTextHelper)} label="Quais CNPJ são aceitos?" icon={!showTextHelper ? "help-circle" : "chevron-up"} iconPosition="left"/>
          </div>
         }
       </div>
     </div>
 </div>
 {showTextHelper &&
    <div className={styles['search_registration_container_section_helper']}>
      <div className={styles['search_registration_container_section_helper_text']}>
        <h2>Quais CNPJ são aceitos?</h2>
        <p>Para ser aceito, o CNPJ precisa ter cadastro ativo na Susep (Superintendência de Seguros Privados) e estar habilitado no Produto 305.</p>
        <p>A empresa deve possuir a atividade “Corretores e agentes de seguros, de planos de previdência complementar e de saúde – código 66223-00” na Classificação Nacional de Atividades Econômicas (CNAE).</p>
        <p>Além disso, a Razão Social ou Nome Empresarial deve conter as expressões "Corretor(a) de Seguros" ou "Corretagem de Seguros", sendo o nome reservado por UF.</p>
      </div>
    </div>
  }
 </div>

);
}

export default SearchRegistrationContainer;
