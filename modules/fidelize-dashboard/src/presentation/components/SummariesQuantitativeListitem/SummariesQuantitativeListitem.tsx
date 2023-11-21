/* eslint-disable react/button-has-type */

import { useRef, useState } from 'react';
import { Button, LinkButton, Tooltip } from 'junto-design-system';
import { SummariesQuantitativeByPolicyholderDTO } from '../../../application/types/dto/SummariesQuantitativeByPolicyholderDTO';
import styles from './SummariesQuantitativeListitem.module.scss';

interface SummariesQuantitativeListitemProps {
  summariesQuantitative: SummariesQuantitativeByPolicyholderDTO;
}

const SummariesQuantitativeListitem: React.FC<SummariesQuantitativeListitemProps> =
  ({ summariesQuantitative }) => {
    const { companyName, federalId, processesFound } = summariesQuantitative;
    const id = federalId;

    const [onHover, setOnHover] = useState(false);
    const blockDivRef = useRef<HTMLDivElement>(null);

    return (
      <>
        <div className={styles['summaries-quantitative-listitem__wrapper']}>
          <div className={styles['summaries-quantitative-listitem__column']}>
            <div
              className={
                styles['summaries-quantitative-listitem-tomador__label']
              }
            >
              {companyName}
            </div>
          </div>
          <div className={styles['summaries-quantitative-listitem__column']}>
            <div
              className={
                styles['summaries-quantitative-listitem-estimate__labels']
              }
            >
              <span>Trabalhistas</span>
              <span>{processesFound?.labor}</span>
            </div>

            <div
              className={
                styles['summaries-quantitative-listitem-estimate__labels']
              }
            >
              <span>
                {' '}
                Federais e Estaduais{' '}
                <LinkButton
                  data-testid="remove"
                  onClick={() => console.log('.')}
                  label=""
                  icon="help-circle"
                />
              </span>

              <span>{processesFound.federal + processesFound.state}</span>
            </div>
          </div>
          <div className={styles['summaries-quantitative-listitem__column']}>
            <div
              className={
                styles['summaries-quantitative-listitem-actions__wrapper']
              }
            >
              <div
                className={
                  styles['summaries-quantitative-listitem-message__label']
                }
              >
                Boa escolha! Parece relevante mapear o tomador.
              </div>
              <LinkButton
                data-testid="remove"
                onClick={() => console.log('.')}
                label=""
                icon="trash"
              />
            </div>
          </div>
        </div>

        <Tooltip
          anchorRef={blockDivRef}
          text={id}
          visible={onHover}
          position="top"
        />
      </>
    );
  };

export default SummariesQuantitativeListitem;
