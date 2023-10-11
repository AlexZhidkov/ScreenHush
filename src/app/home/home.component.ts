import { Component, inject } from '@angular/core';
import { Analytics } from '@angular/fire/analytics';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { CollectionReference, Firestore, collection, collectionData, doc, addDoc, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ScreenHushService } from '../screen-hush.service';
import { MatChipOption } from '@angular/material/chips';

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
  allActivities: any[] = [];
  selectedActivities: any[] = [];
  activitiesCollection: CollectionReference;
  allTags: string[] = [];
  selectedTags: string[] = [];
  filterIsOpen = false;
  selectedTagChips: MatChipOption[] = [];

  constructor(
    private service: ScreenHushService,
    private router: Router,
  ) {
    this.allTags = service.getAllTags();

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.user = user;
      }
    });
    this.activitiesCollection = collection(this.firestore, 'activities');
    this.activities$ = collectionData(this.activitiesCollection, { idField: 'id' }) as Observable<any[]>;
    this.activities$.subscribe(data => {
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

  applyFilter(selected: MatChipOption | MatChipOption[]) {
    this.selectedTags = (selected as MatChipOption[]).map((option: MatChipOption) => {
      return option.value;
    });
    this.filterBySelectedTags();
  }

  filterBySelectedTags() {
    this.isLoading = true;
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
    this.filterIsOpen = false;
    this.isLoading = false;
  }

  removeSelectedTag(tag: string) {
    this.selectedTags.splice(this.selectedTags.indexOf(tag), 1);
    this.filterBySelectedTags();
  }
}

