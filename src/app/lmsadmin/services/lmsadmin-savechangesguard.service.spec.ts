import { TestBed, inject } from '@angular/core/testing';

import { LmsadminSavechangesguardService } from './lmsadmin-savechangesguard.service';

describe('LmsadminSavechangesguardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LmsadminSavechangesguardService]
    });
  });

  it('should be created', inject([LmsadminSavechangesguardService], (service: LmsadminSavechangesguardService) => {
    expect(service).toBeTruthy();
  }));
});
