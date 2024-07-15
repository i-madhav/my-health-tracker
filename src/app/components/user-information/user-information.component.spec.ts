import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInformationComponent } from './user-information.component';
import { WorkoutService } from '../../services/workout.service';

describe('UserInformationComponent', () => {
  let component: UserInformationComponent;
  let fixture: ComponentFixture<UserInformationComponent>;
  let workoutServiceSpy: jasmine.SpyObj<WorkoutService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const workoutSpy = jasmine.createSpyObj('WorkoutService', ['getUserData']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [UserInformationComponent, FormsModule],
      providers: [
        { provide: WorkoutService, useValue: workoutSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserInformationComponent);
    component = fixture.componentInstance;
    workoutServiceSpy = TestBed.inject(WorkoutService) as jasmine.SpyObj<WorkoutService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Mock user data
    workoutServiceSpy.getUserData.and.returnValue([
      { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }, { type: 'Cycling', minutes: 45 }] },
      { id: 2, name: 'Jane Smith', workouts: [{ type: 'Swimming', minutes: 60 }] }
    ]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with user data', () => {
    expect(component.userData.length).toBe(2);
    expect(component.filteredUserData.length).toBe(2);
    expect(component.paginatedUserData.length).toBe(2);
  });

  it('should filter users by name', () => {
    component.searchQuery = 'john';
    component.filterType = 'name';
    component.applyFilters();
    expect(component.filteredUserData.length).toBe(1);
    expect(component.filteredUserData[0].name).toBe('John Doe');
  });

  it('should filter users by workout type', () => {
    component.searchQuery = 'swimming';
    component.filterType = 'workoutType';
    component.applyFilters();
    expect(component.filteredUserData.length).toBe(1);
    expect(component.filteredUserData[0].name).toBe('Jane Smith');
  });

  it('should filter users by workout minutes', () => {
    component.searchQuery = '45';
    component.filterType = 'workoutMinutes';
    component.applyFilters();
    expect(component.filteredUserData.length).toBe(1);
    expect(component.filteredUserData[0].name).toBe('John Doe');
  });

  it('should paginate user data', () => {
    component.pageSize = 1;
    component.updatePaginatedData();
    expect(component.paginatedUserData.length).toBe(1);
    expect(component.totalPages).toBe(2);
  });

  it('should move to next page', () => {
    component.pageSize = 1;
    component.updatePaginatedData();
    component.nextPage();
    expect(component.currentPage).toBe(2);
    expect(component.paginatedUserData[0].name).toBe('Jane Smith');
  });

  it('should move to previous page', () => {
    component.pageSize = 1;
    component.updatePaginatedData();
    component.nextPage();
    component.previousPage();
    expect(component.currentPage).toBe(1);
    expect(component.paginatedUserData[0].name).toBe('John Doe');
  });

  it('should calculate total workout minutes correctly', () => {
    const workouts = [{ type: 'Running', minutes: 30 }, { type: 'Cycling', minutes: 45 }];
    expect(component.getTotalWorkoutMinutes(workouts)).toBe(75);
  });

  it('should navigate to graph page', () => {
    component.goToGraph();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/usergraph']);
  });

  it('should render user data table when data is available', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('table')).toBeTruthy();
    expect(compiled.querySelectorAll('tbody tr').length).toBe(2);
  });

  it('should render no data message when filtered data is empty', () => {
    component.searchQuery = 'nonexistent';
    component.applyFilters();
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.no-data-message')).toBeTruthy();
  });

  it('should disable previous button on first page', () => {
    const compiled = fixture.nativeElement;
    const previousButton = compiled.querySelector('button:first-of-type');
    expect(previousButton.disabled).toBeTrue();
  });

  it('should disable next button on last page', () => {
    component.pageSize = 1;
    component.updatePaginatedData();
    component.nextPage();
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const nextButton = compiled.querySelector('button:last-of-type');
    expect(nextButton.disabled).toBeTrue();
  });
});