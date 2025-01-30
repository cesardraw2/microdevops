import { TestBed } from '@angular/core/testing';

import { CentralVendasService } from './central-vendas.service';

describe('CentralVendasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CentralVendasService = TestBed.get(CentralVendasService);
    expect(service).toBeTruthy();
  });
});
