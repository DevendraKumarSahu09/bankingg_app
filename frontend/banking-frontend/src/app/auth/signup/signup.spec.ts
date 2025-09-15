// signup.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, BehaviorSubject } from 'rxjs';
import { SignupComponent } from './signup';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
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
      declarations: [SignupComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Router, useValue: mockRouter },
        { provide: Store, useValue: mockStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
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
    expect(component.signupForm.get('name')?.value).toBe('');
    expect(component.signupForm.get('email')?.value).toBe('');
    expect(component.signupForm.get('password')?.value).toBe('');
    expect(component.signupForm.get('confirmPassword')?.value).toBe('');
  });

  it('should mark form as invalid when fields are empty', () => {
    expect(component.signupForm.valid).toBeFalsy();
  });

  it('should validate name field correctly', () => {
    const nameControl = component.signupForm.get('name');

    // Test required validation
    nameControl?.setValue('');
    nameControl?.markAsTouched();
    expect(nameControl?.errors?.['required']).toBeTruthy();

    // Test minimum length validation
    nameControl?.setValue('ab');
    expect(nameControl?.errors?.['minlength']).toBeTruthy();

    // Test valid name
    nameControl?.setValue('John Doe');
    expect(nameControl?.errors).toBeNull();
  });

  it('should validate email field correctly', () => {
    const emailControl = component.signupForm.get('email');

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
    const passwordControl = component.signupForm.get('password');

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

  it('should validate confirm password field correctly', () => {
    const passwordControl = component.signupForm.get('password');
    const confirmPasswordControl = component.signupForm.get('confirmPassword');

    // Set password first
    passwordControl?.setValue('123456');

    // Test required validation
    confirmPasswordControl?.setValue('');
    confirmPasswordControl?.markAsTouched();
    expect(confirmPasswordControl?.errors?.['required']).toBeTruthy();

    // Test password mismatch
    confirmPasswordControl?.setValue('different');
    expect(confirmPasswordControl?.errors?.['passwordMismatch']).toBeTruthy();

    // Test matching passwords
    confirmPasswordControl?.setValue('123456');
    expect(confirmPasswordControl?.errors).toBeNull();
  });

  it('should display error message when error$ has value', () => {
    const errorMessage = 'Email already exists';
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
    expect(button.textContent.trim()).toContain('Creating account...');
    expect(button.disabled).toBeTruthy();
  });

  it('should display normal state when not loading', () => {
    loadingSubject.next(false);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.textContent.trim()).toContain('Create account');
    expect(button.disabled).toBeFalsy();
  });

  it('should call onSubmit when form is submitted', () => {
    spyOn(component, 'onSubmit');

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should not dispatch action when form is invalid', () => {
    component.signupForm.patchValue({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });

    component.onSubmit();

    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch signup action when form is valid', () => {
    component.signupForm.patchValue({
      name: 'John Doe',
      email: 'test@example.com',
      password: '123456',
      confirmPassword: '123456'
    });

    spyOn(component, 'onSubmit').and.callThrough();

    component.onSubmit();

    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('should navigate to login when navigateToLogin is called', () => {
    component.navigateToLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show field errors when fields are touched and invalid', () => {
    const nameControl = component.signupForm.get('name');
    const emailControl = component.signupForm.get('email');
    const passwordControl = component.signupForm.get('password');
    const confirmPasswordControl = component.signupForm.get('confirmPassword');

    // Touch the fields and trigger validation
    nameControl?.markAsTouched();
    emailControl?.markAsTouched();
    passwordControl?.markAsTouched();
    confirmPasswordControl?.markAsTouched();
    fixture.detectChanges();

    const nameError = fixture.nativeElement.querySelector('input[name="name"] + div');
    const emailError = fixture.nativeElement.querySelector('input[name="email"] + div');
    const passwordError = fixture.nativeElement.querySelector('input[name="password"] + div');
    const confirmPasswordError = fixture.nativeElement.querySelector('input[name="confirmPassword"] + div');

    expect(nameError?.textContent).toContain('Name is required');
    expect(emailError?.textContent).toContain('Email is required');
    expect(passwordError?.textContent).toContain('Password is required');
    expect(confirmPasswordError?.textContent).toContain('Please confirm your password');
  });

  it('should apply error styling when field is invalid and touched', () => {
    const nameControl = component.signupForm.get('name');
    nameControl?.markAsTouched();
    fixture.detectChanges();

    const nameInput = fixture.nativeElement.querySelector('input[name="name"]');
    expect(nameInput.classList).toContain('border-red-500');
  });

  it('should validate password match correctly', () => {
    // Set different passwords
    component.signupForm.patchValue({
      password: '123456',
      confirmPassword: 'different'
    });

    const confirmPasswordControl = component.signupForm.get('confirmPassword');
    confirmPasswordControl?.markAsTouched();
    fixture.detectChanges();

    expect(confirmPasswordControl?.errors?.['passwordMismatch']).toBeTruthy();

    const errorDiv = fixture.nativeElement.querySelector('input[name="confirmPassword"] + div');
    expect(errorDiv?.textContent).toContain('Passwords do not match');
  });
});