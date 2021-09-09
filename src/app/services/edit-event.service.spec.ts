import { TestBed } from '@angular/core/testing';

import { EditEventService } from './edit-event.service';

describe('EditEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditEventService = TestBed.inject(EditEventService);
    expect(service).toBeTruthy();
  });
});
