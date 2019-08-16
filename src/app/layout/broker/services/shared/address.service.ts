import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { AppConfig } from "../../../../app.config";
import { Observable } from 'rxjs';
import { District } from '../../models/shared/address/district';
import { Province } from '../../models/shared/address/province';
import { Department } from '../../models/shared/address/department';
@Injectable({
    providedIn: 'root'
})
export class AddressService {
    private Url = AppConfig.URL_API_SCTR;
    constructor(private http: HttpClient) { }

    public getDistrictList(_provinceId: number): Observable<District[]> {
        let data = { provinceId: _provinceId.toString() };
        return this.http.get<District[]>(this.Url + "/SharedManager/GetDistrictList", { params: data });
    }
    public getProvinceList(_departmentId: number): Observable<Province[]> {
        let data = { departmentId: _departmentId.toString() };
        return this.http.get<Province[]>(this.Url + "/SharedManager/GetProvinceList", { params: data });
    }
    public getDepartmentList(): Observable<Department[]> {
        return this.http.get<Department[]>(this.Url + "/SharedManager/GetDepartmentList");
    }
}
