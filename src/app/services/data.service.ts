import { inject, Injectable, Injector } from '@angular/core';
import { FilterOptionsRequest } from '../model/filter-options';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import { HomeSection } from '../model/home-activity-model';
import { distanceBetween, geohashQueryBounds, Geopoint } from 'geofire-common';
import {
  CollectionReference,
  Firestore,
  collection,
  query,
  orderBy,
  endAt,
  getDocs,
  startAt,
  docData,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  setDoc,
  DocumentReference,
  DocumentData,
  deleteDoc,
} from '@angular/fire/firestore';
import { Functions, httpsCallableData } from '@angular/fire/functions';
import { Activity } from '../model/activity';
import { User } from '@angular/fire/auth';
import { AnalyticsService } from './analytics.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private firestore: Firestore = inject(Firestore);
  private functions: Functions = inject(Functions);
  private filterSource = new Subject<FilterOptionsRequest>();
  activitiesCollection: CollectionReference;
  filterSource$ = this.filterSource.asObservable();

  constructor(private analyticsService: AnalyticsService) {
    this.activitiesCollection = collection(this.firestore, 'activities');
  }

  private filterActivitiesByTags(
    activities: Activity[],
    tagsToInclude: string[]
  ) {
    return activities.filter((activity) => {
      if (!activity.tags) {
        return false;
      }
      return activity.tags.some((tag) => tagsToInclude.includes(tag));
    });
  }

  private async getActivitiesByGeopointAndRadius(
    center: Geopoint,
    radiusInMeters: number
  ) {
    // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
    // a separate query for each pair. There can be up to 9 pairs of bounds
    // depending on overlap, but in most cases there are 4.
    const bounds = geohashQueryBounds(center, radiusInMeters);
    const promises = [];
    for (const b of bounds) {
      const q = query(
        this.activitiesCollection,
        orderBy('geoHash'),
        startAt(b[0]),
        endAt(b[1])
      );
      promises.push(getDocs(q));
    }

    // Collect all the query results together into a single list
    //const snapshots = await Promise.all(promises);
    return Promise.all(promises).then((snapshots) => {
      let allActivities = [];
      for (const snap of snapshots) {
        for (const doc of snap.docs) {
          const activity = doc.data() as any;
          activity.id = doc.id;
          // We have to filter out a few false positives due to GeoHash
          // accuracy, but most will match
          const distanceInKm = distanceBetween(
            [activity.geoPoint.latitude, activity.geoPoint.longitude],
            center
          );
          const distanceInM = distanceInKm * 1000;
          activity.distanceInKm = distanceInKm;
          if (distanceInM <= radiusInMeters) {
            allActivities.push(activity);
          }
        }
      }

      return allActivities.sort((a, b) => {
        return a.distanceInKm - b.distanceInKm;
      });
    });
  }

  async getGeoActivitiesBySection(center: Geopoint): Promise<HomeSection[]> {
    let activities = await this.getActivitiesByGeopointAndRadius(center, 5000);
    let greenTimeActivities = this.filterActivitiesByTags(activities, [
      'park',
      'playground',
    ]);
    let cultureActivities = this.filterActivitiesByTags(activities, [
      'museum',
      'art_gallery',
      'church',
    ]);
    let healthActivities = this.filterActivitiesByTags(activities, [
      'gym',
      'health',
    ]);

    const homeModel: HomeSection[] = [
      {
        category: 'Greentime',
        tags: ['Parks, Playgrounds, Reserves, Campgrounds'],
        items: greenTimeActivities,
      },
      {
        category: 'Get Your Culture On',
        tags: ['Museums, Historical Tours, Art Galleries'],
        items: cultureActivities,
      },
      {
        category: 'Feeling Sporty',
        tags: ['Gyms, health'],
        items: healthActivities,
      },
    ];

    return homeModel;
  }

  async search(query: string): Promise<HomeSection[]> {
    const promises: any[] = [];
    const search = httpsCallableData(this.functions, 'ext-firestore-semantic-search-queryIndex');
    const searchData = await firstValueFrom(search({ "query": [query] })) as any;
    searchData.data.nearestNeighbors.forEach((nearestNeighbor: any) => {
      nearestNeighbor.neighbors.forEach((neighbor: any) => {
        promises.push(getDoc(doc(this.firestore, 'activities', neighbor.datapoint.datapointId)));
      });
    });

    var foundActivities = await Promise.all(promises).then((snapshots) => {
      let allActivities = [];
      for (const doc of snapshots) {
        const activity = doc.data() as any;
        activity.id = doc.id;
        allActivities.push(activity);
      }
      return allActivities;
    });

    const homeModel: HomeSection[] = [
      {
        category: 'Search',
        tags: [],
        items: foundActivities,
      }
    ];

    return homeModel;
  }

  getActivityById(activityId: string): Observable<any> {
    const activityDocRef = doc(this.firestore, 'activities', activityId);
    return docData(activityDocRef, { idField: 'id' }) as Observable<any>;
  }

  getActivityDoc(activityId: string): DocumentReference<DocumentData> {
    return doc(this.firestore, 'activities', activityId);
  }

  async deleteActivity(activityId: string, userId: string | undefined, activityRef: DocumentReference<DocumentData>): Promise<void> {
    try {
      await deleteDoc(activityRef);
      this.analyticsService.logEvent('delete_activity', { uid: userId, activityId: activityId });
      console.log('Activity deleted successfully');
      // You can add additional logic here if needed.
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  }

  updateActivity(activityDoc: DocumentReference<DocumentData>, data: DocumentData) {
    updateDoc(activityDoc as DocumentReference<DocumentData>, data)
  }

  createNewActivity() {
    return addDoc(this.activitiesCollection, { title: 'New Activity' });
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
