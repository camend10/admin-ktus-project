import { TestBed } from '@angular/core/testing';

import { PermissionGeneralService } from './permission-general.service';

describe('PermissionGeneralService', () => {
  let service: PermissionGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
