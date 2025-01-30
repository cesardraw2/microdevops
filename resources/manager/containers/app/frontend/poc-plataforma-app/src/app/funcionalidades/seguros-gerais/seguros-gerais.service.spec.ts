import { TestBed } from '@angular/core/testing';

import { SegurosGeraisService } from './seguros-gerais.service';

describe('SegurosGeraisService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SegurosGeraisService = TestBed.get(SegurosGeraisService);
    expect(service).toBeTruthy();
  });
});
