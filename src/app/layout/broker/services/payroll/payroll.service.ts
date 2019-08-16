import { Injectable } from '@angular/core';
import { ConfigService } from '../../../../shared/services/general/config.service';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Payroll } from '../../models/Payroll/payroll';
import { PayrollCab } from '../../models/Payroll/payrollcab';
import { ConcPayroll } from '../../models/Payroll/concpayroll';
import { PayrollFilter } from '../../models/payroll/payrollfilter';
import { PayrollDetail } from '../../models/Payroll/payrolldetail';

@Injectable()
export class PayrollService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  list: any = [];
  _baseUrl = '';
  constructor(private http: HttpClient,
    private configService: ConfigService
  ) {
    this._baseUrl = configService.getWebApiURL();
  }

  getPostGrabarPlanillaManual(paryrollcab: any): Observable<any> {
    const body = JSON.stringify(paryrollcab);
    return this.http.post(this._baseUrl + '/Payroll/insupdpayroll', body, { headers: this.headers })
      .map(
        response => response,
        error => {
          console.log(error);
        },
      );
  }

  ValidarPolizaAsociadoAplanilla(paryrolldet: PayrollDetail) {
    const body = JSON.stringify(paryrolldet);
    return this.http.post(this._baseUrl + '/Payroll/validarpolizaasociadoaplanilla', body, { headers: this.headers })
      .map(
        response => response,
        error => {
          console.log(error);
        },
      );
  }


  getPostDerivarPlanilla(paryrollcab: PayrollCab) {
    const body = JSON.stringify(paryrollcab);
    return this.http.post(this._baseUrl + '/Payroll/derivarpayroll', body, { headers: this.headers })
      .map(
        response => response,
        error => {
          console.log(error);
        },
      );
  }


  getPostConciliarPlanilla(concparyroll: ConcPayroll) {
    const body = JSON.stringify(concparyroll);
    return this.http.post(this._baseUrl + '/Payroll/conciliarPayroll', body, { headers: this.headers })
      .map(
        response => response,
        error => {
          console.log(error);
        },
      );
  }
  getPostAnularPlanilla(paryrollcab: PayrollCab) {
    const body = JSON.stringify(paryrollcab);
    return this.http.post(this._baseUrl + '/Payroll/anularpayroll', body, { headers: this.headers })
      .map(
        response => response,
        error => {
          console.log(error);
        },
      );
  }

  getPostCertificado(payrollFilterCertificate: PayrollFilter) {
    const body = JSON.stringify(payrollFilterCertificate);
    return this.http.post(this._baseUrl + '/Payroll/getPayrollCertificados', body, { headers: this.headers })
      .map(
        response => response,
        error => {
          console.log(error);
        },
      );
  }
  getDetailPayroll(payrollFilterCertificate: PayrollFilter) {
    const body = JSON.stringify(payrollFilterCertificate);
    return this.http.post(this._baseUrl + '/Payroll/getDetailPayroll', body, { headers: this.headers })
      .map(
        response => response,
        error => {
          console.log(error);
        },
      );
  }


  GetPayRollGeneral(paryrollcab: PayrollCab) {

    const body = JSON.stringify(paryrollcab);
    return this.http.post(this._baseUrl + '/Payroll/getpayroll', body, { headers: this.headers })
      .map(
        response => response,
        error => {
          console.log(error);
        },
      );

  }
  getPostListPayroll(payroll: Payroll) {
    const body = JSON.stringify(payroll);
    return this.http.post(this._baseUrl + '/Payroll/', body, { headers: this.headers })
      .map(
        response => response,
        error => {
          console.log(error);
        },
      );
  }

  getCanalTipoPago(channel: string, settings: string) {
    const endpoint = 'codechannel';
    const action = 'obtenertipopagocanal';
    const url = `/${endpoint}/${action}/${channel}/${settings}`;
    return this.http.get(this._baseUrl + url).map(
      response => response,
      error => {
        console.log(error);
      });
  }

}
