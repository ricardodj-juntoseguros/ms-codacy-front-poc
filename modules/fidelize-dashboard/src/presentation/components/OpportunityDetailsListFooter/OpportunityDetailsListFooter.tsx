import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Button } from 'junto-design-system';
import { thousandSeparator } from '@shared/utils';
import { OpportunityDetailsItemDTO } from '../../../application/types/dto';
import styles from './OpportunityDetailsListFooter.module.scss';

interface OpportunityDetailsListFooterProps {
  listContainerRef: React.RefObject<HTMLDivElement>;
  selectedOpportunities: OpportunityDetailsItemDTO[];
  onMoreDetailsClick: () => void;
}

const OpportunityDetailsListFooter: React.FC<OpportunityDetailsListFooterProps> =
  ({ listContainerRef, selectedOpportunities, onMoreDetailsClick }) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const [sticky, setSticky] = useState(false);

    useEffect(() => {
      const checkSticky = () => {
        if (!bottomRef.current || !listContainerRef.current) {
          return;
        }
        // Always sticky for mobile
        if (window.innerWidth < 1008) {
          setSticky(true);
          return;
        }
        const topVal = window.scrollY + window.innerHeight;
        const breakpointTop = listContainerRef.current.offsetTop;
        const breakpointBottom = bottomRef.current.offsetTop;
        setSticky(topVal > breakpointTop && topVal < breakpointBottom);
      };
      window.addEventListener('scroll', checkSticky);
      window.addEventListener('touchmove', checkSticky);
      checkSticky();
      return () => {
        window.removeEventListener('scroll', checkSticky);
        window.removeEventListener('touchmove', checkSticky);
      };
    }, [bottomRef, listContainerRef]);

    const getSelectionCount = () => {
      const count = selectedOpportunities.length;
      const suffix = `selecionado${count > 1 ? 's' : ''}`;
      return `${count} ${suffix}`;
    };

    const getInsuredAmountTotalizer = () => {
      const sum = selectedOpportunities
        .map(o => o.securityAmount)
        .reduce((accumulator, current) => {
          return accumulator + current;
        });
      return thousandSeparator(sum, '.', 2);
    };

    return (
      <>
        <div ref={bottomRef} />
        <div
          className={classNames(
            styles['opportunity-details-list-footer__wrapper'],
            {
              [styles['opportunity-details-list-footer__wrapper--sticky']]:
                sticky,
            },
          )}
        >
          <div>
            <p
              className={classNames(
                styles['opportunity-details-list-footer__selection-counter'],
                {
                  [styles[
                    'opportunity-details-list-footer__selection-counter--warning'
                  ]]: selectedOpportunities.length === 20,
                },
              )}
            >
              {getSelectionCount()}
            </p>
            <p className={styles['opportunity-details-list-footer__totalizer']}>
              , totalizando R$ {getInsuredAmountTotalizer()} em IS.
            </p>
          </div>
          <div>
            <Button
              size="medium"
              onClick={() => onMoreDetailsClick()}
              data-testid="btn-more-details-footer"
            >
              {
                (
                  <p>
                    Solicitar detalhes
                    <i className="icon-plus-circle" />
                  </p>
                ) as any
              }
            </Button>
          </div>
        </div>
      </>
    );
  };

export default OpportunityDetailsListFooter;
