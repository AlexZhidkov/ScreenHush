import { Component, inject } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { DocumentData, DocumentReference, Firestore, doc, onSnapshot, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Functions } from '@angular/fire/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-activity-edit',
  templateUrl: './activity-edit.component.html',
  styleUrls: ['./activity-edit.component.css']
})
export class ActivityEditComponent {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private analytics: Analytics = inject(Analytics);
  user: User | null = null;
  activityId: string | null = null;
  activity: any;
  activityRef!: DocumentReference<DocumentData>;
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
    onAuthStateChanged(this.auth, async (user) => {
      if (!user) {
        console.error('User object is falsy');
        return;
      }
      this.user = user;
    });
    this.activityRef = doc(this.firestore, 'activities', this.activityId as string);
    onSnapshot(this.activityRef, async (activitySnapshot) => {
      this.isLoading = false;
      this.activity = activitySnapshot.data();
      this.activity.id = activitySnapshot.id;
      if (!this.activity) {
        console.error('Activity object is falsy');
        return;
      }
    });
  }

  updateActivity(data: any) {
    updateDoc(this.activityRef as DocumentReference<DocumentData>, data)
  }

  deleteActivity(): void {
    logEvent(this.analytics, 'delete_activity', { uid: this.user?.uid, activityId: this.activityId })
    if (!this.activityRef) {
      console.error("deleteActivity: falsy activityRef");
      return;
    }
    deleteDoc(this.activityRef)
      .then(() => {
        this.router.navigate([`/`])
      });
  }

}
