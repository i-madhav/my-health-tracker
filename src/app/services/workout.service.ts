import { Injectable } from '@angular/core';

interface Workout {
  type: string;
  minutes: number;
}

interface UserData {
  id: number;
  name: string;
  workouts: Workout[];
}

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private userData: UserData[] = [];
  private idCounter: number = 1;

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    const storedUsers = localStorage.getItem('userData');
    if (storedUsers) {
      this.userData = JSON.parse(storedUsers);
      this.idCounter = Math.max(...this.userData.map(user => user.id)) + 1;
    } else {
      // If no data in localStorage, use the sample data
      this.userData = [
        {
          id: 1,
          name: 'John Doe',
          workouts: [
            { type: 'Running', minutes: 30 },
            { type: 'Cycling', minutes: 45 }
          ]
        },
        {
          id: 2,
          name: 'Jane Smith',
          workouts: [
            { type: 'Swimming', minutes: 60 },
            { type: 'Running', minutes: 20 }
          ]
        }
      ];
      this.idCounter = 3;
      this.saveToLocalStorage();
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem('userData', JSON.stringify(this.userData));
  }

  addWorkout(name: string, type: string, minutes: number) {
    let user = this.userData.find(u => u.name === name);
    if (!user) {
      user = {
        id: this.idCounter++,
        name: name,
        workouts: []
      };
      this.userData.push(user);
    }
    user.workouts.push({ type, minutes });
    this.saveToLocalStorage();
    console.log(this.userData);
  }

  getUserData(): UserData[] {
    return this.userData;
  }
}

