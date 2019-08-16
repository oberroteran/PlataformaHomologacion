import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { UtilityService } from '../../../../shared/services/general/utility.service';
import { tap, catchError, finalize } from 'rxjs/operators';

@Injectable()
export class ClientHttpInterceptor implements HttpInterceptor {

  constructor(private utilityService: UtilityService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log('interceptando request...');
    let newBody = request.body;
    if (request.method.toLowerCase() === 'post') {
      newBody = {data: this.utilityService.encodeObjectToBase64(newBody)};
      //console.log(newBody);
    }

    const newRequest = request.clone({
                                      body: newBody
                                    });

    // console.log('Enviando request');
    return next.handle(newRequest).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }
      }),
      catchError(err => {
        console.log(err);
        return Observable.throw(err);
      }),
      finalize(() => {

      })
    );
  }
}
