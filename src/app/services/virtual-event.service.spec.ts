import { TestBed } from '@angular/core/testing';

import { VirtualEventService } from './virtual-event.service';

describe('VirtualEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VirtualEventService = TestBed.get(VirtualEventService);
    expect(service).toBeTruthy();
  });
});
