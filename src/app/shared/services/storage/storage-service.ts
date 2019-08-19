import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class SessionStorageService {

  private storageSub = new Subject<boolean>();


  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }

  setItem(key: string, data: any) {
    sessionStorage.setItem(key, data);
    if (key === 'canalVentaCliente') {
      this.storageSub.next(true);
    }
  }

  removeItem(key) {
    sessionStorage.removeItem(key);
    // this.storageSub.next(true);
  }

  clearStorage() {
    sessionStorage.clear();
    localStorage.clear();
  }
}
