// login.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, BehaviorSubject } from 'rxjs';
import { LoginComponent } from './login';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockStore: jasmine.SpyObj<Store>;
  let errorSubject: BehaviorSubject<string | null>;
  let loadingSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    // Create mock subjects for observables
    errorSubject = new BehaviorSubject<string | null>(null);
    loadingSubject = new BehaviorSubject<boolean>(false);

    // Create spy objects for dependencies
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockStore = jasmine.createSpyObj('Store', ['dispatch', 'select']);

    // Configure mock store to return our subjects
    mockStore.select.and.returnValue(errorSubject.asObservable());

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Router, useValue: mockRouter },
        { provide: Store, useValue: mockStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    // Mock the observables
    component.error$ = errorSubject.asObservable();
    component.loading$ = loadingSubject.asObservable();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should mark form as invalid when fields are empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should validate email field correctly', () => {
    const emailControl = component.loginForm.get('email');

    // Test required validation
    emailControl?.setValue('');
    emailControl?.markAsTouched();
    expect(emailControl?.errors?.['required']).toBeTruthy();

    // Test email format validation
    emailControl?.setValue('invalid-email');
    expect(emailControl?.errors?.['email']).toBeTruthy();

    // Test valid email
    emailControl?.setValue('test@example.com');
    expect(emailControl?.errors).toBeNull();
  });

  it('should validate password field correctly', () => {
    const passwordControl = component.loginForm.get('password');

    // Test required validation
    passwordControl?.setValue('');
    passwordControl?.markAsTouched();
    expect(passwordControl?.errors?.['required']).toBeTruthy();

    // Test minimum length validation
    passwordControl?.setValue('12345');
    expect(passwordControl?.errors?.['minlength']).toBeTruthy();

    // Test valid password
    passwordControl?.setValue('123456');
    expect(passwordControl?.errors).toBeNull();
  });

  it('should display error message when error$ has value', () => {
    const errorMessage = 'Invalid credentials';
    errorSubject.next(errorMessage);
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('.text-red-700');
    expect(errorElement?.textContent.trim()).toBe(errorMessage);
  });

  it('should not display error message when error$ is null', () => {
    errorSubject.next(null);
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('.bg-red-50');
    expect(errorElement).toBeFalsy();
  });

  it('should display loading state correctly', () => {
    loadingSubject.next(true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.textContent.trim()).toContain('Signing in...');
    expect(button.disabled).toBeTruthy();
  });

  it('should display normal state when not loading', () => {
    loadingSubject.next(false);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.textContent.trim()).toContain('Sign in');
    expect(button.disabled).toBeFalsy();
  });

  it('should call onSubmit when form is submitted', () => {
    spyOn(component, 'onSubmit');

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should not dispatch action when form is invalid', () => {
    component.loginForm.patchValue({
      email: '',
      password: ''
    });

    component.onSubmit();

    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch login action when form is valid', () => {
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: '123456'
    });

    spyOn(component, 'onSubmit').and.callThrough();

    component.onSubmit();

    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('should navigate to signup when navigateToSignup is called', () => {
    component.navigateToSignup();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/signup']);
  });

  it('should show field errors when fields are touched and invalid', () => {
    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');

    // Touch the fields and trigger validation
    emailControl?.markAsTouched();
    passwordControl?.markAsTouched();
    fixture.detectChanges();

    const emailError = fixture.nativeElement.querySelector('input[name="email"] + div');
    const passwordError = fixture.nativeElement.querySelector('input[name="password"] + div');

    expect(emailError?.textContent).toContain('Email is required');
    expect(passwordError?.textContent).toContain('Password is required');
  });

  it('should apply error styling when field is invalid and touched', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.markAsTouched();
    fixture.detectChanges();

    const emailInput = fixture.nativeElement.querySelector('input[name="email"]');
    expect(emailInput.classList).toContain('border-red-500');
  });
});