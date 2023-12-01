import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './reset-password.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { of } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['resetPassword']);

    TestBed.configureTestingModule({
      declarations: [ResetPasswordComponent],
      providers: [
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: MatSnackBar, useValue: {} },
      ],
      imports: [FormsModule, MatInputModule, MatButtonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
  });

  it('should reset password successfully', fakeAsync(() => {
    authServiceSpy.resetPassword.and.returnValue(Promise.resolve());

    component.email = 'test@example.com';
    component.resetPassword();
    tick();
    fixture.detectChanges();

    expect(authServiceSpy.resetPassword).toHaveBeenCalledWith('test@example.com');
  }));

  it('should handle reset password error', fakeAsync(() => {
    authServiceSpy.resetPassword.and.returnValue(Promise.reject(new Error('An error occurred')));

    component.email = 'test@example.com';
    component.resetPassword();
    tick();
    fixture.detectChanges();

    expect(authServiceSpy.resetPassword).toHaveBeenCalledWith('test@example.com');
  }));
});
