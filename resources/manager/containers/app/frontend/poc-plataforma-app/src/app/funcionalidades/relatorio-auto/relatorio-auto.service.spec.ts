import { TestBed } from '@angular/core/testing';

import { RelatorioAutoService } from './relatorio-auto.service';

describe('RelatorioAutoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RelatorioAutoService = TestBed.get(RelatorioAutoService);
    expect(service).toBeTruthy();
  });
});
