import { TestBed } from '@angular/core/testing';

import { OrderHistoyService } from './order-histoy.service';

describe('OrderHistoyService', () => {
  let service: OrderHistoyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderHistoyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
