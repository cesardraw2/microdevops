import { TestBed } from '@angular/core/testing';

import { MenuInicialService } from './menu-inicial.service';

describe('MenuInicialService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MenuInicialService = TestBed.get(MenuInicialService);
    expect(service).toBeTruthy();
  });
});
