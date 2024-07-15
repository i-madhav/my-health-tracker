import { TestBed } from '@angular/core/testing';
import { WorkoutService } from './workout.service';

describe('WorkoutService', () => {
  let service: WorkoutService;
  let localStorageMock: { [key: string]: string } = {};

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutService);

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.callFake((key) =>
      key in localStorageMock ? localStorageMock[key] : null
    );
    spyOn(localStorage, 'setItem').and.callFake(
      (key, value) => (localStorageMock[key] = value + '')
    );
    spyOn(localStorage, 'clear').and.callFake(() => (localStorageMock = {}));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load sample data if localStorage is empty', () => {
    const userData = service.getUserData();
    expect(userData.length).toBe(2);
    expect(userData[0].name).toBe('John Doe');
    expect(userData[1].name).toBe('Jane Smith');
  });

  it('should load data from localStorage if available', () => {
    const testData = [
      {
        id: 1,
        name: 'Test User',
        workouts: [{ type: 'Running', minutes: 30 }],
      },
    ];
    localStorage.setItem('userData', JSON.stringify(testData));

    // Re-initialize the service to trigger loading from localStorage
    service = TestBed.inject(WorkoutService);

    const userData = service.getUserData();
    expect(userData.length).toBe(1);
    expect(userData[0].name).toBe('Test User');
  });

  it('should add a new workout for an existing user', () => {
    service.addWorkout('John Doe', 'Swimming', 45);
    const userData = service.getUserData();
    const user = userData.find((u) => u.name === 'John Doe');
    expect(user?.workouts.length).toBe(3);
    expect(user?.workouts[2]).toEqual({ type: 'Swimming', minutes: 45 });
  });

  it('should add a new user when adding a workout for a non-existing user', () => {
    service.addWorkout('New User', 'Yoga', 60);
    const userData = service.getUserData();
    const newUser = userData.find((u) => u.name === 'New User');
    expect(newUser).toBeTruthy();
    expect(newUser?.workouts.length).toBe(1);
    expect(newUser?.workouts[0]).toEqual({ type: 'Yoga', minutes: 60 });
  });

  it('should save to localStorage when adding a workout', () => {
    service.addWorkout('John Doe', 'Swimming', 45);
    expect(localStorage.setItem).toHaveBeenCalled();
    const savedData = JSON.parse(localStorageMock['userData']);
    expect(savedData.length).toBe(2);
    expect(savedData[0].workouts.length).toBe(3);
  });

  it('should return correct user data', () => {
    const userData = service.getUserData();
    expect(userData.length).toBe(2);
    expect(userData[0].name).toBe('John Doe');
    expect(userData[1].name).toBe('Jane Smith');
  });
});