import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../layout.component.scss'],
})
export class RegisterComponent implements OnInit {
  public name: string = '';
  public email: string = '';
  public password: string = '';
  public passwordInputType: string = 'password';
  public passwordSignUpError: boolean = false;
  public passwordSignUpErrorMessage: string = '';
  public isLoading: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
    });
  }

  async signUpWithPassword(): Promise<void> {
    this.passwordSignUpError = false;
    this.isLoading = true;

    try {
      await this.authService.signUpWithPassword(
        this.email,
        this.password,
        this.name
      );
      
      this.router.navigate([`/`]);
    } catch (error: any) {
      console.log(error);
      this.passwordSignUpError = true;
      this.passwordSignUpErrorMessage = error.message;
    } finally {
      this.isLoading = false;
    }
  }
}
