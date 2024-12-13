import { TestBed } from '@angular/core/testing';

import { SettingsValidatorService } from './settings-validator.service';

describe('SettingsValidatorService', () => {
  let service: SettingsValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
