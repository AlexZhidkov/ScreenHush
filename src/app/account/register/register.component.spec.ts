import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthenticationService } from '../../services/authentication.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input'; 

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['signUpWithPassword']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { queryParams: of({ email: 'test@example.com' }) } },
      ],
      imports: [FormsModule, RouterTestingModule, MatIconModule, MatInputModule ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should sign up with password', fakeAsync(() => {
    authServiceSpy.signUpWithPassword.and.returnValue(Promise.resolve({} as any));

    component.email = 'test@example.com';
    component.password = 'password123';
    component.name = 'John Doe';

    component.signUpWithPassword();
    tick();
    fixture.detectChanges();

    expect(authServiceSpy.signUpWithPassword).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
      'John Doe'
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    // Add expectations for any other side effects or UI changes
  }));

  it('should handle sign up error', fakeAsync(() => {
    const errorMessage = 'An error occurred';
    authServiceSpy.signUpWithPassword.and.returnValue(Promise.reject({ message: errorMessage } as any));

    component.email = 'test@example.com';
    component.password = 'password123';
    component.name = 'John Doe';

    component.signUpWithPassword();
    tick();
    fixture.detectChanges();

    expect(authServiceSpy.signUpWithPassword).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
      'John Doe'
    );
    expect(component.passwordSignUpError).toBeTrue();
    expect(component.passwordSignUpErrorMessage).toBe(errorMessage);
  }));
});
