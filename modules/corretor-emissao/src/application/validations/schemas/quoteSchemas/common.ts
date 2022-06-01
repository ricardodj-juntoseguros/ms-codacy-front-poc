import { mergeValidationSchemas } from '../../../../helpers/mergeValidationSchemas';
import {
  CoverageDataSchema,
  SearchValidationSchema,
} from '../componentSchemas';

export const common = mergeValidationSchemas(
  SearchValidationSchema,
  CoverageDataSchema,
);
