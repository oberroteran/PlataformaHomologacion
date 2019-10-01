import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { AppConfig } from "../../../../app.config";
import { BrokerAgencySearch } from '../../models/maintenance/agency/request/broker-agency-search';
import { BrokerAgency } from '../../models/maintenance/agency/response/broker-agency';
import { Agency } from '../../models/maintenance/agency/request/agency';
import { GenericResponse } from '../../models/shared/generic-response';
import { QuotationSearch } from '../../models/quotation/request/quotation-search';
import { QuotationStatusChange } from '../../models/quotation/request/quotation-status-change';
import { QuotationTrackingSearch } from '../../models/quotation/request/quotation-tracking-search';

@Injectable({
    providedIn: 'root'
})
export class QuotationService {
    private headers = new HttpHeaders({ "Content-Type": "application/json" });
    private Url = AppConfig.URL_API_SCTR;

    constructor(private http: HttpClient) { }

    public getQuotationList(data: QuotationSearch): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + "/QuotationManager/GetQuotationList", body, {
            headers: this.headers
        });
    }

    public getPolicyList(data: QuotationSearch): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + "/QuotationManager/GetPolicyList", body, {
            headers: this.headers
        });
    }

    public getTrackingList(data: QuotationTrackingSearch): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + "/QuotationManager/GetTrackingList", body, {
            headers: this.headers
        });
    }
    
    public changeStatus(formData: FormData): Observable<any> {
        return this.http.post(this.Url + "/QuotationManager/ChangeStatus", formData);
    }
    public modifyQuotation(formData: FormData): Observable<any> {
        return this.http.post(this.Url + "/QuotationManager/ModifyQuotation", formData);
    }

    public searchBroker(data: any): Observable<any> {
        const request = JSON.stringify(data);
        return this.http
            .post(
                this.Url + "/QuotationManager/SearchBroker", request, {
                    headers: this.headers
                });
    }
    public insertQuotation(data: FormData): Observable<any> {
        return this.http
            .post(
                this.Url + "/QuotationManager/InsertQuotation", data);
    }
    public approveQuotation(data: any): Observable<any> {

        return this.http
            .post(
                this.Url + "/QuotationManager/ApproveQuotation", data);
    }
    
    public getStatusList(certype : string): Observable<any> {
        let _params = { certype : certype}
        return this.http.get(this.Url + "/QuotationManager/GetStatusList", {params: _params});
    }
    public getReasonList(_statusCode: string): Observable<any> {
        let _params = { statusCode: _statusCode }
        return this.http.get(this.Url + "/QuotationManager/GetReasonList", { params: _params });
    }
    public equivalentMunicipality(municipality: string): Observable<any> {
        let _params = { municipality: municipality }
        return this.http.get(this.Url + "/QuotationManager/EquivalentMunicipality", { params: _params });
    }
    public getIGV(data: any): Observable<any> {
        const request = JSON.stringify(data);
        return this.http
            .post(
                this.Url + "/QuotationManager/GetIgv", request, {
                    headers: this.headers
                });
    }
}
