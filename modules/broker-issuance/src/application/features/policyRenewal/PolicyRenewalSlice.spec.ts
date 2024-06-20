/* eslint-disable prefer-promise-reject-errors */
import { waitFor } from '@testing-library/react';
import { makeToast } from 'junto-design-system';
import { renewalDocumentListMock } from 'modules/broker-issuance/src/__mocks__';
import { store } from '../../../config/store';
import {
  getRenewalDocumentList,
  policyRenewalActions,
  verifyPolicy,
} from './PolicyRenewalSlice';
import { PolicyRenewalTypeEnum } from '../../types/model';
import PolicyRenewalApi from './PolicyRenewalApi';

jest.mock('junto-design-system', () => {
  const original = jest.requireActual('junto-design-system');
  return {
    ...original,
    makeToast: jest.fn(),
  };
});

describe('PolicyRenewalSlice', () => {
  let getRenewalDocumentListMock: jest.SpyInstance;

  beforeAll(async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  beforeEach(() => {
    store.dispatch(policyRenewalActions.resetPolicyRenewal());
    jest.clearAllMocks();
    getRenewalDocumentListMock = jest
      .spyOn(PolicyRenewalApi, 'getRenewalDocumentList')
      .mockImplementation(() => Promise.resolve(renewalDocumentListMock));
  });

  it('should be able to set is policy renewal', async () => {
    store.dispatch(policyRenewalActions.setIsPolicyRenewal(true));
    await waitFor(() => {
      const { policyRenewal } = store.getState();
      expect(policyRenewal.isPolicyRenewal).toEqual(true);
    });
  });

  it('should be able to set policy renewal type', async () => {
    store.dispatch(
      policyRenewalActions.setPolicyRenewalType(
        PolicyRenewalTypeEnum.OnGoingProcess,
      ),
    );
    await waitFor(() => {
      const { policyRenewal } = store.getState();
      expect(policyRenewal.policyRenewalType).toEqual(
        PolicyRenewalTypeEnum.OnGoingProcess,
      );
    });
  });

  it('should be able to set main policy number', async () => {
    store.dispatch(policyRenewalActions.setMainPolicyNumber('12312312312'));
    await waitFor(() => {
      const { policyRenewal } = store.getState();
      expect(policyRenewal.mainPolicyNumber).toEqual('12312312312');
    });
  });

  it('should be able to set has policy renewal changes', async () => {
    store.dispatch(policyRenewalActions.setHasPolicyRenewalChanges(true));
    await waitFor(() => {
      const { policyRenewal } = store.getState();
      expect(policyRenewal.hasPolicyRenewalChanges).toEqual(true);
    });
  });

  it('should be able to verify policy and if successful, must insert the attributes correctly without an error message', async () => {
    const verifyPolicyMock = jest
      .spyOn(PolicyRenewalApi, 'verifyPolicy')
      .mockImplementation(() =>
        Promise.resolve({
          documentNumber: 12312312312,
          message: '',
          needEndorsement: false,
        }),
      );
    store.dispatch(
      verifyPolicy({
        mainPolicyNumber: '01-0775-0472216',
        policyholderId: 12345,
      }),
    );
    expect(verifyPolicyMock).toHaveBeenCalledWith('01-0775-0472216', 12345);
    await waitFor(() => {
      const { policyRenewal } = store.getState();
      expect(policyRenewal.documentNumber).toEqual(12312312312);
      expect(policyRenewal.needEndorsement).toEqual(false);
      expect(policyRenewal.verifyErrorMessage).toEqual('');
    });
  });

  it('should be able to verify policy and if it fails with status code 400, you must fill in the attributes and error message', async () => {
    const verifyPolicyMock = jest
      .spyOn(PolicyRenewalApi, 'verifyPolicy')
      .mockImplementation(() =>
        Promise.reject({
          status: 400,
          data: {
            data: {
              documentNumber: null,
              message: 'Error test',
              needEndorsement: false,
            },
          },
        }),
      );
    store.dispatch(
      verifyPolicy({
        mainPolicyNumber: '01-0775-0472216',
        policyholderId: 12345,
      }),
    );
    expect(verifyPolicyMock).toHaveBeenCalledWith('01-0775-0472216', 12345);
    await waitFor(() => {
      const { policyRenewal } = store.getState();
      expect(policyRenewal.documentNumber).toEqual(null);
      expect(policyRenewal.needEndorsement).toEqual(false);
      expect(policyRenewal.verifyErrorMessage).toEqual('Error test');
    });
  });

  it('should be able to verify policy and if it fails with status code 500, you must fill in the attributes and error message', async () => {
    const verifyPolicyMock = jest
      .spyOn(PolicyRenewalApi, 'verifyPolicy')
      .mockImplementation(() =>
        Promise.reject({
          status: 500,
          data: {
            data: {
              Message: 'Internal server error',
            },
          },
        }),
      );
    store.dispatch(
      verifyPolicy({
        mainPolicyNumber: '01-0775-0472216',
        policyholderId: 12345,
      }),
    );
    expect(verifyPolicyMock).toHaveBeenCalledWith('01-0775-0472216', 12345);
    await waitFor(() => {
      const { policyRenewal } = store.getState();
      expect(policyRenewal.documentNumber).toEqual(null);
      expect(policyRenewal.needEndorsement).toEqual(false);
      expect(policyRenewal.verifyErrorMessage).toEqual('');
      expect(makeToast).toHaveBeenCalledWith('error', 'Internal server error');
    });
  });

  it('should be able to reset policy renewal', async () => {
    store.dispatch(policyRenewalActions.setIsPolicyRenewal(true));
    store.dispatch(
      policyRenewalActions.setPolicyRenewalType(
        PolicyRenewalTypeEnum.BelongsToAnotherInsuranceCompany,
      ),
    );
    store.dispatch(policyRenewalActions.setMainPolicyNumber('01-0775-0472216'));
    const { policyRenewal } = store.getState();
    expect(policyRenewal.isPolicyRenewal).toEqual(true);
    expect(policyRenewal.policyRenewalType).toEqual(
      PolicyRenewalTypeEnum.BelongsToAnotherInsuranceCompany,
    );
    expect(policyRenewal.mainPolicyNumber).toEqual('01-0775-0472216');
    store.dispatch(policyRenewalActions.setIsPolicyRenewal(false));
    await waitFor(() => {
      const { policyRenewal } = store.getState();
      expect(policyRenewal.isPolicyRenewal).toEqual(false);
      expect(policyRenewal.policyRenewalType).toEqual(
        PolicyRenewalTypeEnum.Undefined,
      );
      expect(policyRenewal.mainPolicyNumber).toEqual('');
      expect(policyRenewal.verifyErrorMessage).toEqual('');
      expect(policyRenewal.documentNumber).toEqual(null);
      expect(policyRenewal.needEndorsement).toEqual(false);
    });
  });

  it('should be able to verify policy and if successful, must insert the attributes correctly without an error message', async () => {
    const getRenewalDocumentListMock = jest
      .spyOn(PolicyRenewalApi, 'getRenewalDocumentList')
      .mockImplementation(() => Promise.resolve(renewalDocumentListMock));
    store.dispatch(getRenewalDocumentList());
    expect(getRenewalDocumentListMock).toHaveBeenCalled();
    await waitFor(() => {
      const { policyRenewal } = store.getState();
      expect(policyRenewal.documentList).toMatchObject([
        {
          id: 1,
          description: 'Correspondência',
          hasChoiceOfNumberingType: false,
          active: false,
          inputValue: '',
          hasOrdinaryNumbering: false,
          value: '1',
          label: 'Correspondência',
          disabled: false,
        },
        {
          id: 2,
          description: 'Correspondência eletrônica',
          hasChoiceOfNumberingType: false,
          active: false,
          inputValue: '',
          hasOrdinaryNumbering: false,
          value: '2',
          label: 'Correspondência eletrônica',
          disabled: false,
        },
        {
          id: 3,
          description: 'Declaração',
          hasChoiceOfNumberingType: false,
          active: false,
          inputValue: '',
          hasOrdinaryNumbering: false,
          value: '3',
          label: 'Declaração',
          disabled: false,
        },
        {
          id: 4,
          description: 'Despacho',
          hasChoiceOfNumberingType: false,
          active: false,
          inputValue: '',
          hasOrdinaryNumbering: false,
          value: '4',
          label: 'Despacho',
          disabled: false,
        },
        {
          id: 5,
          description: 'Notificação',
          hasChoiceOfNumberingType: false,
          active: false,
          inputValue: '',
          hasOrdinaryNumbering: false,
          value: '5',
          label: 'Notificação',
          disabled: false,
        },
        {
          id: 6,
          description: 'Ofício',
          hasChoiceOfNumberingType: false,
          active: false,
          inputValue: '',
          hasOrdinaryNumbering: false,
          value: '6',
          label: 'Ofício',
          disabled: false,
        },
        {
          id: 7,
          description: 'Ordem de serviço',
          hasChoiceOfNumberingType: false,
          active: false,
          inputValue: '',
          hasOrdinaryNumbering: false,
          value: '7',
          label: 'Ordem de serviço',
          disabled: false,
        },
        {
          id: 8,
          description: 'Ordem/Pedido de compra',
          hasChoiceOfNumberingType: false,
          active: false,
          inputValue: '',
          hasOrdinaryNumbering: false,
          value: '8',
          label: 'Ordem/Pedido de compra',
          disabled: false,
        },
        {
          id: 9,
          description: 'Termo aditivo',
          hasChoiceOfNumberingType: true,
          active: false,
          inputValue: '',
          hasOrdinaryNumbering: false,
          value: '9',
          label: 'Termo aditivo',
          disabled: false,
        },
        {
          id: 10,
          description: 'Termo de aditamento',
          hasChoiceOfNumberingType: true,
          active: false,
          inputValue: '',
          hasOrdinaryNumbering: false,
          value: '10',
          label: 'Termo de aditamento',
          disabled: false,
        },
        {
          id: 11,
          description: 'Termo de apostilamento',
          hasChoiceOfNumberingType: true,
          active: false,
          inputValue: '',
          hasOrdinaryNumbering: false,
          value: '11',
          label: 'Termo de apostilamento',
          disabled: false,
        },
        {
          id: 12,
          description: 'Termo de responsabilidade',
          hasChoiceOfNumberingType: false,
          active: false,
          inputValue: '',
          hasOrdinaryNumbering: false,
          value: '12',
          label: 'Termo de responsabilidade',
          disabled: false,
        },
      ]);
    });
  });

  it('should be able to get renewal documents list and if it fails with status code 400, you must fill in the attributes and error message', async () => {
    getRenewalDocumentListMock = jest
      .spyOn(PolicyRenewalApi, 'getRenewalDocumentList')
      .mockImplementation(() =>
        Promise.reject({
          status: 400,
          data: {
            message: 'Error test',
          },
        }),
      );
    store.dispatch(getRenewalDocumentList());
    expect(getRenewalDocumentListMock).toHaveBeenCalled();
    await waitFor(() => {
      expect(makeToast).toHaveBeenCalledWith('error', 'Error test');
    });
  });

  it('should be able to activate and deactivate a document', async () => {
    store.dispatch(getRenewalDocumentList());
    const { policyRenewal } = store.getState();
    store.dispatch(
      policyRenewalActions.setDocument({
        document: policyRenewal.documentList[2],
        active: true,
      }),
    );
    await waitFor(() => {
      const { policyRenewal } = store.getState();
      expect(policyRenewal.documentList[2].active).toBeTruthy();
    });
    store.dispatch(
      policyRenewalActions.setDocument({
        document: policyRenewal.documentList[2],
        active: false,
      }),
    );
    await waitFor(() => {
      const { policyRenewal } = store.getState();
      expect(policyRenewal.documentList[2].active).toBeFalsy();
    });
  });

  it('should be able to set policy renewal input value', async () => {
    store.dispatch(getRenewalDocumentList());
    const { policyRenewal } = store.getState();
    store.dispatch(
      policyRenewalActions.setDocumentInputValue({
        value: 'test',
        id: policyRenewal.documentList[2].id,
      }),
    );
    await waitFor(() => {
      const { policyRenewal } = store.getState();
      expect(policyRenewal.documentList[2].inputValue).toEqual('test');
      expect(policyRenewal.hasPolicyRenewalChanges).toBeTruthy();
    });
  });

  it('should be able to set policy renewal document hasOrdinaryNumbering', async () => {
    store.dispatch(getRenewalDocumentList());
    const { policyRenewal } = store.getState();
    store.dispatch(
      policyRenewalActions.setHasOrdinaryNumbering({
        hasOrdinaryNumbering: 'true',
        id: policyRenewal.documentList[2].id,
      }),
    );
    await waitFor(() => {
      const { policyRenewal } = store.getState();
      expect(policyRenewal.documentList[2].hasOrdinaryNumbering).toBeTruthy;
      expect(policyRenewal.hasPolicyRenewalChanges).toBeTruthy();
    });
  });

  it('should be able to set policy renewal resume data', async () => {
    store.dispatch(
      policyRenewalActions.setPolicyRenewalResume({
        isPolicyRenewal: true,
        type: 1,
        mainPolicyNumber: '',
        documentList: [
          {
            id: 10,
            description: 'Termo de aditamento',
            hasChoiceOfNumberingType: true,
            active: false,
            inputValue: '',
            hasOrdinaryNumbering: false,
            value: '10',
            label: 'Termo de aditamento',
            disabled: false,
          },
        ],
      }),
    );
    await waitFor(() => {
      const { policyRenewal } = store.getState();
      expect(policyRenewal.isPolicyRenewal).toBeTruthy();
      expect(policyRenewal.policyRenewalType).toEqual(1);
      expect(policyRenewal.mainPolicyNumber).toEqual('');
      expect(policyRenewal.documentList).toEqual([
        {
          id: 10,
          description: 'Termo de aditamento',
          hasChoiceOfNumberingType: true,
          active: false,
          inputValue: '',
          hasOrdinaryNumbering: false,
          value: '10',
          label: 'Termo de aditamento',
          disabled: false,
        },
      ]);
    });
  });
});
