/* eslint-disable react/no-array-index-key */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TagManager from 'react-gtm-module';
import { Button } from 'junto-design-system';
import styles from './NoOpportunitiesMappedContainer.module.scss';
import { ReactComponent as HeaderIllustration } from './assets/header-illustration.svg';
import { ReactComponent as LogoFidelize } from './assets/logo-fidelize.svg';
import { ReactComponent as AwardIcon } from './assets/award.svg';
import BrokerContactModal from '../../components/BrokerContactModal';

const NoOpportunitiesMappedContainer: React.FC = () => {
  const [contactModalOpen, setContactModalOpen] = useState(false);

  useEffect(() => {
    TagManager.dataLayer({
      dataLayer: {
        event: 'ViewNoOpportunitiesMappedPage',
      },
    });
  }, []);

  const renderHowItWorks = () => {
    const data = [
      {
        title: 'Selecione seus clientes',
        description:
          'Verifique quais clientes você deseja entender se possuem oportunidades para o Seguro Garantia Judicial e informe ao Comercial que lhe atende o CNPJ deles.',
      },
      {
        title: 'Mapeamento de oportunidades',
        description:
          'Nós iremos verificar os processos judiciais ativos contra o CNPJ indicado, em todo o território nacional.',
      },
      {
        title: 'Oportunidades identificadas',
        description:
          'Iremos te retornar as oportunidades que podem necessitar de uma apólice de Seguro Garantia Judicial.',
      },
      {
        title: 'Fidelize seus clientes',
        description:
          'Agora é com você! Apresente aos seus clientes a opção de utilizar o seguro garantia e liberar o fluxo de caixa da empresa.',
      },
    ];

    return data.map((d, index) => {
      const { title, description } = d;
      return (
        <motion.div
          key={`step-${index}`}
          initial={{ opacity: 0, translateY: '50px' }}
          whileInView={{ opacity: 1, translateY: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 * (index + 1), duration: 0.5 }}
          className={
            styles['no-opportunities-mapped-container__how-it-works-step']
          }
        >
          <span>{index + 1}</span>
          <p>{title}</p>
          <p>{description}</p>
        </motion.div>
      );
    });
  };

  const renderFidelizeTotals = () => {
    const data = [
      {
        title: '+ de 500',
        description: 'corretoras parceiras',
      },
      {
        title: '+ de 110 mil',
        description: 'oportunidades identificadas',
      },
      {
        title: '+ de R$ 130,7 BI',
        description: 'em negócios mapeados',
      },
    ];
    return data.map((d, index) => {
      const { title, description } = d;
      return (
        <motion.div
          key={`total-${index}`}
          initial={{ opacity: 0, translateY: '50px' }}
          whileInView={{ opacity: 1, translateY: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 * (index + 1), duration: 0.5 }}
        >
          <p>{title}</p>
          <p>{description}</p>
        </motion.div>
      );
    });
  };

  return (
    <>
      <BrokerContactModal
        isOpen={contactModalOpen}
        onCloseModal={() => {
          setContactModalOpen(false);
        }}
      />
      <div className={styles['no-opportunities-mapped-container__wrapper']}>
        <div className={styles['no-opportunities-mapped-container__section']}>
          <div className={styles['no-opportunities-mapped-container__heading']}>
            <div>
              <h1>
                Você já imaginou prospectar novos negócios com o seu cliente?
              </h1>
              <h2>
                A Junto sim! O Fidelize te ajuda a identificar as oportunidades
                de negócios no âmbito judicial para seu cliente!{' '}
              </h2>
            </div>
            <motion.div
              initial={{ opacity: 0, translateX: '100px' }}
              whileInView={{ opacity: 1, translateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <HeaderIllustration />
            </motion.div>
          </div>
          <div
            className={
              styles['no-opportunities-mapped-container__how-it-works']
            }
          >
            <motion.h2
              initial={{ opacity: 0, translateX: '-100px' }}
              whileInView={{ opacity: 1, translateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0, duration: 0.5 }}
            >
              Como funciona o Fidelize?
            </motion.h2>
            <div>{renderHowItWorks()}</div>
          </div>
        </div>
        <div>
          <div className={styles['no-opportunities-mapped-container__section']}>
            <div
              className={styles['no-opportunities-mapped-container__benefits']}
            >
              <motion.h2
                initial={{ opacity: 0, translateX: '-100px' }}
                whileInView={{ opacity: 1, translateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0, duration: 0.5 }}
              >
                Porque o Fidelize traz mais vantagens?
              </motion.h2>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <p>
                  O Fidelize é uma inteligência de mercado exclusiva que a Junto
                  Seguros desenvolveu para agregar valor a você e seus clientes.
                  Com o Fidelize, você estará se antecipando as necessidades de
                  seus clientes, gerando novas oportunidades de negócio.
                </p>
                <div>
                  <LogoFidelize />
                </div>
              </motion.div>
              <div>{renderFidelizeTotals()}</div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div>
                  <AwardIcon />
                </div>
                <div>
                  <h3>Projeto premiado</h3>
                  <p>
                    O Fidelize foi top 3 no Prêmio de Inovação em Seguros e também uma das 100 maiores
                    inovações no uso de Tecnologia no mercado brasileiro!
                  </p>
                  <span>
                    *Prêmio Antonio Carlos de Almeida Braga de Inovação em Seguros,
                    promovido pela CNseg e Prêmio As 100+ Inovadora no Uso de TI, pela IT Fórum.
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        <div className={styles['no-opportunities-mapped-container__section']}>
          <div className={styles['no-opportunities-mapped-container__contact']}>
            <motion.h2
              initial={{ opacity: 0, translateX: '-100px' }}
              whileInView={{ opacity: 1, translateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0, duration: 0.5 }}
            >
              Fidelize com a Junto!
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h1>
                Quer saber mais sobre o Fidelize e gerar novas oportunidades de
                negócio?
              </h1>
              <p>Solicite contato comercial. Porque Junto fica mais fácil. </p>
              <Button
                onClick={() => {
                  TagManager.dataLayer({
                    dataLayer: {
                      event: 'ClickNoOpportunitiesMappedContactButton',
                    },
                  });
                  setContactModalOpen(true);
                }}
              >
                Solicitar contato comercial
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoOpportunitiesMappedContainer;
