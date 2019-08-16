import { TestBed } from '@angular/core/testing';

import { DataBridgeService } from './data-bridge.service';

describe('DataBridgeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataBridgeService = TestBed.get(DataBridgeService);
    expect(service).toBeTruthy();
  });
});
