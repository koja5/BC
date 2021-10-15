import { TestBed } from '@angular/core/testing';

import { PrepareMailService } from './prepare-mail.service';

describe('PrepareMailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrepareMailService = TestBed.inject(PrepareMailService);
    expect(service).toBeTruthy();
  });
});
