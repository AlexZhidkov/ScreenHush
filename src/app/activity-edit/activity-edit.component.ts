import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { DocumentData, DocumentReference, onSnapshot } from '@angular/fire/firestore';
import { Storage, ref, uploadString, getDownloadURL } from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TagsService } from '../services/tags.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-activity-edit',
  templateUrl: './activity-edit.component.html',
  styleUrls: ['./activity-edit.component.scss']
})
export class ActivityEditComponent {
  private auth: Auth = inject(Auth);
  private storage: Storage = inject(Storage);
  user: User | null = null;
  activityId: string | null = null;
  activity: any;
  activityRef!: DocumentReference<DocumentData>;
  isLoading = true;
  imageUrl: string | undefined = undefined;
  isImageLoading: boolean = false;

  //Tags
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  filteredTags!: Observable<string[]>;
  allTags: string[] = [];
  tags: string[] = [];
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;
  announcer = inject(LiveAnnouncer);

  constructor(
    private route: ActivatedRoute,
    private tagsService: TagsService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dataService: DataService
  ) {
    this.activityId = this.route.snapshot.paramMap.get('activityId');
    if (!this.activityId) {
      console.error('Activity ID is falsy');
      return;
    }
    this.allTags = tagsService.getAllTags();
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice())),
    );

    onAuthStateChanged(this.auth, async (user) => {
      if (!user) {
        console.error('User object is falsy');
        return;
      }
      this.user = user;
    });
    this.activityRef = this.dataService.getActivityDoc(this.activityId);

    onSnapshot(this.activityRef, async (activitySnapshot) => {
      this.isLoading = false;
      this.activity = activitySnapshot.data();
      this.activity.id = activitySnapshot.id;
      if (!this.activity) {
        console.error('Activity object is falsy');
        return;
      }
      this.tags = this.activity.tags || [];
      if (this.activity.imageUrl) {
        this.imageUrl = await getDownloadURL(ref(this.storage, `images/${this.activityId}-400`));
      }
    });
  }

  updateActivity(data: DocumentData) {
    this.dataService.updateActivity(this.activityRef, data);
  }

  async deleteActivity(): Promise<void> {
    try {
      await this.dataService.deleteActivity(this.activityId as string, this.user?.uid, this.activityRef);
      this.router.navigate([`/`]);
    } catch (error) {
      console.error('Error deleting activity:', error);
      // Handle error if needed
    }
  }

  async onImageSelected(event: Event) {
    debugger;
    this.isImageLoading = true;
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;
    const file = files[0];

    //Extension is not used because it's not stored in the database for image retrieval.
    //const extension = file.name.split('.')[1];
    const img = new Image();
    img.onload = () => {
      debugger;
      var imageSize = 400;
      const img400 = this.getResizedImageDataUrl(img, file.type, imageSize);
      if (img400) {
        uploadString(ref(this.storage, `images/${this.activityId}-${imageSize}`), img400, 'data_url')
          .then(async () => {
            debugger;
            this.imageUrl = await getDownloadURL(ref(this.storage, `images/${this.activityId}-400`));
            this.updateActivity({ imageUrl: this.imageUrl });
            this.isImageLoading = false;
          })
          .catch((error) => {
            console.error(error);
            this.isImageLoading = false;
          });
      } else {
        this.isImageLoading = false;
      }
    }
    const dataUrl = await this.readFile(file);
    img.src = dataUrl;
  }

  readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
  }

  getResizedImageDataUrl(img: HTMLImageElement, fileType: string, maxSize: number) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    var width = img.width;
    var height = img.height;
    if (width > height) {
      if (width > maxSize) {
        height = height * (maxSize / width);
        width = maxSize;
      }
    } else {
      if (height > maxSize) {
        width = width * (maxSize / height);
        height = maxSize;
      }
    }
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const resizedDataUrl = canvas.toDataURL(fileType);
    return resizedDataUrl;
  }

  // Tags section
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const tagExists = this.tags.includes(value);

    if (value && !tagExists) {
      this.tags.push(value);
      this.updateActivity({ tags: this.tags });
    }
    
    event.chipInput!.clear();
    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
      this.updateActivity({ tags: this.tags });

      this.announcer.announce(`Removed ${tag}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.updateActivity({ tags: this.tags });
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(tag => tag.toLowerCase().includes(filterValue));
  }
  // Tags section - end
}
