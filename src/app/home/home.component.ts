import { Component, inject } from '@angular/core';
import { Analytics } from '@angular/fire/analytics';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { CollectionReference, Firestore, collection, collectionData, addDoc, DocumentReference, query, limit, orderBy, startAfter } from '@angular/fire/firestore';
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
}

