import { Component, OnInit, inject } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private firestore: Firestore = inject(Firestore);
  private analytics: Analytics = inject(Analytics);
  isLoading = false;
  private auth: Auth = inject(Auth);
  user: User | null = null;
  places: any[];

  constructor() {
    this.places = [
      { title: 'FERNTREE RESERVE', address: '22 Ferntree Road, Engadine, NSW 2233' },
      { title: 'HOLMLEA PLACE RESERVE', address: '40 Holmlea Place, Engadine NSW 2233' },
      { title: 'PERRY PARK PLAYGROUND', address: '92 Woronora Road, Engadine NSW 2233' },
    ];
  }

  ngOnInit(): void { }
}
