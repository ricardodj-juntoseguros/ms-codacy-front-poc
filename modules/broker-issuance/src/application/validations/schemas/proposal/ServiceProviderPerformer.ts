import { array, boolean, number, object, string } from 'yup';
import { CommonProposalSchema } from './Common';
import { PolicyRenewalTypeEnum } from '../../../types/model';

export const ServiceProviderProposalSchema = CommonProposalSchema.concat(
  object().shape({
    renewal: object()
      .shape({
        isPolicyInProgress: boolean().notRequired(),
        type: number().notRequired(),
        mainPolicyNumber: string().notRequired().max(15),
        documentList: array().when(['isPolicyInProgress', 'type'], {
          is: (isPolicyInProgress: boolean, type: number) =>
            isPolicyInProgress && type !== PolicyRenewalTypeEnum.Undefined,
          then: array()
            .min(1)
            .required()
            .of(
              object().shape({
                hasOrdinaryNumbering: boolean().required(),
                number: string().required(),
                type: number().required(),
              }),
            ),
          otherwise: array().notRequired(),
        }),
      })
      .optional()
      .nullable(),
  }),
);
