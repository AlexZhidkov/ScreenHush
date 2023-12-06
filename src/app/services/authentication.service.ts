import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
} from '@angular/fire/auth';
import { DataService } from './data.service';
import { AnalyticsService } from './analytics.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private auth: Auth = inject(Auth);

  constructor(private analyticsService: AnalyticsService, private dataService: DataService) {}

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  onAuthStateChanged(callback: (user: User | null) => void): void {
    onAuthStateChanged(this.auth, callback);
  }

  async signUpWithPassword(
    email: string,
    password: string,
    name: string
  ): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;
      this.onSuccess(userCredential.user);
      return await updateProfile(user, { displayName: name });
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  async signInWithPassword(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  async signInWithProvider(
    providerName: 'google' | 'facebook' | 'microsoft' | 'apple'
  ): Promise<User> {
    let provider;
    switch (providerName) {
      case 'google':
        provider = new GoogleAuthProvider();
        break;
      case 'facebook':
        provider = new FacebookAuthProvider();
        break;
      case 'microsoft':
        provider = new OAuthProvider('microsoft.com');
        break;
      case 'apple':
        provider = new OAuthProvider('apple');
        break;
      default:
        throw new Error('Invalid provider');
    }

    try {
      const result = await signInWithPopup(this.auth, provider);
      this.onSuccess(result.user);
      return result.user;
    } catch (error) {
      console.error('Error signing in with provider:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (e) {
      // An error happened.
      console.error('An error happened while signing out!', e);
    }
  }

  onSuccess(user: User): void {
    try {
      this.analyticsService.setUserId(user.uid);
      this.analyticsService.logEvent('login', {
        uid: user.uid,
        providerId: user.providerData[0].providerId,
      });

      this.dataService.updateUser(user);
    } catch (error) {
      console.error('Error setting user ID:', error);
      throw error;
    }
  }

  resetPassword(email: string): Promise<void> {
    const message = 'Password reset email sent. Check your inbox.';
    console.log(message);
    // You may want to handle this differently based on your application needs.
    // For simplicity, I'm logging the message to the console.
    return sendPasswordResetEmail(this.auth, email);
  }
}
