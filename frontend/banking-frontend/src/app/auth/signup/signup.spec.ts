import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, Subject } from 'rxjs';

import { SignupComponent } from './signup';
import { AuthService } from '../../services/auth.service';

// Mock AuthService to isolate the component's behavior
class MockAuthService {
  loading$ = of(false);
  error$ = of(null);
  // CORRECTED: Use a Subject to allow for `.next()` calls
  isAuthenticated$ = new Subject<boolean>(); 
  
  clearError = jasmine.createSpy('clearError');
  signup = jasmine.createSpy('signup');
}

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authService: MockAuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SignupComponent, // Standalone component import
        ReactiveFormsModule,
        CommonModule
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router);
    
    // Set an initial value for isAuthenticated$ to simulate the initial state
    authService.isAuthenticated$.next(false);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the signup form with name, email, password, and confirmPassword controls', () => {
    expect(component.signupForm).toBeDefined();
    expect(component.signupForm.get('name')).toBeDefined();
    expect(component.signupForm.get('email')).toBeDefined();
    expect(component.signupForm.get('password')).toBeDefined();
    expect(component.signupForm.get('confirmPassword')).toBeDefined();
  });

  it('should navigate to dashboard if the user is already authenticated', () => {
    authService.isAuthenticated$.next(true);
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should mark form controls as touched on invalid submission', () => {
    component.onSubmit();
    expect(component.name?.touched).toBeTrue();
    expect(component.email?.touched).toBeTrue();
    expect(component.password?.touched).toBeTrue();
    expect(component.confirmPassword?.touched).toBeTrue();
  });

  it('should call authService.signup() with correct data on valid form submission', () => {
    const testData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    };
    component.signupForm.patchValue(testData);
    component.onSubmit();
    
    // De-structure the form value to exclude confirmPassword before checking
    const { confirmPassword, ...signupData } = testData;
    expect(authService.signup).toHaveBeenCalledWith(signupData);
    expect(authService.clearError).toHaveBeenCalled();
  });

  it('should navigate to login page when navigateToLogin is called', () => {
    component.navigateToLogin();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show password mismatch error when passwords do not match', () => {
    component.signupForm.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password456'
    });
    component.confirmPassword?.markAsTouched();
    fixture.detectChanges();

    expect(component.confirmPassword?.hasError('passwordMismatch')).toBeTrue();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('div.text-red-600')?.textContent).toContain('Passwords do not match');
  });

  it('should show name required validation error', () => {
    const nameControl = component.name;
    nameControl?.setValue('');
    nameControl?.markAsTouched();
    fixture.detectChanges();
    
    expect(nameControl?.hasError('required')).toBeTrue();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('div.text-red-600')?.textContent).toContain('Name is required');
  });
});