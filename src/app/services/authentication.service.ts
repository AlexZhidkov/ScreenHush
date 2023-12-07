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
import { AnalyticsService } from './analytics.service';
import { UsersService } from './users.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  currentUser: User | null = null;
  private auth: Auth = inject(Auth);

  private authStatusSub = new BehaviorSubject(this.currentUser);
  currentAuthStatus = this.authStatusSub.asObservable();
  
  constructor(
    private analyticsService: AnalyticsService,
    private usersService: UsersService
  ) {
    this.authStatusListener();
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  onAuthStateChanged(callback: (user: User | null) => void): void {
    onAuthStateChanged(this.auth, callback);
  }

  authStatusListener() {
    this.auth.onAuthStateChanged((credential) => {
      if (credential) {
        console.log(credential);
        this.authStatusSub.next(credential);
        console.log('User is logged in');
      } else {
        this.authStatusSub.next(null);
        console.log('User is logged out');
      }
    });
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
      console.log("attempting signout");
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

      this.usersService.updateUser(user);
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
