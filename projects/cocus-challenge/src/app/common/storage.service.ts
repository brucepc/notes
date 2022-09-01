import {Inject, Injectable} from '@angular/core';
import {EncryptStorage} from "encrypt-storage";
import {ENCRYPT_KEY} from "./tokens";


@Injectable({
  providedIn: 'root'
})
export class StorageService extends EncryptStorage {
  constructor(
    @Inject(ENCRYPT_KEY)
      encryptKey: string
  ) {
    super(encryptKey || 'default-key');
  }
}
