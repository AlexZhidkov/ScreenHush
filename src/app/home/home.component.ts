import { Component, inject } from '@angular/core';
import { Analytics } from '@angular/fire/analytics';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { CollectionReference, Firestore, collection, collectionData, addDoc, DocumentReference, query, limit, orderBy, startAfter, endAt, getDocs, startAt } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ScreenHushService } from '../screen-hush.service';
import { MatChipOption } from '@angular/material/chips';
import { distanceBetween, geohashForLocation, geohashQueryBounds, Geopoint } from 'geofire-common';
import { AutocompleteResult } from '../model/autocomplete-result.model';
import { GeolocationService } from '../services/geolocation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private firestore: Firestore = inject(Firestore);
  private analytics: Analytics = inject(Analytics);
  isLoading = true;
  private auth: Auth = inject(Auth);
  geoLocationError = false;
  user: User | null = null;
  allActivities: any[] = [];
  selectedActivities: any[] = [];
  activitiesCollection: CollectionReference;
  allTags: string[] = [];
  selectedTags: string[] = [];
  filterIsOpen = true;
  selectedTagChips: MatChipOption[] = [];
  geoLocationHash: string | null = null;
  geoLocationState: PermissionState | undefined = undefined;
  center: Geopoint = [0, 0];
  radiusInMeters = 5 * 1000;

  constructor(
    private shService: ScreenHushService,
    private router: Router,
    private geolocationService: GeolocationService
  ) {
    this.allTags = shService.getAllTags();

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.user = user;
      }
    });
    this.activitiesCollection = collection(this.firestore, 'activities');

    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      this.geoLocationState = result.state;
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        this.center = [position.coords.latitude, position.coords.longitude] as Geopoint;
        //this.center = [-34.055209, 151.009268] as Geopoint; // Sydney
        this.loadGeoBoundActivities(this.center, this.radiusInMeters).then(() => {
          this.selectedActivities = this.allActivities;
        });
      });
    } else {
      debugger;
      this.loadFirstActivities();
    }
  }

  // Copied from https://firebase.google.com/docs/firestore/solutions/geoqueries
  async loadGeoBoundActivities(center: Geopoint, radiusInMeters: number) {
    // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
    // a separate query for each pair. There can be up to 9 pairs of bounds
    // depending on overlap, but in most cases there are 4.
    const bounds = geohashQueryBounds(center, radiusInMeters);
    const promises = [];
    for (const b of bounds) {
      const q = query(this.activitiesCollection,
        orderBy('geoHash'), startAt(b[0]), endAt(b[1]));
      promises.push(getDocs(q));
    }

    // Collect all the query results together into a single list
    //const snapshots = await Promise.all(promises);
    Promise.all(promises).then((snapshots) => {
      this.allActivities = [];
      for (const snap of snapshots) {
        for (const doc of snap.docs) {
          const activity = doc.data() as any;
          activity.id = doc.id;
          // We have to filter out a few false positives due to GeoHash
          // accuracy, but most will match
          const distanceInKm = distanceBetween([activity.geoPoint.latitude, activity.geoPoint.longitude], center);
          const distanceInM = distanceInKm * 1000;
          activity.distanceInKm = distanceInKm;
          if (distanceInM <= radiusInMeters) {
            this.allActivities.push(activity);
          }
        }
      }
      this.filterBySelectedTags();
      this.selectedActivities.sort((a, b) => {
        return a.distanceInKm - b.distanceInKm;
      });
      this.isLoading = false;
    });

  }

  loadFirstActivities() {
    const first = query(this.activitiesCollection, orderBy("title"), limit(25));
    collectionData(first, { idField: 'id' })
      .subscribe(data => {
        this.allActivities = data;
        if (this.selectedTags.length === 0) {
          this.selectedActivities = this.allActivities;
        };
        this.isLoading = false;
      });
  }

  createNewActivity() {
    addDoc(this.activitiesCollection, { title: 'New Activity' })
      .then((newActivityReference: DocumentReference) => {
        this.router.navigate([`edit-activity/${newActivityReference.id}`]);
      });
  }

  async applyFilter(selected: MatChipOption | MatChipOption[]) {
    this.selectedTags = (selected as MatChipOption[]).map((option: MatChipOption) => {
      return option.value;
    });
    await this.loadGeoBoundActivities(this.center, this.radiusInMeters);
    this.filterIsOpen = false;
  }

  filterBySelectedTags() {
    if (this.selectedTags.length === 0) {
      this.selectedActivities = this.allActivities;
    } else {
      this.selectedActivities = this.allActivities.filter(activity => {
        if (!activity.tags) {
          return false;
        }
        return activity.tags.some((tag: string) => {
          return this.selectedTags.includes(tag);
        });
      });
    }
  }

  removeSelectedTag(tag: string) {
    this.selectedTags.splice(this.selectedTags.indexOf(tag), 1);
    this.filterBySelectedTags();
  }

  loadMore() {
    this.isLoading = true;
    const last = this.allActivities[this.allActivities.length - 1];
    const next = query(this.activitiesCollection, orderBy("title"), startAfter(last.title), limit(25));
    collectionData(next, { idField: 'id' })
      .subscribe(data => {
        this.allActivities = this.allActivities.concat(data);
        this.filterBySelectedTags();
        this.isLoading = false;
      });
  }

  onLocationSelected(suggestion: AutocompleteResult) {
    this.geolocationService
      .getGeoLocation(suggestion.placeId)
      .then((geoLocations) => {
        const locationResult = geoLocations[0]
        this.center = [
          locationResult.latitude,
          locationResult.longitude,
        ] as Geopoint;
      })
      .catch((error) => {
        this.geoLocationError = true;
      });
  }
}