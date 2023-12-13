
import { inject, Injectable } from '@angular/core';
import { FilterOptionsRequest } from '../model/filter-options';
import { Subject } from 'rxjs';
import {
  CollectionReference,
  Firestore,
  collection,
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from '@angular/fire/firestore';
import { User } from '@angular/fire/auth';
import { AnalyticsService } from './analytics.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private firestore: Firestore = inject(Firestore);
  private filterSource = new Subject<FilterOptionsRequest>();
  activitiesCollection: CollectionReference;
  filterSource$ = this.filterSource.asObservable();

  constructor(private analyticsService: AnalyticsService) {
    this.activitiesCollection = collection(this.firestore, 'activities');
  }

  updateUser(user: User) {
    const dbUserRef = doc(this.firestore, 'users', user.uid);

    getDoc(dbUserRef)
      .then((doc) => {
        if (doc.exists()) {
          const dbUser = doc.data();
          if (!dbUser['photoURL']) {
            updateDoc(dbUserRef, { photoURL: user.photoURL });
          }
        } else {
          setDoc(dbUserRef, {
            uid: user.uid,
            displayName: user.displayName ?? user.displayName,
            email: user.email ?? user.email,
            photoURL: user.photoURL,
          });
        }
      })
      .catch((error) => {
        console.error('Error setting user ID:', error);
      });
  }
}
