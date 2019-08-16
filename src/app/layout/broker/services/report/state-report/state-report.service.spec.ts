import { TestBed } from '@angular/core/testing';

import { StateReportService } from './state-report.service';

describe('StateReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StateReportService = TestBed.get(StateReportService);
    expect(service).toBeTruthy();
  });
});
