// import { PolizaAsegurados } from './../../../../models/polizaEmit/PolizaAsegurados';
import { AppConfig } from "../../../../app.config";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Observable } from 'rxjs';
import { SavedPolicyEmit } from '../../models/polizaEmit/SavedPolicyEmit';
import { InsuredPolicySearch } from '../../models/polizaEmit/request/insured-policy-search';
import { PolicyProofSearch } from '../../models/polizaEmit/request/policy-proof-search';
import { PolicyTransactionSearch } from '../../models/polizaEmit/request/policy-transaction-search';

@Injectable({
    providedIn: 'root'
})
export class PolicyemitService {
    private _baseUrl = AppConfig.URL_API_SCTR;
    //_baseUrl = "http://localhost:30897";
    private headers = new HttpHeaders({ "Content-Type": "application/json" });

    constructor(private http: HttpClient) { }

    getPolicyEmitCab(nroCotizacion: any, typeMovement: string) {
        let url = this._baseUrl + "/PolicyManager/PolizaEmitCab?nroCotizacion=" + nroCotizacion + "&typeMovement=" + typeMovement;
        return this.http.get(url);
    }
    getPolicyEmitComer(nroCotizacion: any) {
        let url = this._baseUrl + "/PolicyManager/PolizaEmitComer?nroCotizacion=" + nroCotizacion;
        return this.http.get(url);
    }
    getPolicyEmitDet(nroCotizacion: any) {
        let url = this._baseUrl + "/PolicyManager/PolizaEmitDet?nroCotizacion=" + nroCotizacion;
        return this.http.get(url);
    }
    getPolicyEmitDetTX(processId: any) {
        let url = this._baseUrl + "/PolicyManager/PolizaEmitDetTX?processId=" + processId;
        return this.http.get(url);
    }
    getPolicyCot(nroCotizacion: any) {
        let url = this._baseUrl + "/PolicyManager/PolizaCot?nroCotizacion=" + nroCotizacion;
        return this.http.get(url);
    }
    getTipoRenovacion(data: any): Observable<any> {
        const body = JSON.stringify(data);
        let url = this._baseUrl + "/PolicyManager/TipoRenovacion";
        return this.http.post(url, body, {
            headers: this.headers
        });
    }
    GetAnnulment() {
        let url = this._baseUrl + "/PolicyManager/MotivoAnulacion";
        return this.http.get(url);
    }
    getFrecuenciaPago(codrenovacion: any) {
        let url = this._baseUrl + "/PolicyManager/FrecuenciaPago?codrenovacion=" + codrenovacion;
        return this.http.get(url);
    }

    savePolicyEmit(paquete: FormData) {
        let url = this._baseUrl + "/PolicyManager/SavedPolicyEmit"
        return this.http.post(url, paquete);
    }
    nroPolizas(salud: any, pension: any) {
        let url = this._baseUrl + "/PolicyManager/NroPoliza?salud=" + salud + "&pension=" + pension;
        return this.http.post(url, null);
    }
    getProductTypeList(): Observable<any> {
        let url = this._baseUrl + "/PolicyManager/GetProductTypeList";
        return this.http.get(url);
    }
    getMovementTypeList(): Observable<any> {
        let url = this._baseUrl + "/PolicyManager/GetMovementTypeList";
        return this.http.get(url);
    }
    getInsuredPolicyList(data: InsuredPolicySearch): Observable<any> {
        const body = JSON.stringify(data);
        let url = this._baseUrl + "/PolicyManager/GetInsuredPolicyList";
        return this.http.post(url, body, {
            headers: this.headers
        });
    }
    getPolicyProofList(data: PolicyProofSearch): Observable<any> {
        const body = JSON.stringify(data);
        let url = this._baseUrl + "/PolicyManager/GetPolicyProofList";
        return this.http.post(url, body, {
            headers: this.headers
        });
    }
    getPolicyTransactionList(data: PolicyTransactionSearch): Observable<any> {
        const body = JSON.stringify(data);
        let url = this._baseUrl + "/PolicyManager/GetPolicyTransactionList";
        return this.http.post(url, body, {
            headers: this.headers
        });
    }
    valGestorList(paquete: FormData): Observable<any> {
        // return this.http
        // 	.post(
        // 		this._baseUrl + "/Api/PolicyManager/GetValidatorInsured", paquete);

        return this.http.post(this._baseUrl + "/PolicyManager/savedAsegurados", paquete);
    }

    reportErrors(listErrores: any) {

        const body = JSON.stringify(listErrores);
        let url = this._baseUrl + "/PolicyManager/GenerarExcelError"
        return this.http.post(url, body, {
            headers: this.headers
        });
    }

    transactionPolicy(renew: FormData): Observable<any> {
        return this.http.post(this._baseUrl + "/PolicyManager/TransactionPolicy", renew);
    }

    renewMod(data: any): Observable<any> {
        const body = JSON.stringify(data);
        let url = this._baseUrl + "/PolicyManager/RenewMod";
        return this.http.post(url, body, {
            headers: this.headers
        });
    }
    downloadExcel(data: any, cotizacion: any) {
        const body = JSON.stringify(data);
        let url = this._baseUrl + "/PolicyManager/downloadExcel?client=" + data + "&Cotizacion=" + cotizacion;
        return this.http.post(url, body, {
            headers: this.headers
        });

    }
    getUrl() {
        return this._baseUrl;
    }
}