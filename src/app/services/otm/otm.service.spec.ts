import { TestBed } from '@angular/core/testing';

import { OtmService } from './otm.service';

describe('OtmService', () => {
  let service: OtmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
