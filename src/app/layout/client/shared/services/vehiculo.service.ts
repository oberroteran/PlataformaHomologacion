import { Injectable } from '@angular/core';
import { ConfigService } from '../../../../shared/services/general/config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../../../../shared/services/api.service';
import { Auto } from '../models/auto.model';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class VehiculoService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  // private headersfile = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});
  private headersfile = new HttpHeaders({ 'Content-Type': 'text/plain; charset=utf-8' });

  _baseUrl = '';
  constructor(private http: HttpClient,
    private api: ApiService,
    private configService: ConfigService) {
    this._baseUrl = configService.getWebApiURL();
  }

  /*getClases(filter: any) {
    const endpoint = 'classe';
    // const action = 'getclasse';
    const url = `${endpoint}`; // ${action}
    const data = JSON.stringify(filter);

    return this.api.post(url, data,this.headers);
  }
*/
  getClases(filter: any) {
    const body = JSON.stringify(filter);
    return this.http.post(this._baseUrl + '/Classe/classByModel', body, { headers: this.headers })
      .map(
        response => response,
        error => {
          console.log(error);
        },
      );
  }

  getMarcas(filter: any) {
    // console.log(uso);
    const body = JSON.stringify(filter);
    return this.http.post(this._baseUrl + '/brand/', body, { headers: this.headers })
      .map(
        response => response,
        error => {
          console.log(error);
        },
      );
  }

  getModelosPrincipales(filter: any) {
    // console.log(uso);
    const body = JSON.stringify(filter);
    return this.http.post(this._baseUrl + '/model/modelsByBrandClass/', body, { headers: this.headers })
      .map(
        response => response, // .json(),
        error => {
          console.log(error);
        },
      );
  }

  getModelos(filter: any) {
    // console.log(uso);
    const body = JSON.stringify(filter);
    return this.http.post(this._baseUrl + '/model/modelByBrand/', body, { headers: this.headers })
      .map(
        response => response, // .json(),
        error => {
          console.log(error);
        },
      );
  }

  getModelosByBrandClass(filter: any) {
    // console.log(uso);
    const body = JSON.stringify(filter);
    return this.http.post(this._baseUrl + '/model/versionByBrandClass/', body, { headers: this.headers })
      .map(
        response => response, // .json(),
        error => {
          console.log(error);
        },
      );
  }


  getZonasCirculacion(filter: any) {
    // console.log(uso);
    const body = JSON.stringify(filter);

    return this.http.post(this._baseUrl + '/Zone/', body, { headers: this.headers })
      .map(
        response => response, // .json(),
        error => {
          console.log(error);
        },
      );
  }

  /*getMarcas(filter: any) {
    const endpoint = 'brand';
    // const action = 'getbrand';
    const url = `${endpoint}`; // ${action}

    const data = JSON.stringify(filter);

    return this.api.post(url, data);
  }*/
  /*
    getModelos(filter: any) {
      const endpoint = 'model';
      // const action = 'getmodel';
      const url = `${endpoint}`; // ${action}/${marcaId}
      const data = JSON.stringify(filter);

      return this.api.post(url, data);
    }

    getZonasCirculacion(filter: any) {
      const endpoint = 'zone';
      // const action = 'getzone';
      const url = `${endpoint}`; // /${action}
      const data = JSON.stringify(filter);

      return this.api.post(url, data);
    }*/

  validarPlaca(tipo: string, placa: string) {
    const endpoint = 'emission';
    const action = 'validarplaca';
    const url = `${endpoint}/${action}/${tipo}/${placa}`;

    return this.api.get(url);
  }

  informacionPlaca(canalVenta: string, tipo: string, placa: string) {
    const endpoint = 'emission';
    const action = 'datosplaca';
    const url = `${endpoint}/${action}/${canalVenta}/${tipo}/${placa}`;
    return this.api.get(url);
  }

  renovacionPlaca(placa: string) {
    const endpoint = 'emission';
    const action = 'renovacionplaca';
    const url = `${endpoint}/${action}/${placa}`;

    return this.api.get(url);
  }

  validarPlacaCampaign(codchannel: string, placa: string) {
    const endpoint = 'emission';
    const action = 'validarplacacampaign';
    const url = `${endpoint}/${action}/${codchannel}/${placa}`;

    return this.api.get(url);
  }

  registrar(vehiculo: any) {
    const endpoint = 'auto';
    const data = JSON.stringify(vehiculo);

    return this.http.post(this._baseUrl + '/Auto/', data, { headers: this.headers })
      .map(
        response => response, // .json(),
        error => {
          console.log(error);
        },
      );
    // return this.api.post(endpoint, data,this.headers);
  }

  obtenerVehiculo(id): Observable<Auto> {
    const endpoint = 'auto';
    const url = `${endpoint}/${id}`;

    return this.api.get(url);
  }

  obtenerCodigoCanal(key: string) {
    const endpoint = 'codechannel';
    const action = 'obtenercodechannel';
    const url = `${endpoint}/${action}/${key}`;
    // console.log(url);
    return this.api.get(url);
  }

  aplicarCupon(filter: any) {
    const endpoint = 'codechannel';
    const action = 'aplicarcupon';
    const url = `${endpoint}/${action}`;

    // console.log(url);
    // console.log(filter);

    // return this.api.postHeader(url, filter,this.headers);
    return this.api.post(url, filter);
  }
  LeerArchivo2(path) {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=ISO-8859-1');
    return this.http.get(path, { headers, responseType: 'text' });
  }


  registrarTracking(IdProceso, IdCliente, Prima) {
    // console.log('llamada register TRACKING');
    const endpoint = 'tracking';
    const action = 'registertracking';
    const url = `${endpoint}/${action}`;

    const data = {
      NIDPROCESS: IdProceso,
      NPREMIUM: Prima,
      NCLIENTID: IdCliente
    };
    return this.api.post(url, data);
    // return this.api.postHeader(url, data,this.headers);
  }

  LeerArchivo() {
    const endpoint = 'tool';
    const action = 'GetTerms';
    const url = `${endpoint}/${action}`;
    return this.api.get(url);
    /*

    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=ISO-8859-1');
      return this.http.get( path, { headers, responseType: 'text'} );*/



    // return  this.http.get(path, { responseType: 'text', headers: this.headersfile});
    /*
    responseType: 'text',
    */
    /*
    $http.get('resources/negozi.json',
    {headers : {'Content-Type' : 'application/json; charset=UTF-8'}
}).success(function(data) {
... code here
});

    */
    // return this.http.get('assets/template/terminos3.txt',{responseType: 'text');
  }

}

