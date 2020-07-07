import { TestBed } from '@angular/core/testing';

import { LifeEventDetailsService } from './life-event-details.service';

describe('LifeEventDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LifeEventDetailsService = TestBed.get(LifeEventDetailsService);
    expect(service).toBeTruthy();
  });
});
