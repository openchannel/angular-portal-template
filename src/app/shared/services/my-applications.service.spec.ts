import { TestBed } from '@angular/core/testing';

import { MyApplicationsService } from './my-applications.service';

describe('MyApplicationsService', () => {
  let service: MyApplicationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyApplicationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
