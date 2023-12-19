import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NgForageCache } from 'ngforage';

@Injectable({
  providedIn: 'root',
})
export class CacheService<T> {
  public cache$ = new BehaviorSubject<T | null>(null);
  private defaultCacheTimeInMinutes = 60;

  constructor(private readonly ngf: NgForageCache) {}

  set(key: string, data: T, ttlMinutes: number = this.defaultCacheTimeInMinutes): void {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + ttlMinutes);

    // Explicitly define the type of the value in the Map
    const cacheValue: { data: T; expiry: Date } = { data, expiry };

    this.ngf.setItem(key, cacheValue);
    this.cache$.next(cacheValue.data);
  }
  
  async get(key: string): Promise<T | null> {
    const cachedData = await this.ngf.getItem<{ data: T; expiry: Date }>(key);
    let data = null;

    if (!cachedData) {
      this.cache$.next(null);
    } else {
      this.cache$.next(cachedData.data);
      data = cachedData.data;
    }
    
    return data;
  }
}
