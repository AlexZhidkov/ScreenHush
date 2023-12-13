import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FavouritesService } from '../services/favourites.service';
import { User } from '@angular/fire/auth';
import { ActivitiesService } from '../services/activities.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit  {
  activityId: string | null = null;
  activityDoc$!: Observable<any>;
  isFavoured: boolean;
  isLoading = true;
  panelOpenState = false;
  user: User;
  
  constructor(
    private activitiesService: ActivitiesService,
    private route: ActivatedRoute,
    private location: Location,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private favouritesService: FavouritesService
  ) {
    this.matIconRegistry.addSvgIcon(
      'facebook_custom',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/facebook.svg'
      ) as SafeResourceUrl
    );

    this.matIconRegistry.addSvgIcon(
      'twitter_custom',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/twitter.svg'
      ) as SafeResourceUrl
    );
    
    this.activityId = this.route.snapshot.paramMap.get('activityId');

    if (!this.activityId) {
      console.error('Activity ID is falsy');
      return;
    }

    this.activityDoc$ = this.activitiesService.getActivityById(this.activityId);
  }

  async ngOnInit(): Promise<void> {
    this.isFavoured = await this.favouritesService.isActivityFavorited(this.activityId);
  }
  
  goBackToPrevPage(): void {
    this.location.back();
  }

  async shareMore() {
    const shareData = {
      title: "ScreenHush",
      text: "Check out this activity",
      url: window.location.href
    };

    await navigator.share(shareData);
  }

  sendEmail(): void {
    const currentURL = window.location.href;
    const subject = encodeURIComponent(`Checkout this activity: ${currentURL}`);
    const mailtoLink = `mailto:?subject=${subject}`;
    window.location.href = mailtoLink;
  }

  async toggleFavourite() {
    if (this.isFavoured) {
      this.favouritesService.removeFromFavourites(this.activityId);
    } else {
      this.favouritesService.addToFavourites(this.activityId);
    }
    this.isFavoured = !this.isFavoured;
  }
}
