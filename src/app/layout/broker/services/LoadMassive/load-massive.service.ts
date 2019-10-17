import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { AppConfig } from '../../../../app.config';
import { AuthenticationService } from '../authentication.service';
@Injectable({
  providedIn: 'root'
})
export class LoadMassiveService {
  private headers = new HttpHeaders({ "Content-Type": "application/json" });
  private Url = AppConfig.URL_API_SCTR;
  constructor(private http: HttpClient) {

  }

  public GetHeaderProcess(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.Url + '/LoadMassive/ProcessHeaderList', body, {
      headers: this.headers
    });
  }

  public GetDetailProcess(data: any): Observable<any> {
    const _params = { IdProcessHeader: data }
    return this.http.get(this.Url + '/LoadMassive/ProcessDetailList', { params: _params });
  }

  public GetProcessLogError(data: any, opcion: any): Observable<any> {
    const _params = { IdProcessDetail: data, Opcion: opcion }
    return this.http.get(this.Url + '/LoadMassive/GetProcessLogError', { params: _params });
  }

  public GetDataExport(data: any): Observable<any> {
    const body = JSON.stringify(data);
    console.log(body);
    return this.http.post(this.Url + '/LoadMassive/GetDataExport', body, {
      headers: this.headers
    });
  }
  public UploadFileProcess(paquete: FormData): Observable<any> {
    // return this.http
    // 	.post(
    // 		this._baseUrl + "/Api/PolicyManager/GetValidatorInsured", paquete);

    return this.http.post(this.Url + '/LoadMassive/UploadFileProcess', paquete);
}




}
