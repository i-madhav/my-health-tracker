import { WorkoutService } from '../../services/workout.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { ListboxModule } from 'primeng/listbox';

@Component({
  selector: 'app-user-graph',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartModule, ListboxModule],
  templateUrl: './user-graph.component.html',
  styleUrls: ['./user-graph.component.css']
})
export class UserWorkoutGraphComponent implements OnInit {
  users: any[] = [];
  selectedUser: any;
  chartData: any;
  chartOptions: any;

  constructor(private workoutService: WorkoutService) { }

  ngOnInit() {
    this.users = this.workoutService.getUserData();
    this.initChartOptions();
  }

  initChartOptions() {
    this.chartOptions = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Minutes'
          }
        }
      }
    };
  }

  onUserSelect(event: any) {
    this.selectedUser = event.value;
    this.updateChart();
  }

  updateChart() {
    if (this.selectedUser) {
      const labels = this.selectedUser.workouts.map((w: any) => w.type);
      const data = this.selectedUser.workouts.map((w: any) => w.minutes);

      this.chartData = {
        labels: labels,
        datasets: [
          {
            label: 'Workout Minutes',
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1
          }
        ]
      };
    }
  }
}
