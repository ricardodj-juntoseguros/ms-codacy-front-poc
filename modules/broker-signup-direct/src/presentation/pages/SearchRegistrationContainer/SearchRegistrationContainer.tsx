/* eslint-disable react/no-unescaped-entities */
import { RouteComponentProps } from 'react-router';
import { useState } from 'react';
import { LinkButton } from 'junto-design-system';
import styles from './SearchRegistrationContainer.module.scss';
import SearchBrokerFederalId from '../../components/SearchBrokerFederalId/SearchBrokerFederalId';
import { TextHelper } from '../../components/TextHelper/TextHelper';
import LogoJuntoSeguros from '../../components/LogoJunto/LogoJuntoSeguros';

const SearchRegistrationContainer = ({ history }: RouteComponentProps) => {
  const sreenWidth = window.screen.width;
  const [showTextHelper, setShowTextHelper] = useState(sreenWidth > 680);
  const textHelper = [
    'Para ser aceito, o CNPJ precisa ter cadastro ativo na Susep (Superintendência de Seguros Privados) e estar habilitado no Produto 305.',
    'A empresa deve possuir a atividade “Corretores e agentes de seguros, de planos de previdência complementar e de saúde – código 66223-00” na Classificação Nacional de Atividades Econômicas (CNAE).',
    "Além disso, a Razão Social ou Nome Empresarial deve conter as expressões 'Corretor(a) de Seguros' ou 'Corretagem de Seguros', sendo o nome reservado por UF.",
  ];

  const handleGoNextClick = () => {
    history.push('/register-responsible');
  };

  const handleBackButtonClick = () => {
    const brokerProcessesUrl = process.env.NX_GLOBAL_LOGIN_NOVOS_CLIENTES || '';
    window.location.assign(brokerProcessesUrl);
  };

  return (
    <div className={styles['search_registration_container_wrapper']}>
      <LogoJuntoSeguros />
      <div className={styles['search_registration_container_section_form']}>
        <div
          className={
            styles['search_registration_container_section_form_section']
          }
        >
          <h1>Cadastre sua Corretora</h1>
          <h2>
            Crie uma conta e contrate garantias para clientes de um jeito
            simples e rápido
          </h2>
          <SearchBrokerFederalId handleGoNextClick={handleGoNextClick} />
          <div
            className={
              styles[
                'search_registration_container_section_form_redirect_access'
              ]
            }
          >
            <p>Você não é corretor?</p>
            <LinkButton
              id="brokerFederalIdSignup-redirect-linkButton"
              onClick={() => handleBackButtonClick()}
              label="Acesse sua plataforma"
              icon="arrow-right"
              iconPosition="right"
            />
            {sreenWidth <= 680 && (
              <div
                className={
                  styles[
                    'search_registration_container_section_form_show_text_helper'
                  ]
                }
              >
                <LinkButton
                  id="brokerFederalIdSignup-showTextHelper-LinkButton"
                  onClick={() => setShowTextHelper(!showTextHelper)}
                  label="Quais CNPJ são aceitos?"
                  icon={!showTextHelper ? 'help-circle' : 'chevron-up'}
                  iconPosition="left"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {showTextHelper && (
        <TextHelper title="Quais CNPJ são aceitos?" text={textHelper} />
      )}
    </div>
  );
};

export default SearchRegistrationContainer;
