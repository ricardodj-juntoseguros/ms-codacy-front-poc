import React from 'react';
import { Alert, LinkButton, Tag } from 'junto-design-system';
import { AllPolicyholdersInWalletDTO } from '../../../application/types/dto';
import styles from './AllPolicyholdersInWalletFilterSelectorTags.module.scss';

interface AllPolicyholdersInWalletFilterSelectorTagsProps {
  selectedPolicyholders: AllPolicyholdersInWalletDTO[];
  onRemove: (policyholder: AllPolicyholdersInWalletDTO) => void;
  onClear: () => void;
  showMaxAlert: boolean;
}

const AllPolicyholdersInWalletFilterSelectorTags: React.FC<AllPolicyholdersInWalletFilterSelectorTagsProps> =
  ({ selectedPolicyholders, onRemove, onClear, showMaxAlert }) => {
    const renderTags = () => {
      return selectedPolicyholders.map(policyholder => {
        return (
          <div
            key={`tag-policyholder-${policyholder.policyholderFederalId}`}
            className={
              styles[
                'all-policyholders-in-wallet-filter-selector-tags__tag_wrapper'
              ]
            }
          >
            <Tag
              variant="neutral"
              removable
              onRemove={() => onRemove(policyholder)}
            >
              {policyholder.policyholderName.length > 27
                ? `${policyholder.policyholderName.substring(0, 27)}...`
                : policyholder.policyholderName}
            </Tag>
          </div>
        );
      });
    };

    if (selectedPolicyholders.length === 0) return null;
    return (
      <>
        <div
          className={
            styles['all-policyholders-in-wallet-filter-selector-tags__wrapper']
          }
        >
          <div
            className={
              styles[
                'all-policyholders-in-wallet-filter-selector-tags__tags-list'
              ]
            }
          >
            {renderTags()}
          </div>
          <div>
            <LinkButton
              data-testid="btn-clear-policyholders"
              label="Limpar Tomadores"
              size="small"
              icon="icon icon-trash"
              iconPosition="right"
              onClick={() => onClear()}
            />
          </div>
        </div>
        {showMaxAlert && (
          <div
            className={
              styles['all-policyholders-in-wallet-filter-selector-tags__alert']
            }
          >
            <Alert
              text="Você pode selecionar no máximo 5 tomadores."
              variant="warning"
              width={314}
              arrow="top-start"
            />
          </div>
        )}
      </>
    );
  };

export default AllPolicyholdersInWalletFilterSelectorTags;
