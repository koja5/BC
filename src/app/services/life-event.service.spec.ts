import { TestBed } from '@angular/core/testing';

import { LifeEventService } from './life-event.service';

describe('LifeEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LifeEventService = TestBed.get(LifeEventService);
    expect(service).toBeTruthy();
  });
});
