import { Component, inject } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { DocumentData, DocumentReference, Firestore, doc, onSnapshot, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Functions } from '@angular/fire/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { docData } from 'rxfire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent {
  private firestore: Firestore = inject(Firestore);
  private analytics: Analytics = inject(Analytics);
  activityId: string | null = null;
  activityDoc$!: Observable<any>;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private readonly functions: Functions,
    private snackBar: MatSnackBar,
  ) {
    this.activityId = this.route.snapshot.paramMap.get('activityId');
    if (!this.activityId) {
      console.error('Activity ID is falsy');
      return;
    }
    this.activityDoc$ = docData(doc(this.firestore, 'activities', this.activityId as string)) as Observable<any>;
  }
}
