import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScreenHushService {
  screenHushTags: string[] = ['Family', 'Couples', 'Just for Me', 'Event', 'Get Your Culture On', 'Feeling Sporty', 'Park', 'Playground', 'Market', 'Fair', 'Festival'];
  googlePlaceTypes: string[] = ['amusement_park', 'aquarium', 'art_gallery', 'bowling_alley', 'campground', 'church', 'gym', 'hindu_temple', 'library', 'local_government_office', 'mosque', 'movie_theater', 'museum', 'night_club', 'rv_park', 'spa', 'stadium', 'synagogue', 'tourist_attraction', 'travel_agency', 'zoo'];

  constructor() { }

  getAllTags(): string[] {
    return [...this.screenHushTags, ...this.googlePlaceTypes];
  }
}
