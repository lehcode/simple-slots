import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs'

import { IFormField } from '../../interfaces/form-field.interface'
import { GameStateService } from '../../services/game-state.service'

import { settingsFormSchema } from './settings-form.schema'

@Component({
  selector: 'app-settings-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" class="p-6 bg-gray-50 rounded-lg shadow-sm">
      <div class="space-y-6">
        @for (control of formFields; track control.name) {
          <div class="form-group">
            <label [for]="control.name" class="block text-sm font-medium text-gray-700 mb-1">
              {{ control.label }}
            </label>
            <input
              [id]="control.name"
              type="number"
              [formControlName]="control.name"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100"
              [class.border-red-300]="!isValid(control.name)"
              [class.focus:border-red-500]="!isValid(control.name)"
              [class.focus:ring-red-500]="!isValid(control.name)"
            />
            @if (!isValid(control.name)) {
              <p class="mt-1 text-sm text-red-600">
                {{ getErrorMessage(control) }}
              </p>
            }
          </div>
        }
      </div>
    </form>
  `,
  styles: ``,
})
export class SettingsFormComponent implements OnInit, OnDestroy {
  protected form!: FormGroup
  protected formFields: IFormField[] = settingsFormSchema
  private destroy$ = new Subject<void>()

  constructor(
    private fb: FormBuilder,
    private gameStateService: GameStateService,
  ) {
    this.createForm()
  }

  ngOnInit(): void {
    // Initial settings
    this.gameStateService.settings$.pipe(takeUntil(this.destroy$)).subscribe((settings) => {
      this.form.patchValue(settings, { emitEvent: false })
    })
    // Subscribe to changes
    this.form.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      )
      .subscribe((values) => {
        if (this.form.valid) {
          this.gameStateService.updateSettings(values)
        }
      })
  }

  /**
   * Creates a form group based on the form fields specified in the form fields schema.
   *
   * The form group is created using the `FormBuilder.group` method and is populated
   * with the form fields from the schema. The validators for each field are extracted
   * from the field's `validators` property and passed as the second argument to
   * `FormBuilder.group`.
   *
   * @returns A form group that represents the form fields specified in the schema.
   */
  private createForm() {
    const group: Record<string, unknown> = {}

    this.formFields.forEach((field) => {
      const validators = Object.values(field.validators)
      group[field.name] = ['', validators]
    })

    this.form = this.fb.group(group)
  }

  /**
   * Checks whether a form field is valid.
   *
   * @param fieldName - The name of the form field to validate.
   * @returns `true` if the field is invalid, dirty, or touched, otherwise `false`.
   */
  isValid(fieldName: string): boolean {
    const control = this.form.get(fieldName)

    if (!control) {
      throw new Error(`Control '${fieldName}' not found`)
    }

    return control.invalid || control.dirty || control.touched ? false : true
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   *
   * Called just before Angular destroys the component. Unsubscribes from
   * all Observables subscribed in the component.
   */
  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  protected getErrorMessage(field: IFormField): string {
    const control = this.form.get(field.name)

    if (!control) {
      throw new Error(`Control '${field.name}' not found`)
    }

    if (control.hasError('required')) {
      return field.error
    }

    // const minValidator: ValidatorFn;
    // const maxValidator: ValidatorFn;

    if (control.hasError('min')) {
      const minValidator = field.validators['min']
      const minValue = (minValidator as any).min
      return `Value must be at least ${minValue}`
    }
    if (control.hasError('max')) {
      const maxValidator = field.validators['max']
      const maxValue = (maxValidator as any).max
      return `Value must be at most ${maxValue}`
    }

    return ''
  }
}
