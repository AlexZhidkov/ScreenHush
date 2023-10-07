import { Component, inject } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { DocumentData, DocumentReference, Firestore, doc, onSnapshot, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadString, getDownloadURL } from '@angular/fire/storage';
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
  private storage: Storage = inject(Storage);
  user: User | null = null;
  activityId: string | null = null;
  activity: any;
  activityRef!: DocumentReference<DocumentData>;
  isLoading = true;
  imageUrl: string | undefined = undefined;
  isImageLoading: boolean = false;

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
      if (this.activity.imageUrl) {
        this.imageUrl = await getDownloadURL(ref(this.storage, `images/${this.activityId}-400`));
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
}
