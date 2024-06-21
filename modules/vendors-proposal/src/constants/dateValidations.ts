import { subDays } from 'date-fns';

export const RETROACTIVE_MAX_DAYS = 1095; // 3 years
export const MAX_END_VALIDITY = '2100/01/01';
export const MIN_VALIDITY_DAYS = 1;

export const MIN_INITIAL_DATE = subDays(new Date(), RETROACTIVE_MAX_DAYS);
export const MAX_END_DATE = new Date(MAX_END_VALIDITY);
