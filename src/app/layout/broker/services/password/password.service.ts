import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../app.config';
import { Observable } from 'rxjs/Observable';
import { SessionToken } from '../../../client/shared/models/session-token.model';

const httpOption = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class PasswordService {
  constructor(private http: HttpClient, private config: AppConfig) {}

  mHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  retrieve(model: any): Observable<any> {
    return this.http
      .post(
        this.config.apiUrl + '/password/retrieve',
        {
          tipdoc: model.tipdoc,
          numdoc: model.numdoc
        },
        { headers: this.mHeaders }
      )
      .map(
        response => {
          //console.log('success: ', response);

          return response;
        },
        error => {
          console.log('error: ', error);

          return {
            success: false,
            message: 'Tuvimos un inconveniente realizando tu petición'
          };
        }
      );
  }

  sendRetrievePassword(model: any): Observable<any> {
    return this.http
      .post(
        this.config.apiUrl + '/password/send',
        {
          tipdoc: model.tipdoc,
          numdoc: model.numdoc
        },
        { headers: this.mHeaders }
      )
      .map(
        response => {
          //console.log('success: ', response);

          return response;
        },
        error => {
          console.log('error: ', error);

          return {
            success: false,
            message: 'Tuvimos un inconveniente realizando tu petición'
          };
        }
      );
  }

  tiposDocumentos(): Observable<any> {
    return this.http
      .post(
        this.config.apiUrl + '/password/documents',
        {},
        { headers: this.mHeaders }
      )
      .map(
        response => {
          //console.log('success: ', response);

          return response;
        },
        error => {
          console.log('error: ', error);

          return {
            success: false,
            message: 'Tuvimos un inconveniente realizando tu petición'
          };
        }
      );
  }

  getTokenInfo(token: string): Observable<any> {
    return this.http
      .post(
        this.config.apiUrl + '/password/token_info',
        { idretrieve: token },
        { headers: this.mHeaders }
      )
      .map(
        response => {
          //console.log('success: ', response);

          return response;
        },
        error => {
          console.log('error: ', error);

          return {
            success: false,
            message: 'Tuvimos un inconveniente realizando tu petición'
          };
        }
      );
  }

  renewPassword(model: any): Observable<any> {
    return this.http
      .post(this.config.apiUrl + '/password/renew_pass', model, {
        headers: this.mHeaders
      })
      .map(
        response => {
          //console.log('success: ', response);

          return response;
        },
        error => {
          console.log('error: ', error);

          return {
            success: false,
            message: 'Tuvimos un inconveniente realizando tu petición'
          };
        }
      );
  }
}
