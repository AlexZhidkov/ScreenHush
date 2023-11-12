import { Injectable } from '@angular/core';
import { FilterOptionsRequest } from '../model/filter-options';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private filterSource = new Subject<FilterOptionsRequest>();

  filterSource$ = this.filterSource.asObservable();

  getData() {
    return this.filterSource$;
  }

  updateData(request: FilterOptionsRequest) {
    this.filterSource.next(request);
  }
}