import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ScreenHush';

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.authService.onAuthStateChanged((user) => {
      if (!user) {
        this.router.navigate(['/account']);
      }
    });
  }

  showFilterButtons() {
    return this.router.url === "/";
  }
}
