import { inject, Injectable } from '@angular/core';
import { FilterOptionsRequest } from '../model/filter-options';
import { Subject } from 'rxjs';
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
} from '@angular/fire/firestore';
import { Activity } from '../model/activity';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private firestore: Firestore = inject(Firestore);
  private filterSource = new Subject<FilterOptionsRequest>();
  activitiesCollection: CollectionReference;
  filterSource$ = this.filterSource.asObservable();

  constructor() {
    this.activitiesCollection = collection(this.firestore, 'activities');
  }

  private filterActivitiesByTags(activities : Activity[], tagsToInclude: string[]) {
    return activities.filter(activity => {
      if (!activity.tags) {
        return false;
      }
      return activity.tags.some(tag => tagsToInclude.includes(tag));
    });
  }

  async getData(center: Geopoint): Promise<HomeSection[]> {
    console.log("getting data");
    let activities = await this.loadGeoBoundActivities(center, 5000);
    console.log("activities I got back");
    console.log(activities);

    let greenTimeActivities = this.filterActivitiesByTags(activities, ['park', 'playground']);
    let cultureActivities = this.filterActivitiesByTags(activities, ['museum', 'art_gallery', 'church']);
    let healthActivities = this.filterActivitiesByTags(activities, ['gym', 'health']);

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

  updateData(request: FilterOptionsRequest) {
    this.filterSource.next(request);
  }
  
  async loadGeoBoundActivities(center: Geopoint, radiusInMeters: number) {
    console.log("Getting activities");
    console.log(center);
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
}
