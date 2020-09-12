import { TestBed } from '@angular/core/testing';

import { EShopFormService } from './e-shop-form.service';

describe('EShopFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EShopFormService = TestBed.get(EShopFormService);
    expect(service).toBeTruthy();
  });
});
