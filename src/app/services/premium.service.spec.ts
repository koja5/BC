import { TestBed } from '@angular/core/testing';

import { PremiumService } from './premium.service';

describe('PremiumService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PremiumService = TestBed.get(PremiumService);
    expect(service).toBeTruthy();
  });
});
