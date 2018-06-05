import { TestBed, inject } from '@angular/core/testing';

import { StudentSavechangesguardService } from './student-savechangesguard.service';

describe('StudentSavechangesguardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudentSavechangesguardService]
    });
  });

  it('should be created', inject([StudentSavechangesguardService], (service: StudentSavechangesguardService) => {
    expect(service).toBeTruthy();
  }));
});
