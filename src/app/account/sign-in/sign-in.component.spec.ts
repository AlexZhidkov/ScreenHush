import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SignInComponent } from './sign-in.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['signInWithProvider', 'signInWithPassword']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      declarations: [SignInComponent],
      providers: [
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: ActivatedRoute, useValue: { queryParams: of({ usePassword: true }) } },
      ],
      imports: [FormsModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should sign in with provider', fakeAsync(() => {
    const providerName = 'google';
    authServiceSpy.signInWithProvider.and.returnValue(Promise.resolve({} as any));

    component.signInWithProvider(providerName);

    tick(); // Resolve the promise
    fixture.detectChanges();

    expect(authServiceSpy.signInWithProvider).toHaveBeenCalledWith(providerName);
    // Add expectations for any other side effects or UI changes
  }));

  it('should handle sign in with password', fakeAsync(() => {
    authServiceSpy.signInWithPassword.and.returnValue(Promise.resolve({} as any));

    component.signInWithPassword();
    tick(); // Resolve the promise
    fixture.detectChanges();

    expect(authServiceSpy.signInWithPassword).toHaveBeenCalledWith(component.email, component.password);
    expect(routerSpy.navigate).toHaveBeenCalled();
    // Add expectations for any other side effects or UI changes
  }));
});
