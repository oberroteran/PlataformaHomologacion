import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppConfig } from "../../../../app.config";
import { Observable } from 'rxjs';
import { DocumentType } from '../../models/shared/client-information/document-type'
import { PersonType } from '../../models/shared/client-information/person-type';
import { Nacionality } from '../../models/shared/client-information/nationality-type';
import { Gender } from '../../models/shared/client-information/gender-type';
import { CivilStatus } from '../../models/shared/client-information/civilStatus-type';
import { Profession } from '../../models/shared/client-information/profession-type';
import { EconomicActivity } from '../../models/shared/client-information/economic-activity';
import { PhoneType } from '../../models/shared/client-information/phone-type';
import { CityCode } from '../../models/shared/client-information/city-code';
import { EmailType } from '../../models/shared/client-information/email-type';
import { DirectionType } from '../../models/shared/client-information/direction-type';
import { RoadType } from '../../models/shared/client-information/road-type';
import { InteriorType } from '../../models/shared/client-information/interior-type';
import { BlockType } from '../../models/shared/client-information/block-type';
import { CJHTType } from '../../models/shared/client-information/cjht-type';
import { Country } from '../../models/shared/client-information/country';
import { Currency } from '../../models/shared/client-information/currency-type';
import { Response } from '../../models/shared/client-information/response';
import { ClientDataToSearch } from '../../models/shared/client-information/client-data-to-search';
import { Tariff } from '../../models/shared/client-information/tariff';


@Injectable({
    providedIn: 'root'
})
export class ClientInformationService {
    private headers = new HttpHeaders({ "Content-Type": "application/json" });
    private Url = AppConfig.URL_API_SCTR;
    private UrlGestor = AppConfig.URL_API_GESTOR;
    
    constructor(private http: HttpClient) { }

    public getDocumentTypeList(): Observable<DocumentType[]> { //listar tipos de documento a usar
        return this.http.get<DocumentType[]>(this.Url + "/SharedManager/GetDocumentTypeList");
    }
    public getPersonTypeList(): Observable<PersonType[]> { //listar tipos de persona a usar
        return this.http.get<PersonType[]>(this.Url + "/SharedManager/GetPersonTypeList");
    }
    public getNationalityList(): Observable<Nacionality[]> { //listar nacionalidades a usar
        return this.http.get<Nacionality[]>(this.Url + "/SharedManager/GetNationalityList");
    }
    public getGenderList(): Observable<Gender[]> { //listar generos a usar
        return this.http.get<Gender[]>(this.Url + "/SharedManager/GetGenderList");
    }
    public getCivilStatusList(): Observable<CivilStatus[]> { //listar estado civil a usar
        return this.http.get<CivilStatus[]>(this.Url + "/SharedManager/GetCivilStatusList");
    }
    public getProfessionList(): Observable<Profession[]> { //listar profesiones a usar
        return this.http.get<Profession[]>(this.Url + "/SharedManager/GetProfessionList");
    }
    public getTechnicalActivityList(): Observable<any> {
        return this.http.get<any>(this.Url + "/SharedManager/GetTechnicalActivityList");
    }
    public getEconomicActivityList(technicalActivityId: string): Observable<EconomicActivity[]> { //listar actividad economica a usar
        let params = { technicalActivityId: technicalActivityId }
        return this.http.get<EconomicActivity[]>(this.Url + "/SharedManager/GetEconomicActivityList", { params: params });
    }
    public getPhoneTypeList(): Observable<PhoneType[]> { //lista tipos de telefonos
        return this.http.get<PhoneType[]>(this.Url + "/SharedManager/GetPhoneTypeList");
    }
    public getCityCodeList(): Observable<CityCode[]> { // Lista codigos de area -- Peru
        return this.http.get<CityCode[]>(this.Url + "/SharedManager/GetCityCodeList");
    }
    public getEmailTypeList(): Observable<EmailType[]> { //Lista tipos de email
        return this.http.get<EmailType[]>(this.Url + "/SharedManager/GetEmailTypeList");
    }
    public getDirectionTypeList(): Observable<DirectionType[]> { // Lista tipos de direccion
        return this.http.get<DirectionType[]>(this.Url + "/SharedManager/GetDirectionTypeList");
    }
    public getRoadTypeList(): Observable<RoadType[]> { // Lista tipos de calle
        return this.http.get<RoadType[]>(this.Url + "/SharedManager/GetRoadTypeList");
    }
    public getInteriorTypeList(): Observable<InteriorType[]> {//
        return this.http.get<InteriorType[]>(this.Url + "/SharedManager/GetInteriorTypeList");
    }
    public getBlockTypeList(): Observable<BlockType[]> {
        return this.http.get<BlockType[]>(this.Url + "/SharedManager/GetBlockTypeList");
    }
    public getCJHTTypeList(): Observable<CJHTType[]> {
        return this.http.get<CJHTType[]>(this.Url + "/SharedManager/GetCJHTTypeList");
    }
    public getCountryList(): Observable<Country[]> {
        return this.http.get<Country[]>(this.Url + "/SharedManager/GetCountryList");
    }
    public getCurrencyList(): Observable<Currency[]> {
        return this.http.get<Currency[]>(this.Url + "/SharedManager/GetCurrencyList");
    }
    public getCiiuList(): Observable<any[]> {
        return this.http.get<any[]>(this.Url + "/SharedManager/GetCiiuList");
    }
    public getProductList(): Observable<any[]> {
        return this.http.get<any[]>(this.Url + "/SharedManager/GetProducts");
    }
    public getContactTypeList(data: Response): Observable<any> {
        const request = JSON.stringify(data);
        return this.http
            .post(
                this.Url + "/SharedManager/GetContactTypeList", request, {
                    headers: this.headers
                });
    }

    public valPhone(data: Response): Observable<any> {
        const request = JSON.stringify(data);
        return this.http
            .post(
                this.Url + "/SharedManager/ValPhone", request, {
                    headers: this.headers
                });
    }
    public ValCiiu(data: Response): Observable<any> {
        const request = JSON.stringify(data);
        return this.http
            .post(
                this.Url + "/SharedManager/ValCiiu", request, {
                    headers: this.headers
                });
    }
    public ValEmail(data: Response): Observable<any> {
        const request = JSON.stringify(data);
        return this.http
            .post(
                this.Url + "/SharedManager/ValEmail", request, {
                    headers: this.headers
                });
    }
    public ValStreet(data: Response): Observable<any> {
        const request = JSON.stringify(data);
        return this.http
            .post(
                this.Url + "/SharedManager/ValStreet", request, {
                    headers: this.headers
                });
    }
    public ValContact(data: Response): Observable<any> {
        const request = JSON.stringify(data);
        return this.http
            .post(
                this.Url + "/SharedManager/ValContact", request, {
                    headers: this.headers
                });
    }
    public insertContract(data: Response): Observable<any> {
        const request = JSON.stringify(data);
        return this.http
            .post(
                this.UrlGestor + "/Cliente/GestionarCliente", request, {
                    headers: this.headers
                });
    }
    public getClientInformation(_clientData: ClientDataToSearch): Observable<any> {
        const body = JSON.stringify(_clientData);
        return this.http.post(this.UrlGestor + "/Cliente/GestionarCliente", body, {
            headers: this.headers
        });
    }
    public getTariff(data: Tariff): Observable<any> {
        const body = JSON.stringify(data);
        //console.log(body);
        return this.http.post(this.Url + "/QuotationManager/GetTariff", body, {
            headers: this.headers
        });
    }
    public insertQuotation(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + "/QuotationManager/InsertQuotation", body, {
            headers: this.headers
        });
    }
}
