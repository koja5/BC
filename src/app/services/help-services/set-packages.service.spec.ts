import { TestBed } from '@angular/core/testing';

import { SetPackagesService } from './set-packages.service';

describe('SetPackagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetPackagesService = TestBed.get(SetPackagesService);
    expect(service).toBeTruthy();
  });
});
