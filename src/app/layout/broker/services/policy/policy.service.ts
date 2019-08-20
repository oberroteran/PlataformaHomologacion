import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppConfig } from "../../../../app.config";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PolicyService {
    private headers = new HttpHeaders({ "Content-Type": "application/json" });
    private Url = AppConfig.URL_API_SCTR;

    constructor(private http: HttpClient) { }

    public getTransaccionList(): Observable<any[]> { //listar tipos de documento a usar
        return this.http.get<any[]>(this.Url + "/PolicyManager/GetTransaccionList");
    }

    public getPolicyTransList(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + "/PolicyManager/GetPolicyTransList", body, {
            headers: this.headers
        });
    }

    public getPolicyMovementsTransList(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + "/PolicyManager/GetPolicyMovementsTransList", body, {
            headers: this.headers
        });
    }

    public valTransactionPolicy(nroCotizacion: any): Observable<any> {
        let url = this.Url + "/PolicyManager/valTransactionPolicy?nroCotizacion=" + nroCotizacion;
        return this.http.get(url);
    }

    public GetVisualizadorProc(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + "/PolicyManager/GetVisualizadorProc", body, {
            headers: this.headers
        });
    }
}
