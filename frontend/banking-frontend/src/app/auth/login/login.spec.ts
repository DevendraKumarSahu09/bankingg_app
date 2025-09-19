import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, Subject } from 'rxjs';

import { LoginComponent } from './login';
import { AuthService } from '../../services/auth.service';

class MockAuthService {
  loading$ = of(false);
  error$ = of(null);
  // CORRECTED: Use a Subject to allow for `.next()` calls
  isAuthenticated$ = new Subject<boolean>(); 
  
  clearError = jasmine.createSpy('clearError');
  login = jasmine.createSpy('login');
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: MockAuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent, // Standalone component import
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
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    // Cast the injected service to our Mock class type
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router);
    
    // Set an initial value for isAuthenticated$ to simulate the initial state
    authService.isAuthenticated$.next(false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form with email and password controls', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')).toBeDefined();
    expect(component.loginForm.get('password')).toBeDefined();
  });

  it('should navigate to dashboard if the user is already authenticated', () => {
    // Correctly simulate an authenticated state
    authService.isAuthenticated$.next(true);
    fixture.detectChanges(); 
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should mark form controls as touched on invalid submission', () => {
    component.onSubmit();
    expect(component.email?.touched).toBeTrue();
    expect(component.password?.touched).toBeTrue();
  });

  it('should call authService.login() with correct credentials on valid form submission', () => {
    const testCredentials = { email: 'test@example.com', password: 'password123' };
    component.loginForm.patchValue(testCredentials);
    component.onSubmit();
    
    expect(authService.login).toHaveBeenCalledWith(testCredentials);
    expect(authService.clearError).toHaveBeenCalled();
  });

  it('should navigate to signup page when navigateToSignup is called', () => {
    component.navigateToSignup();
    expect(router.navigate).toHaveBeenCalledWith(['/signup']);
  });

  it('should show email required validation error', () => {
    const emailControl = component.email;
    emailControl?.setValue('');
    emailControl?.markAsTouched();
    fixture.detectChanges();
    
    expect(emailControl?.hasError('required')).toBeTrue();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('div.text-red-600')?.textContent).toContain('Email is required');
  });

  it('should show invalid email validation error', () => {
    const emailControl = component.email;
    emailControl?.setValue('invalid-email');
    emailControl?.markAsTouched();
    fixture.detectChanges();
    
    expect(emailControl?.hasError('email')).toBeTrue();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('div.text-red-600')?.textContent).toContain('Please enter a valid email');
  });

  it('should show password required validation error', () => {
    const passwordControl = component.password;
    passwordControl?.setValue('');
    passwordControl?.markAsTouched();
    fixture.detectChanges();
    
    expect(passwordControl?.hasError('required')).toBeTrue();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('div.text-red-600')?.textContent).toContain('Password is required');
  });

  it('should show password minimum length validation error', () => {
    const passwordControl = component.password;
    passwordControl?.setValue('12345');
    passwordControl?.markAsTouched();
    fixture.detectChanges();
    
    expect(passwordControl?.hasError('minlength')).toBeTrue();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('div.text-red-600')?.textContent).toContain('Password must be at least 6 characters');
  });
});