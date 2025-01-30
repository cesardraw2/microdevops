import { TestBed } from '@angular/core/testing';

import { CentralConfiguracaoService } from './central-configuracao.service';

describe('CentralConfiguracaoService', () => {
  let service: CentralConfiguracaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CentralConfiguracaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
