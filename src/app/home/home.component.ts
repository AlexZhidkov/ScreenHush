import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ScreenHushService } from '../screen-hush.service';
import { MatChipOption } from '@angular/material/chips';
import {
  Geopoint,
} from 'geofire-common';
import { FilterService } from '../services/filter.service';
import { Subscription } from 'rxjs';
import { HomeService } from '../services/home.service';
import { HomeSection } from '../model/home-activity-model';
import { DragScrollComponent } from 'ngx-drag-scroll';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnDestroy {
  @ViewChild('nav', { read: DragScrollComponent }) ds: DragScrollComponent;

  isLoading = true;
  geoLocationError = false;
  user: User | null = null;
  allActivities: any[] = [];
  selectedActivities: any[] = [];
  homeSection: HomeSection[] = [];
  allTags: string[] = [];
  selectedTags: string[] = [];
  filterIsOpen = true;
  selectedTagChips: MatChipOption[] = [];
  geoLocationHash: string | null = null;
  geoLocationState: PermissionState | undefined = undefined;
  center: Geopoint = [0, 0];
  radiusInMeters = 5 * 1000;
  subscription: Subscription;
  scrollInterval: any;

  constructor(
    private shService: ScreenHushService,
    private filterService: FilterService,
    private homeService: HomeService,
    private router: Router
  ) {
    this.allTags = shService.getAllTags();

    this.subscription = filterService.filterSource$.subscribe((filter) => {
      if (filter.UseCurrentLocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          console.log(position);
          this.center = [
            position.coords.latitude,
            position.coords.longitude,
          ] as Geopoint;

          homeService.getData(this.center).then((x) => {
            this.homeSection = x;
          });
        });
      } else {
        this.center = filter.Location ? filter.Location : [0, 0];
      }
    });

    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      this.geoLocationState = result.state;
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        this.center = [
          position.coords.latitude,
          position.coords.longitude,
        ] as Geopoint;

        homeService.getData(this.center).then((x) => {
          this.homeSection = x;
        });
      });
    }
  }

  ngAfterViewInit() {
    this.scrollInterval = setInterval(() => {
      console.log('init!');
      this.ds.moveRight();
    }, 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.scrollInterval);
  }

  // loadFirstActivities() {
  //   const first = query(this.activitiesCollection, orderBy('title'), limit(25));
  //   collectionData(first, { idField: 'id' }).subscribe((data) => {
  //     this.allActivities = data;
  //     if (this.selectedTags.length === 0) {
  //       this.selectedActivities = this.allActivities;
  //     }
  //     this.isLoading = false;
  //   });
  // }

  // createNewActivity() {
  //   addDoc(this.activitiesCollection, { title: 'New Activity' }).then(
  //     (newActivityReference: DocumentReference) => {
  //       this.router.navigate([`edit-activity/${newActivityReference.id}`]);
  //     }
  //   );
  // }

  // filterBySelectedTags() {
  //   if (this.selectedTags.length === 0) {
  //     this.selectedActivities = this.allActivities;
  //   } else {
  //     this.selectedActivities = this.allActivities.filter((activity) => {
  //       if (!activity.tags) {
  //         return false;
  //       }
  //       return activity.tags.some((tag: string) => {
  //         return this.selectedTags.includes(tag);
  //       });
  //     });
  //   }
  // }

  // removeSelectedTag(tag: string) {
  //   this.selectedTags.splice(this.selectedTags.indexOf(tag), 1);
  //   this.filterBySelectedTags();
  // }

  // loadMore() {
  //   this.isLoading = true;
  //   const last = this.allActivities[this.allActivities.length - 1];
  //   const next = query(
  //     this.activitiesCollection,
  //     orderBy('title'),
  //     startAfter(last.title),
  //     limit(25)
  //   );
  //   collectionData(next, { idField: 'id' }).subscribe((data) => {
  //     this.allActivities = this.allActivities.concat(data);
  //     this.filterBySelectedTags();
  //     this.isLoading = false;
  //   });
  // }
}
