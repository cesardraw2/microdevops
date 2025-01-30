import { TestBed } from '@angular/core/testing';

import { CentralAtendimentoService } from './central-atendimento.service';

describe('CentralAtendimentoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CentralAtendimentoService = TestBed.get(CentralAtendimentoService);
    expect(service).toBeTruthy();
  });
});
