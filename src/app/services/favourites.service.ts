import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, addDoc, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { collection } from '@angular/fire/firestore';
import { User } from '@angular/fire/auth';
import { AuthenticationService } from './authentication.service';
import { Activity } from '../model/activity';

@Injectable({
  providedIn: 'root',
})
export class FavouritesService {
  private firestore: Firestore = inject(Firestore);
  private currentUser: User | null;
  
  favouritesCollection: CollectionReference;

  constructor(private authService: AuthenticationService) {
    this.setupAuthStatusListener();
  }

  private setupAuthStatusListener() {
    // Subscribe to the authStatusSub BehaviorSubject in the AuthenticationService
    this.authService.currentAuthStatus.subscribe((user) => {
      this.currentUser = user;
      // Do something with the user or perform actions when the authentication state changes
      // Update favouritesCollection when the authentication state changes
      const userUid = this.currentUser?.uid;

      this.favouritesCollection = userUid
      ? collection(this.firestore, 'users', userUid, 'favourites')
      : (null as unknown as CollectionReference);
    });
  }

  async isActivityFavorited(activityId: string | null): Promise<boolean> {
    if (this.currentUser && activityId) {
      const queryRef = query(this.favouritesCollection, where('activityId', '==', activityId));
      const querySnapshot = await getDocs(queryRef);
      return !querySnapshot.empty;
    } else {
      console.error('User not logged in or activityId is null');
      return false;
    }
  }

  async getFavouriteActivities() : Promise<Activity[]> {
    if (this.currentUser) {
      const userUid = this.currentUser?.uid;

      if (userUid) {
        const favouritesCollectionRef = collection(this.firestore, 'users', userUid, 'favourites');
        const queryRef = query(favouritesCollectionRef);

        try {
          const querySnapshot = await getDocs(queryRef);

          // Get the activity IDs from the favourite documents
          const activityIds = querySnapshot.docs.map((doc) => doc.get('activityId'));

          // Retrieve detailed information about the activities from the "activities" collection
          const favouriteActivities = await Promise.all(
            activityIds.map(async (activityId) => {
              const activityDocRef = doc(this.firestore, 'activities', activityId);
              const activityDocSnapshot = await getDoc(activityDocRef);

              if (activityDocSnapshot.exists()) {
                return { id: activityId, ...activityDocSnapshot.data() };
              } else {
                console.warn(`Activity with ID ${activityId} not found`);
                return null;
              }
            })
          );

          // Filter out any null values (activities not found)
          const filteredFavouriteActivities = favouriteActivities.filter(
            (activity): activity is Activity => activity !== null
          );

          return filteredFavouriteActivities;
        } catch (error) {
          console.error('Error retrieving favorite activities:', error);
        }
      } else {
        console.error('User UID is null');
      }
    } else {
      console.error('User not logged in');
    }

    return []; // Return an empty array if there is an error or user is not logged in
  }

  async addToFavourites(activityId: string | null) {
    if (this.currentUser) {
      const queryRef = query(this.favouritesCollection, where('activityId', '==', activityId));
      const querySnapshot = await getDocs(queryRef);
    
      console.log(querySnapshot);

      if (querySnapshot.empty) {
        await addDoc(this.favouritesCollection, { activityId: activityId });
      }
    } else {
      console.error('User not logged in');
    }
  }

  async removeFromFavourites(activityId: string | null) {
    if (this.currentUser) {
      const queryRef = query(this.favouritesCollection, where('activityId', '==', activityId));
      const querySnapshot = await getDocs(queryRef);
  
      if (!querySnapshot.empty) {
        // Assuming there's only one matching document; you may need to adjust based on your data model
        const docId = querySnapshot.docs[0].id;
        const docRef = doc(this.favouritesCollection, docId);
        await deleteDoc(docRef);
      }
    } else {
      console.error('User not logged in');
    }
  }
}
