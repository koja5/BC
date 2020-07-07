import { TestBed } from '@angular/core/testing';

import { EventAllService } from './event-all.service';

describe('EventAllService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventAllService = TestBed.get(EventAllService);
    expect(service).toBeTruthy();
  });
});
