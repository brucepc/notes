import {TestBed} from '@angular/core/testing';

import {StorageService} from './storage.service';
import {ENCRYPT_KEY} from "./tokens";

describe('StorageService', () => {

  it('should be created StorageService with Encrypt key', () => {
    TestBed.configureTestingModule({
      providers: [{provide: ENCRYPT_KEY, useValue: 'unit-test-key'}]
    });
    const service = TestBed.inject(StorageService);

    expect(service).toBeTruthy();
  });

  it('should be created StorageService without Encrypt key', () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(StorageService);

    expect(service).toBeTruthy();
  });


});
