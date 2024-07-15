import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WorkoutTrackerComponent } from './workout-form.component';
import { WorkoutService } from '../../services/workout.service';

describe('WorkoutTrackerComponent', () => {
  let component: WorkoutTrackerComponent;
  let fixture: ComponentFixture<WorkoutTrackerComponent>;
  let workoutServiceSpy: jasmine.SpyObj<WorkoutService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const workoutSpy = jasmine.createSpyObj('WorkoutService', ['addWorkout']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [WorkoutTrackerComponent, FormsModule],
      providers: [
        { provide: WorkoutService, useValue: workoutSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutTrackerComponent);
    component = fixture.componentInstance;
    workoutServiceSpy = TestBed.inject(WorkoutService) as jasmine.SpyObj<WorkoutService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.username).toBe('');
    expect(component.workoutType).toBe('Running');
    expect(component.minutes).toBe(0);
    expect(component.workoutTypes).toEqual(['Running', 'Cycling', 'Swimming', 'Yoga']);
  });

  it('should call workoutService.addWorkout and navigate when addWorkout is called', () => {
    component.username = 'John Doe';
    component.workoutType = 'Cycling';
    component.minutes = 30;

    component.addWorkout();

    expect(workoutServiceSpy.addWorkout).toHaveBeenCalledWith('John Doe', 'Cycling', 30);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/userdata']);
  });

  it('should reset form fields after addWorkout is called', () => {
    component.username = 'John Doe';
    component.workoutType = 'Cycling';
    component.minutes = 30;

    component.addWorkout();

    expect(component.username).toBe('');
    expect(component.workoutType).toBe('Running');
    expect(component.minutes).toBe(0);
  });

  it('should render form inputs correctly', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('input#username')).toBeTruthy();
    expect(compiled.querySelector('select#workoutType')).toBeTruthy();
    expect(compiled.querySelector('input#minutes')).toBeTruthy();
    expect(compiled.querySelector('button')).toBeTruthy();
  });

  it('should update component properties when form inputs change', () => {
    const compiled = fixture.nativeElement;
    const usernameInput = compiled.querySelector('input#username');
    const workoutTypeSelect = compiled.querySelector('select#workoutType');
    const minutesInput = compiled.querySelector('input#minutes');

    usernameInput.value = 'Jane Doe';
    usernameInput.dispatchEvent(new Event('input'));
    workoutTypeSelect.value = 'Cycling';
    workoutTypeSelect.dispatchEvent(new Event('change'));
    minutesInput.value = '45';
    minutesInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.username).toBe('Jane Doe');
    expect(component.workoutType).toBe('Cycling');
    expect(component.minutes).toBe(45);
  });

  it('should display all workout types in the select element', () => {
    const compiled = fixture.nativeElement;
    const workoutTypeSelect = compiled.querySelector('select#workoutType');
    const options = workoutTypeSelect.querySelectorAll('option');

    expect(options.length).toBe(component.workoutTypes.length);
    component.workoutTypes.forEach((type, index) => {
      expect(options[index].textContent).toContain(type);
    });
  });

  it('should have a button with text "Add Workout"', () => {
    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('button');
    expect(button.textContent).toContain('Add Workout');
  });
});