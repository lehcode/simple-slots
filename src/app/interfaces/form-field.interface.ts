import { ValidatorFn } from "@angular/forms";

export interface IFormField {
  name: string;
  label: string;
  error: string;
  validators: Partial<Record<string, ValidatorFn>>;
  [key: string]: unknown;
}