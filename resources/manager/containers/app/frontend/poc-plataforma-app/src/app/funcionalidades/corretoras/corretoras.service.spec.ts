import { TestBed } from '@angular/core/testing';

import { CorretorasService } from './corretoras.service';

describe('CorretorasService', () => {
  let service: CorretorasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorretorasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
