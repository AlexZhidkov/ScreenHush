import { Component, OnInit } from '@angular/core';
import { FavouritesService } from '../services/favourites.service';
import { Activity } from '../model/activity';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit {
  favourites : Activity[];

  constructor(private favouritesService: FavouritesService,) {

  }

  ngOnInit(): void {
    this.favouritesService.getFavouriteActivities().then((result => {
      this.favourites = result;
    }))
  }
}
