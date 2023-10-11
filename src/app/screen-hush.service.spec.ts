import { TestBed } from '@angular/core/testing';

import { ScreenHushService } from './screen-hush.service';

describe('ScreenHushService', () => {
  let service: ScreenHushService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScreenHushService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
