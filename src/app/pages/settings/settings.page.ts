import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"

import { SettingsFormComponent } from "../../components/forms/settings-form.component"


@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [RouterOutlet, SettingsFormComponent],
    template: `
    <div class="p-4">
      <app-settings-form></app-settings-form>
    </div>
  `,
})
export class SettingsPage {}
