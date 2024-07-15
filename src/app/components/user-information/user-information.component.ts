import { Component, OnInit } from '@angular/core';
import { WorkoutService } from '../../services/workout.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Workout {
  type: string;
  minutes: number;
}

interface User {
  id: number;
  name: string;
  workouts: Workout[];
}

@Component({
  selector: 'app-user-information',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.css']
})
export class UserInformationComponent implements OnInit {
  userData: User[] = [];
  filteredUserData: User[] = [];
  paginatedUserData: User[] = [];
  searchQuery: string = '';
  filterType: string = '';
  
  // Pagination variables
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  constructor(private workoutService: WorkoutService,
              private routers:Router
  ) { }

  ngOnInit(): void {
    this.userData = this.workoutService.getUserData();
    this.filteredUserData = [...this.userData];
    this.updatePaginatedData();
  }

  applyFilters() {
    const query = this.searchQuery.toLowerCase();
    this.filteredUserData = this.userData.filter(user => {
      if (this.filterType === 'name') {
        return user.name.toLowerCase().includes(query);
      } else if (this.filterType === 'workoutType') {
        return user.workouts.some(workout => workout.type.toLowerCase().includes(query));
      } else if (this.filterType === 'workoutMinutes') {
        const minutes = parseInt(query, 10);
        return !isNaN(minutes) && user.workouts.some(workout => workout.minutes === minutes);
      } else {
        return user.name.toLowerCase().includes(query) ||
               user.workouts.some(workout => workout.type.toLowerCase().includes(query)) ||
               user.workouts.some(workout => workout.minutes.toString().includes(query));
      }
    });
    this.currentPage = 1;
    this.updatePaginatedData();
  }

  updatePaginatedData() {
    this.totalPages = Math.ceil(this.filteredUserData.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedUserData = this.filteredUserData.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }

  getTotalWorkoutMinutes(workouts: Workout[]): number {
    return workouts.reduce((total, workout) => total + workout.minutes, 0);
  }

  goToGraph(){
    this.routers.navigate(['/usergraph'])
  }
}