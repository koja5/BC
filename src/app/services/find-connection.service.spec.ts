import { TestBed } from '@angular/core/testing';

import { FindConnectionService } from './find-connection.service';

describe('FindConnectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FindConnectionService = TestBed.inject(FindConnectionService);
    expect(service).toBeTruthy();
  });
});
