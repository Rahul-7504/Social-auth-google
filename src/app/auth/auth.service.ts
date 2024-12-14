// google-auth.service.ts

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  initGoogleSignIn(clientId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (isPlatformBrowser(this.platformId)) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          try {
            (window as any).google.accounts.id.initialize({
              client_id: clientId,
              callback: (response: any) => this.handleCredentialResponse(response),
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        };
        script.onerror = () => reject('Failed to load Google API script');
        document.head.appendChild(script);
      } else {
        reject('Platform is not browser');
      }
    });
  }

  renderGoogleSignInButton(elementId: string) {
    if (isPlatformBrowser(this.platformId)) {
      (window as any).google.accounts.id.renderButton(
        document.getElementById(elementId),
        { theme: 'outline', size: 'large' }
      );
    }
  }

  handleCredentialResponse(response: any) {
    console.log('Google ID Token:', response.credential);
    const payload = this.decodeJwt(response.credential);

    console.log('User Profile:', payload);
    sessionStorage.setItem('user', JSON.stringify(payload));

    // Show an alert and navigate to the home page
    alert('Login Successful');
    this.router.navigate(['/home']);
  }

  private decodeJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      (window as any).google.accounts.id.disableAutoSelect();
      sessionStorage.removeItem('user');
      console.log('User logged out');
      this.router.navigate(['/login']);
    }
  }
}
