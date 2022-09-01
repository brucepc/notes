import {TestBed} from '@angular/core/testing';

import {StorageService} from './storage.service';
import {ENCRYPT_KEY} from "./tokens";

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: ENCRYPT_KEY, useValue: 'unit-test-key'}]
    });
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
