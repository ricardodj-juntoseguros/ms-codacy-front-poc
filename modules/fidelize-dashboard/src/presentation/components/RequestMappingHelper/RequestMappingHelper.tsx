import { useState } from 'react';
import classNames from 'classnames';
import styles from './RequestMappingHelper.module.scss';

const RequestMappingHelper = () => {
  return (
    <div className={styles['request-mapping-helper__container']}>
      <h2>Como funciona</h2>

      <div className={styles['request-mapping-helper__wrapper']}>
        <ul className={styles['request-mapping-helper__list']}>
          <li className={styles['request-mapping-helper__item']}>
            <i className="icon icon-search" />
            <span>Selecione tomadores </span>
            <p>
              Defina qual cliente você deseja encontrar oportunidades de uso do
              Seguro Garantia Judicial
            </p>
          </li>
          <li className={styles['request-mapping-helper__item']}>
            <i className="icon icon-folder" />
            <span>Verifique a estimativa de processos</span>
            <p>
              Verifique uma estimativa de processo ativos contra o cliente
              indicado, com base na localização de termos em publicações
              judiciais.
            </p>
          </li>
          <li className={styles['request-mapping-helper__item']}>
            <i className="icon icon-thumbs-up" />
            <span>Veja nossa análise do tomador</span>
            <p>
              Entenda se o cliente está qualificado a avançar para um mapeamento
              detalhado. Você pode tentar outro cliente.
            </p>
          </li>
          <li className={styles['request-mapping-helper__item']}>
            <i className="icon icon-send" />
            <span>Solicite o mapeamento</span>
            <p>
              Nossos especialistas analisarão cada processo do seu cliente, para
              entender quais são as melhores oportunidades para o uso do Seguro
              Garantia da Junto.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RequestMappingHelper;
