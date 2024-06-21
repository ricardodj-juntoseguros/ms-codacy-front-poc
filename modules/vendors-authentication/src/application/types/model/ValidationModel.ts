export interface ValidationErrorModel {
  [x: string]: string[];
}

export interface ValidationModel {
  isValidating?: boolean;
  isValidForm: boolean;
  errors: ValidationErrorModel;
}
