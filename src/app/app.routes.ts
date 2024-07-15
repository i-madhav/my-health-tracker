import { Routes } from '@angular/router';
import { WorkoutTrackerComponent } from './components/workout-form/workout-form.component';
import { UserInformationComponent } from './components/user-information/user-information.component';
import { UserWorkoutGraphComponent } from './components/user-graph/user-graph.component';

export const routes: Routes = [
  { path: '', component: WorkoutTrackerComponent },
  { path: 'userdata', component: UserInformationComponent },
  {path:'usergraph' , component:UserWorkoutGraphComponent},
  { path: '**', redirectTo: '' }
];
