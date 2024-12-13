import { Validators } from "@angular/forms";

import { IFormField } from "../interfaces/IFormField.interface";

export const settingsFormSchema: IFormField[] = [
    {
      "name": "fallingSpeed",
      "label": "Falling Speed",
      "error": "Falling speed is required",
      validators: [Validators.required, Validators.min(10), Validators.max(50)]
    },
    {
      name: "fallingFrequency",
      label: 'Falling Frequency',
      error: 'Frequency is required',
      validators: [Validators.required, Validators.min(10), Validators.max(50)]
    },
    {
      name: "playerSpeed",
      label: 'Player Speed',
      error: 'Player Speed is required',
      validators: [Validators.required]
    },
    {
      name: "gameTime",
      label: 'Game Time',
      error: 'Game Time is required',
      validators: [Validators.required]
    }
  ]
