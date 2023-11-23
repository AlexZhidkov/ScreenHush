import { Component, inject } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { DocumentData, DocumentReference, Firestore, doc, onSnapshot, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Functions } from '@angular/fire/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { docData } from 'rxfire/firestore';
import { Observable } from 'rxjs';
import { Location } from '@angular/common'
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private analytics: Analytics = inject(Analytics);
  user: User | null = null;
  activityId: string | null = null;
  activityDoc$!: Observable<any>;
  isLoading = true;
  panelOpenState = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private readonly functions: Functions,
    private snackBar: MatSnackBar,
    private location: Location,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      "facebook_custom",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/facebook.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "instagram_custom",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/instagram.svg")
    );

    this.activityId = this.route.snapshot.paramMap.get('activityId');
    if (!this.activityId) {
      console.error('Activity ID is falsy');
      return;
    }

    onAuthStateChanged(this.auth, async (user) => {
      if (!user) {
        console.error('User object is falsy');
        return;
      }
      this.user = user;
    });
    
    this.activityDoc$ = docData(doc(this.firestore, 'activities', this.activityId as string), { idField: 'id' }) as Observable<any>;
  }

  goBackToPrevPage(): void {
    this.location.back();
  }
}
