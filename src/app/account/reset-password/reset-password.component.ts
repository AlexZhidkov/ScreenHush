import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../layout.component.scss']
})
export class ResetPasswordComponent {
  public email: string = '';
  public resetPasswordError: boolean = false;
  public resetPasswordErrorMessage: string = '';

  constructor(private authService: AuthenticationService,) {}

  async resetPassword(): Promise<void> {
    const message = 'Password reset email sent. Check your inbox.';
    console.log(message);
    try {
      await this.authService.resetPassword(this.email);
    } catch (error: any) {
      this.resetPasswordError = true;
      this.resetPasswordErrorMessage = error.message;
      console.error('Error resetting password:', error);
    }
  }
}
