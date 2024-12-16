import { Validators } from '@angular/forms'

import { IFormField } from '../../interfaces/form-field.interface'

export const settingsFormSchema: IFormField[] = [
  {
    name: 'fallingSpeed',
    label: 'Falling Speed',
    error: 'Falling speed is required',
    validators: {
      required: Validators.required,
      min: Validators.min(10),
      max: Validators.max(50),
    },
  },
  {
    name: 'fallingFrequency',
    label: 'Falling Frequency',
    error: 'Frequency is required',
    validators: {
      required: Validators.required,
      min: Validators.min(1),
      max: Validators.max(10),
    },
  },
  {
    name: 'playerSpeed',
    label: 'Player Speed',
    error: 'Player Speed is required',
    validators: {
      required: Validators.required,
      min: Validators.min(10),
      max: Validators.max(100),
    },
  },
  {
    name: 'gameTime',
    label: 'Game Time',
    error: 'Game Time is required',
    validators: {
      required: Validators.required,
      min: Validators.min(10),
      max: Validators.max(100),
    },
  },
]
