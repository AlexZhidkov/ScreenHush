import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, arrayUnion, arrayRemove, updateDoc, DocumentReference, DocumentData } from '@angular/fire/firestore';
import { User } from '@angular/fire/auth';
import { AuthenticationService } from './authentication.service';
import { Activity } from '../model/activity';

@Injectable({
  providedIn: 'root',
})
export class FavouritesService {
  private firestore: Firestore = inject(Firestore);
  private currentUser: User | null;
  private userDocRef: DocumentReference<DocumentData>;

  constructor(private authService: AuthenticationService) {
    this.setupAuthStatusListener();
  }

  private setupAuthStatusListener() {
    // Subscribe to the authStatusSub BehaviorSubject in the AuthenticationService
    this.authService.currentAuthStatus.subscribe((user) => {
      this.currentUser = user;

      if (user) {
        this.userDocRef = doc(this.firestore, 'users', user.uid);
      }
    });
    
  }

  async isActivityFavorited(activityId: string | null): Promise<boolean> {
    if (!this.currentUser && !activityId) {
      throw new Error('User not logged in or activityId is null');
    }

    const userDocSnapshot = await getDoc(this.userDocRef);
    const favorites = userDocSnapshot.get('favorites') || [];
    return favorites.includes(activityId);
  }
  

  async getFavouriteActivities(): Promise<Activity[]> {
    if (!this.currentUser) {
      console.error('User not logged in');
      return [];
    }

    const userDocSnapshot = await getDoc(this.userDocRef);
    const favorites = userDocSnapshot.get('favorites') || [];

    // Retrieve detailed information about the activities from the "activities" collection
    const favouriteActivities = await Promise.all(
      favorites.map(async (activityId: string) => {
        const activityDocRef = doc(this.firestore, 'activities', activityId);
        const activityDocSnapshot = await getDoc(activityDocRef);

        if (activityDocSnapshot.exists()) {
          return { id: activityId, ...activityDocSnapshot.data() };
        } else {
          console.warn(`Activity with ID ${activityId} not found, removing`);
          this.removeFromFavourites(activityId);
          return null;
        }
      })
    );

    // Filter out any null values (activities not found)
    const filteredFavouriteActivities = favouriteActivities.filter(
      (activity): activity is Activity => activity !== null
    );

    return filteredFavouriteActivities;
  }

  async addToFavourites(activityId: string | null) {
    if (!this.userDocRef) {
      throw new Error('User not logged in or activityId is null');
    }
    
    await setDoc(this.userDocRef, { favorites: arrayUnion(activityId) }, { merge: true });
  }

  async removeFromFavourites(activityId: string | null) {
    if (!this.userDocRef) {
      throw new Error('User not logged in or activityId is null');
    }

    await setDoc(this.userDocRef, { favorites: arrayRemove(activityId) }, { merge: true });
  }
}
