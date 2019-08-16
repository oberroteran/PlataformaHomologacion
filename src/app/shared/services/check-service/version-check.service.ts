import { isNullOrUndefined } from 'util';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class VersionCheckService {

  private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';

  constructor(private http: HttpClient) { }

  public initVersionCheck(url, frequency = 1000 * 60 * 30) {
    setInterval(() => {
      this.checkVersion(url);
    }, frequency);
    this.checkVersion(url);
  }

  private checkVersion(url) {
    this.http.get(url + '?t=' + new Date().getTime())
      .subscribe(
        (response: any) => {
          const hash = response.hash;
          const hashChanged = this.hasHashChanged(this.currentHash, hash);
          if (hashChanged) {
            window.location.reload();
            if (!isNullOrUndefined(response.version)) {
              console.log('new version release' + response.version)
            }
          }
          this.currentHash = hash;
        },
        (err) => {
          console.error(err, 'Could not get version');
        }
      );
  }

  private hasHashChanged(currentHash, newHash) {
    if (!currentHash || currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') {
      return false;
    }
    return currentHash !== newHash;
  }
}
