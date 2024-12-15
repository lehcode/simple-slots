import { Injectable } from '@angular/core'
import { FormControl, ValidationErrors } from '@angular/forms'

@Injectable({
  providedIn: 'root',
})
export class SettingsValidatorService {
  validatePositives(formControl: FormControl): ValidationErrors | null {
    const value = formControl.value

    if (isNaN(value) || value === null || value === '') {
      return { required: true }
    }

    if (value <= 0) {
      return { positive: false }
    }

    return null
  }
}
