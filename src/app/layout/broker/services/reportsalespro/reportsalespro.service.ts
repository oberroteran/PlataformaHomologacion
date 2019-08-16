import { Injectable } from '@angular/core';
// import { Http, RequestOptions, URLSearchParams, Headers } from '@angular/http';
import { ConfigService } from '../../../../shared/services/general/config.service';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { ReportSalesPRO } from '../../models/reportsalespro/reportsalespro';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { ApiService } from '../../../../shared/services/api.service';

@Injectable()
export class ReportSalesPROService {

  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  list: any = [];
  _baseUrl = '';

  constructor(private http: HttpClient,
    private configService: ConfigService
  ) {
    this._baseUrl = configService.getWebApiURL();
  }

  getPostReportSalesPRO(reportSalesPRO: ReportSalesPRO) {
    /*console.log('url getAll() => ' + this.apiUrl);*/
    const body = JSON.stringify(reportSalesPRO);
    return this.http.post(this._baseUrl + '/ReportSalesProtecta/', body, {headers: this.headers})
                    .map(
                      response => response, // .json(),
                    error => {
                      console.log(error);
                    },
                  );
  }
}
