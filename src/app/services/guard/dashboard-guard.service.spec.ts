import { TestBed } from '@angular/core/testing';

import { DashboardGuardService } from './dashboard-guard.service';

describe('DashboardGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashboardGuardService = TestBed.inject(DashboardGuardService);
    expect(service).toBeTruthy();
  });
});
