import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppConfig } from "../../../../../app.config";
import { Observable } from 'rxjs';
//Modelos
import { AccountTransactionSearch } from '../../../models/report/state-report/request/account-transaction-search';
import { CreditEvaluationSearch } from '../../../models/report/state-report/request/credit-evaluation-search';
import { CreditEvaluation } from '../../../models/report/state-report/request/credit-evaluation';
import { ClientEnablement } from '../../../models/report/state-report/request/client-enablement';
import { ContractorState } from '../../../models/report/state-report/response/contractor-state';
@Injectable({
    providedIn: 'root'
})
export class StateReportService {
    private headers = new HttpHeaders({ "Content-Type": "application/json" });
    private accountStateManager = "AccountStateManager";
    private Url = AppConfig.URL_API_SCTR;
    constructor(private httpClient: HttpClient) { }

    /**
     * Obtiene una lista de transacciones de cuenta
     * @param data filtro para la búsqueda
     */
    public getAccountTransactionList(filter: AccountTransactionSearch): Observable<any> {
        let jsondata = JSON.stringify(filter);
        return this.httpClient.post(this.Url + "/PolicyManager/GetAccountTransactionList", jsondata, { headers: this.headers });
    }

    /**
     * Obtiene la lista de estados de pago
     */
    public getPaymentStateList(): Observable<any> {
        return this.httpClient.get(this.Url + "/PolicyManager/GetPaymentStateList");
    }

    /**
     * Obtiene el historial de evaluaciones crediticias en base a un filtro
     */
    public getCreditEvaluationList(filter: CreditEvaluationSearch): Observable<any> {
        let jsondata = JSON.stringify(filter);
        return this.httpClient.post(this.Url + "/" + this.accountStateManager + "/GetCreditEvaluationList", jsondata, { headers: this.headers });
    }
    /**
     * Obtiene los tipos de calificación
     */
    public getQualificationTypeList(): Observable<any> {
        return this.httpClient.get(this.Url + "/" + this.accountStateManager + "/GetQualificationTypeList");
    }

    /**
     * Realiza la evaluación crediticia
     * @param data datos para realizar la evaluación crediticia
     */
    public evaluateClient(data: CreditEvaluation): Observable<any> {
        let jsondata = JSON.stringify(data);
        return this.httpClient.post(this.Url + "/" + this.accountStateManager + "/EvaluateClient", jsondata, { headers: this.headers });
    }

    /**
     * Habilita los movimientos del cliente
     * @param data datos para realizar la habilitación del cliente
     */
    public enableClientMovement(data: ClientEnablement): Observable<any> {
        let jsondata = JSON.stringify(data);
        return this.httpClient.post(this.Url + "/" + this.accountStateManager + "/EnableClientMovement", jsondata, { headers: this.headers });
    }

    /**
     * Obtiene datos del estado de cuenta del cliente
     * @param clientId Id de cliente
     */
    public getContractorState(clientId: string): Observable<ContractorState> {
        let params = { clientId: clientId }
        return this.httpClient.get<ContractorState>(this.Url + "/" + this.accountStateManager + "/GetContractorState", { params: params });
    }

    /**
     * Obtiene los días de morosidad del cliente
     * @param clientId Id de cliente
     */
    public getNonPerformingDays(clientId: string): Observable<any> {
        let params = { clientId: clientId }
        return this.httpClient.get(this.Url + "/" + this.accountStateManager + "/GetNonPerformingDays", { params: params });
    }
}
