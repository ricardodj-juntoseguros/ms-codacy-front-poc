import React from 'react';
import { Alert, LinkButton, Tag } from 'junto-design-system';
import { PolicyholderDTO } from '../../../application/types/dto';
import styles from './PolicyholderFilterSelectorTags.module.scss';

interface PolicyholderFilterSelectorTagsProps {
  selectedPolicyholders: PolicyholderDTO[];
  onRemove: (policyholder: PolicyholderDTO) => void;
  onClear: () => void;
  showMaxAlert: boolean;
}

const PolicyholderFilterSelectorTags: React.FC<PolicyholderFilterSelectorTagsProps> =
  ({ selectedPolicyholders, onRemove, onClear, showMaxAlert }) => {
    const renderTags = () => {
      return selectedPolicyholders.map(policyholder => {
        return (
          <div
            key={`tag-policyholder-${policyholder.federalId}`}
            className={styles['policyholder-filter-selector-tags__tag_wrapper']}
          >
            <Tag
              variant="neutral"
              removable
              onRemove={() => onRemove(policyholder)}
            >
              {policyholder.name.length > 27
                ? `${policyholder.name.substring(0, 27)}...`
                : policyholder.name}
            </Tag>
          </div>
        );
      });
    };

    if (selectedPolicyholders.length === 0) return null;
    return (
      <>
        <div className={styles['policyholder-filter-selector-tags__wrapper']}>
          <div
            className={styles['policyholder-filter-selector-tags__tags-list']}
          >
            {renderTags()}
          </div>
          <div>
            <LinkButton
              data-testid="btn-clear-policyholders"
              label="Limpar tudo"
              size="small"
              onClick={() => onClear()}
            />
          </div>
        </div>
        {showMaxAlert && (
          <div className={styles['policyholder-filter-selector-tags__alert']}>
            <Alert
              text="Você pode selecionar no máximo 10 tomadores."
              variant="warning"
              width={314}
              arrow="top-start"
            />
          </div>
        )}
      </>
    );
  };

export default PolicyholderFilterSelectorTags;
