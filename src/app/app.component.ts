import { Component } from '@angular/core'

import { SettingsFormComponent } from './forms/settings-form.component'
import { SettingsValidatorService } from './services/settings-validator.service'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SettingsFormComponent],
  providers: [SettingsValidatorService],
  template: `
    <div class="min-h-screen bg-gray-50">
      <h1 class="mb-6">Game Settings</h1>
      <app-settings-form></app-settings-form>
    </div>
  `,
  styles: ``,
})
export class AppComponent {
  title = 'slots-game'
}
