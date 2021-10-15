import { TestBed } from '@angular/core/testing';

import { EditProfileService } from './edit-profile.service';

describe('EditProfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditProfileService = TestBed.inject(EditProfileService);
    expect(service).toBeTruthy();
  });
});
