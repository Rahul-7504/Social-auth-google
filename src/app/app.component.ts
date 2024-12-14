import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoogleAuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'demo';

  private clientId = '355293463076-a40e9trj33sdu9o72f8emcenfqh4j47e.apps.googleusercontent.com'; // Replace with your Google Client ID
 
  user: any = null;


  constructor(private googleAuthService: GoogleAuthService) {}

  ngOnInit() {
    this.googleAuthService.initGoogleSignIn(this.clientId)
      .then(() => this.googleAuthService.renderGoogleSignInButton('google-signin-button'))
      .catch((error) => console.error('Google Sign-In initialization failed:', error));

    // Retrieve user from session storage
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }

  logout() {
    this.googleAuthService.logout();
    this.user = null;
  }
}
