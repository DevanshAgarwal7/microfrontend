import { TestBed } from '@angular/core/testing';

import { InsuranceDetailsService } from './insurance-details.service';

describe('InsuranceDetailsService', () => {
  let service: InsuranceDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsuranceDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
