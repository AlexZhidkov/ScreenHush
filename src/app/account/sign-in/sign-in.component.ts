import { Component, OnInit } from '@angular/core';
import {
  User,
} from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './sign-in.component.html',
  styleUrls: ['../layout.component.scss'],
})
export class SignInComponent implements OnInit{
  public name: string = '';
  public email: string = '';
  public password: string = '';
  public passwordInputType: string = 'password';
  public usePassword: boolean = false;
  public passwordSignInError: boolean = false;
  public passwordSignInErrorMessage: string = '';
  public isLoading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.usePassword = params['usePassword'];
    });
  }

  async signInWithProvider(providerName: 'google' | 'facebook' | 'microsoft' | 'apple'): Promise<void> {
    try {
      const user = await this.authService.signInWithProvider(providerName);
      this.onSuccess(user);
    } catch (error: any) {
      console.log(error);
      // ToDo: Show error message in toast
    }
  }

  async signInWithPassword(): Promise<void> {
    this.passwordSignInError = false;
    this.passwordSignInErrorMessage = '';
    this.isLoading = true;

    try {
      const user = await this.authService.signInWithPassword(this.email, this.password);
      this.onSuccess(user);
    } catch (error: any) {
      console.log(error);
      this.passwordSignInError = true;
      this.passwordSignInErrorMessage = error.message;

      // ToDo: Show error message in toast
      this.snackBar.open(error.message, 'OK', {
        duration: 5000,
      });
    } finally {
      this.isLoading = false;
    }
  }

  onSuccess(user: User): void {
    this.route.queryParams.subscribe((params: { [x: string]: any }) => {
      const redirectUrl = params['redirectUrl'];
      if (redirectUrl) {
        this.router.navigate([`${redirectUrl}`]);
      } else {
        this.router.navigate([`/`]);
      }
    });
  }
}
