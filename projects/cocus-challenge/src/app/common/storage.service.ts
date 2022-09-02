import {Inject, Injectable, Optional} from '@angular/core';
import {EncryptStorage} from "encrypt-storage";
import {ENCRYPT_KEY} from "./tokens";


@Injectable({
  providedIn: 'root'
})
export class StorageService extends EncryptStorage {
  constructor(
    @Inject(ENCRYPT_KEY) @Optional()
      encryptKey: string
  ) {
    super(encryptKey || 'default-key');
  }
}
