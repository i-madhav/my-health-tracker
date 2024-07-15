import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {WorkoutTrackerComponent} from "./components/workout-form/workout-form.component";
import { FormsModule } from '@angular/forms';
import { UserInformationComponent } from "./components/user-information/user-information.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, WorkoutTrackerComponent, UserInformationComponent],
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {
  title = 'my-health-tracker';
}
