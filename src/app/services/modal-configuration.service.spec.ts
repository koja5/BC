import { TestBed } from '@angular/core/testing';

import { ModalConfigurationService } from './modal-configuration.service';

describe('ModalConfigurationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModalConfigurationService = TestBed.get(ModalConfigurationService);
    expect(service).toBeTruthy();
  });
});
