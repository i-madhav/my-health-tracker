
import { Component } from '@angular/core';
import { WorkoutService } from '../../services/workout.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workout-form',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './workout-form.component.html',
  styleUrl: './workout-form.component.css'
})

export class WorkoutTrackerComponent {
  username: string = '';
  workoutType: string = 'Running';
  minutes: number = 0;
  workoutTypes: string[] = ['Running', 'Cycling', 'Swimming', 'Yoga'];

  constructor(private workoutService: WorkoutService,
              private router:Router
  ) {}

  addWorkout() {
    if(!this.username || this.workoutType || this.minutes) alert("Fields are empty");
    this.workoutService.addWorkout(this.username, this.workoutType, this.minutes);
    this.username = '';
    this.workoutType = 'Running';
    this. minutes = 0;

    this.router.navigate(['/userdata']);
  }
}