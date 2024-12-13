import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'

import { IFormField } from '../interfaces/IFormField.interface'

import { distinctUntilChanged, Subject, takeUntil } from 'rxjs'
import { GameStateService } from '../services/game-state.service'
import { settingsFormSchema } from './settings-form.schema'

@Component({
  selector: 'app-settings-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="settingsForm" class="p-6 bg-gray-50 rounded-lg shadow-sm">
      <div class="space-y-6">
        @for (field of formFields; track field.name) {
          <div class="form-group">
            <label [for]="field.name" class="block text-sm font-medium text-gray-700 mb-1">
              {{ field.label }}
            </label>
            <input
              [id]="field.name"
              type="number"
              formControlName="field.name"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100"
              [ngClass]="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': fieldIsValid(field.name) }"
            />
            @if (!fieldIsValid(field.name)) {
              <p class="mt-1 text-sm text-red-600 h-5">
                {{ field.error }}
              </p>
            }
          </div>
        }
      </div>
    </form>
  `,
  styles: ``,
})
export class SettingsFormComponent implements OnInit {
  protected readonly settingsForm: FormGroup
  protected readonly formFields: IFormField[]
  private destroy$ = new Subject<void>()

  constructor(
    private fb: FormBuilder,
    private gameStateService: GameStateService
  ) {
    this.formFields = settingsFormSchema
    this.settingsForm = this.createForm()
  }
  
  ngOnInit(): void {
    // Subscribe to changes
    this.settingsForm.valueChanges.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
    ).subscribe((values) => {
      if (this.settingsForm.valid) {
        this.gameStateService.updateSettings(values)
      }
    })
  }

  private createForm(): FormGroup {
    const fields: Record<string, unknown>[] = []

    this.formFields.forEach((field: IFormField) => {
      // Iterate over fields JSON
      fields.push({ [field.name]: ['', field.validators] })
    })

    return this.fb.group(fields)
  }

  /**
   * Checks whether a form field is valid.
   *
   * @param fieldName - The name of the form field to validate.
   * @returns `true` if the field is invalid and either dirty or touched, otherwise `false`.
   */
  fieldIsValid(fieldName: string): boolean {
    const f = this.settingsForm.get(fieldName) as FormControl<IFormField>
    return !f || (f.invalid && (f.dirty || f.touched))
  }
}
