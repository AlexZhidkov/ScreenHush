import { Component, OnInit, inject } from '@angular/core';
import { Analytics } from '@angular/fire/analytics';
import { Auth, User } from '@angular/fire/auth';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private firestore: Firestore = inject(Firestore);
  private analytics: Analytics = inject(Analytics);
  isLoading = true;
  private auth: Auth = inject(Auth);
  user: User | null = null;
  places$: Observable<any[]>;

  constructor() {
    const placesCollection = collection(this.firestore, 'places');
    this.places$ = collectionData(placesCollection) as Observable<any[]>;
    this.places$.subscribe(_ => this.isLoading = false);
  }

  ngOnInit(): void { }
}
