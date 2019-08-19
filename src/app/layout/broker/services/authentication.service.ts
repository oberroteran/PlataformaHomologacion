import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../../../app.config';
import 'rxjs/add/operator/catch';
import { Features } from '../models/features';
import { isNullOrUndefined } from 'util';
import { SessionStorageService } from '../../../shared/services/storage/storage-service';


@Injectable()
export class AuthenticationService {
  public token: string;
  public firstName: string;
  public lastName: string;
  public canal: string;
  public puntoVenta: string;
  public desCanal: string;
  public desPuntoVenta: string;
  public tipoCanal: string;
  public menu: Features[] = [];

  constructor(
    private http: HttpClient,
    private config: AppConfig,
    private sessionStorageService: SessionStorageService) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http
      .post(
        this.config.apiUrl + '/user/authenticate',
        { username: username, password: password },
        { observe: 'response' }
      )
      .map(response => {
        const token = response.body && response.body['token'];
        const id = response.body && response.body['id'];
        const firstName = response.body && response.body['firstName'];
        const lastName = response.body && response.body['lastName'];
                const lastName2 = response.body && response.body["slastnamE2"]; // Kuntur 20180812
        const email = response.body && response.body['email'];
        const canal = response.body && response.body['canal'];
        const puntoVenta = response.body && response.body['puntoVenta'];
        const indpuntoVenta = response.body && response.body['puntoVenta'];
        const desCanal = response.body && response.body['descanal'];
        const desPuntoVenta = response.body && response.body['despuntoventa'];
        const tipoCanal = response.body && response.body['tipocanal'];
        const ncorredor = response.body && response.body["ncorredor"]; //
                const nintermed = response.body && response.body["nintermed"]; //
                const tdocument = response.body && response.body["stiP_DOC"]; //
                const dni = response.body && response.body["sdni"]; // 
                const sclient = response.body && response.body["sclient"]; //
        const menu = response.body && response.body['menu'];
        const brokerId = response.body && response.body['brokerId'];
        const intermediaId = response.body && response.body['intermediaId'];
                const permissionList = response.body && response.body["permissionList"]; //

        if (token) {
          this.token = token;
          this.sessionStorageService.clearStorage();
          this.sessionStorageService.setItem('puntoVentaCliente', puntoVenta);
          this.sessionStorageService.setItem('canalVentaCliente', canal);

          localStorage.setItem(
            'currentUser',
            JSON.stringify({
              id: id,
              username: username,
              token: token,
              firstName: firstName,
              lastName: lastName,
                            lastName2: lastName2,
              email: email,
              canal: canal,
              puntoVenta: puntoVenta,
              indpuntoVenta: indpuntoVenta,
              desCanal: desCanal,
              desPuntoVenta: desPuntoVenta,
              tipoCanal: tipoCanal,
                            ncorredor: ncorredor,
                            nintermed: nintermed,
                            tdocument: tdocument,
                            dni: dni,
                            sclient: sclient,
              menu: menu,
              brokerId: brokerId,
              intermediaId: intermediaId,
                            permissionList: permissionList
            })
          );
          return true;
        } else {
          return false;
        }
      });
  }

  public getToken(): string {
    let token = '';
    if (!isNullOrUndefined(JSON.parse(localStorage.getItem('currentUser')))) {
      token = JSON.parse(localStorage.getItem('currentUser'))['token'];
    }

    return token;
  }

  logout(): Observable<boolean> {
    const mHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.token,
      'Content-Type': 'application/json'
    });

    return this.http
      .post(this.config.apiUrl + '/user/logout', {}, { headers: mHeaders })
      .map(() => {
        this.removeSession();
        return true;
      },
        () => {
          return false;
        }
      );
  }

  removeSession() {
    this.token = null;
    this.firstName = null;
    this.lastName = null;
    this.canal = null;
    this.puntoVenta = null;
    this.menu = null;
    this.desCanal = null;
    this.desPuntoVenta = null;
    this.tipoCanal = null;
    this.sessionStorageService.clearStorage();
	//localStorage.removeItem("currentUser");
        //localStorage.removeItem("productUser");
	//localStorage.removeItem("systemUser");
  }
}