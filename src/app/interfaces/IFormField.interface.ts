import { Validators } from "@angular/forms";

export interface IFormField {
  name: string;
  label: string;
  error: string;
  validators: Validators[],
  [key: string]: unknown;
}