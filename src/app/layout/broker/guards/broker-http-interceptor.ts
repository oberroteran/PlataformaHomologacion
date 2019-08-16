import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
/* import {
  catchError,
  tap,
  finalize
} from 'rxjs/operators'; */
import { AuthenticationService } from '../services/authentication.service';
import { throwError, from as fromPromise, Observable } from 'rxjs';
import { finalize, tap, catchError } from 'rxjs/operators';
import { UtilityService } from '../../../shared/services/general/utility.service';
import { LogoutService } from '../../../shared/logout/service/logout.service';

@Injectable()
export class BrokerHttpInterceptor implements HttpInterceptor {
  counter = 0;

  constructor(
    private authenticationService: AuthenticationService,
    private utilityService: UtilityService,
    private dialogService: LogoutService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // debugger;
    // console.log('intercepted request ... ');
    // const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let newBody = req.body;
    if (req.method.toLowerCase() === 'post' && !(newBody instanceof FormData)) {
      newBody = { data: this.utilityService.encodeObjectToBase64(newBody) };
      // console.log(newBody); regresar arriba
    }

    let token = '';
    token = `Bearer ${this.authenticationService.getToken()}`;
    const authReq = req.clone(
      {
        headers: req.headers.set('Authorization', token),
        body: newBody
      }
    );
    const mainMe = this;
    return next.handle(authReq).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }
      }),
      catchError(err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            mainMe.counter++;
            if (mainMe.counter === 1) {
              const modalPromise = mainMe.dialogService.show();
              const newObservable = fromPromise(modalPromise);
              newObservable.subscribe(
                res => {
                  if (res === true) {
                    console.log(res);
                  } else {
                    console.log(err);
                  }
                },
                reason => {
                  console.log(reason);
                }
              );
              return newObservable;
            }
            throwError(err);
          }
          return throwError(err);
        }
        return throwError(err);
      }),
      finalize(() => {
      })
    );
  }
}
