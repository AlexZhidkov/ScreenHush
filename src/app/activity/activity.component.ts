import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent {
  activityId: string | null = null;
  activityDoc$!: Observable<any>;
  isLoading = true;
  panelOpenState = false;

  constructor(
    private homeService: DataService,
    private route: ActivatedRoute,
    private location: Location,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      "facebook_custom",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/facebook.svg") as SafeResourceUrl
    );
    this.matIconRegistry.addSvgIcon(
      "instagram_custom",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/instagram.svg") as SafeResourceUrl
    );

    this.activityId = this.route.snapshot.paramMap.get('activityId');
    if (!this.activityId) {
      console.error('Activity ID is falsy');
      return;
    }

    this.activityDoc$ = this.homeService.getActivityById(this.activityId);
  }

  goBackToPrevPage(): void {
    this.location.back();
  }
}
