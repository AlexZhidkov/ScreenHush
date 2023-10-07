import { Component, inject } from '@angular/core';
import { Analytics } from '@angular/fire/analytics';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { CollectionReference, Firestore, collection, collectionData, doc, addDoc, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private firestore: Firestore = inject(Firestore);
  private analytics: Analytics = inject(Analytics);
  isLoading = true;
  private auth: Auth = inject(Auth);
  user: User | null = null;
  activities$: Observable<any[]>;
  activitiesCollection: CollectionReference;

  constructor(
    private router: Router,
  ) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.user = user;
      }
    });
    this.activitiesCollection = collection(this.firestore, 'activities');
    this.activities$ = collectionData(this.activitiesCollection, { idField: 'id' }) as Observable<any[]>;
    this.activities$.subscribe(_ => this.isLoading = false);
  }

  createNewActivity() {
    addDoc(this.activitiesCollection, { title: 'New Activity' })
      .then((newActivityReference: DocumentReference) => {
        this.router.navigate([`edit-activity/${newActivityReference.id}`]);
      });
  }
}
