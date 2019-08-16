import { Injectable } from '@angular/core';
import { ConfigService } from '../../../../shared/services/general/config.service';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommissionLot } from '../../models/CommissionLot/commissionlot';
import { CommissionLotFilter } from '../../models/commissionlot/commissionlotfilter';
import { CommissionLotState } from '../../models/commissionlot/commissionlotstate';
import { CommissionState } from '../../models/commissionlot/commissionstate';
import { TableType } from '../../models/commissionlot/tabletype';
import { CommissionLotCab } from '../../models/commissionlot/commissionlotcab';
import { ApiService } from '../../../../shared/services/api.service';
import { CommissionLotExactus } from '../../models/commissionlot/commissionlotexactus';

@Injectable()
export class CommissionLotService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  list: any = [];
  _baseUrl = '';

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private api: ApiService
  ) {
    this._baseUrl = configService.getWebApiURL();
  }

  getPostListCommissionLot(commissionlot: CommissionLot) {
    // console.log('ingreso a llamar al metodo');
    const body = JSON.stringify(commissionlot);
    // console.log(body);
    return this.http
      .post(this._baseUrl + '/CommissionLot/getcommissionlot', body, {
        headers: this.headers
      })
      .map(
        response => response,
        error => {
          console.log(error);
        }
      );
  }

  GetCommissionLotGeneral(commissionLotcab: CommissionLotFilter) {
    const body = JSON.stringify(commissionLotcab);
    return this.http
      .post(this._baseUrl + '/CommissionLot/getcommissionlotgeneral', body, {
        headers: this.headers
      })
      .map(
        response => response,
        error => {
          console.log(error);
        }
      );
  }

  getPostCertificateCommission(commissionlotFilter: CommissionLotFilter) {
    // console.log('ingreso a llamar al metodo'); prueba
    const body = JSON.stringify(commissionlotFilter);
    // console.log(body);
    return this.http
      .post(this._baseUrl + '/CommissionLot/getcertificatecommission', body, {
        headers: this.headers
      })
      .map(
        response => response,
        error => {
          console.log(error);
        }
      );
  }

  getCommissionLotHist(commissionLotfilter: CommissionLotFilter) {
    const body = JSON.stringify(commissionLotfilter);
    return this.http
      .post(this._baseUrl + '/CommissionLot/getcommissionlothist', body, {
        headers: this.headers
      })
      .map(
        response => response,
        error => {
          console.log(error);
        }
      );
  }

  SaveCommissionLot(commissionlotcab: CommissionLotCab) {
    const fileKey = 'faaf';
    const body = JSON.stringify(fileKey);
    // console.log('SaveCommissionLot');
    // console.log(commissionlotcab);
    //console.log(fileToUpload);
    // debugger;
    const formData: FormData = new FormData();
    formData.append('NQUANTITY', commissionlotcab.NQUANTITY.toString());
    formData.append('NID_COMMLOT', commissionlotcab.NID_COMMLOT.toString());
    formData.append('NIDSTATE', commissionlotcab.NIDSTATE.toString());
    formData.append('SREGISTER', commissionlotcab.SREGISTER.toString());
    formData.append('NAMOUNTTOTAL', commissionlotcab.NAMOUNTTOTAL.toString());
    formData.append('NAMOUNTIGV', commissionlotcab.NAMOUNTIGV.toString());
    formData.append('NAMOUNTNETO', commissionlotcab.NAMOUNTNETO.toString());
    formData.append('SIDCOMLOT', commissionlotcab.SIDCOMLOT.toString());
    formData.append('SDESCRIPTION', commissionlotcab.SDESCRIPTION.toString());
    formData.append('SSERIE', commissionlotcab.SSERIE);
    formData.append('SBILLNUM', commissionlotcab.SBILLNUM.toString());
    formData.append('NTYPEDOC', commissionlotcab.NTYPEDOC.toString());
    formData.append('NBRANCH', commissionlotcab.NBRANCH.toString());
    formData.append('SRUC', commissionlotcab.SRUC.toString());
    formData.append('SACCOUNT', commissionlotcab.SACCOUNT.toString());
    formData.append('SCCI', commissionlotcab.SCCI.toString());
    formData.append('SCODCHANNEL', commissionlotcab.SCODCHANNEL.toString());
    formData.append('SOBSERVACION', commissionlotcab.sobservacion.toString());
    formData.append('NBANK', commissionlotcab.NBANK.toString());
    formData.append('NTYPEACCOUNT', commissionlotcab.NTYPEACCOUNT.toString());

    // formData.append('fileattach', commissionlotcab.LISTCOMMISSIONLOTATTACH[0].fileattach, commissionlotcab.LISTCOMMISSIONLOTATTACH[0].fileattach.name);
    //  console.log('fileattach', commissionlotcab.LISTCOMMISSIONLOTATTACH[0].fileattach, commissionlotcab.LISTCOMMISSIONLOTATTACH[0].fileattach.name);
    //console.log('fileupload', fileToUpload, fileToUpload.name);
    // formData.append("LISTCOMMISSIONLOTDETAIL + '[' + npolicy + ']", "50");
    //  formData.append("LISTCOMMISSIONLOTDETAIL + '[' + npolicy + ']", "80");
    //formData.append('LISTCOMMISSIONLOTDETAIL', JSON.stringify(commissionlotcab.LISTCOMMISSIONLOTDETAIL));//, fileToUpload.name);
    //formData.append('LISTCOMMISSIONLOTATTACH', JSON.stringify(commissionlotcab.LISTCOMMISSIONLOTATTACH));//, fileToUpload.name);
    // this.AppendArrayCFile(formData, commissionlotcab, 'data');
    //debugger;

    for (let i = 0; i < commissionlotcab.fileattach.length; i++) {
      formData.append(
        'fileattach',
        commissionlotcab.fileattach[i],
        commissionlotcab.fileattach[i].name
      );
    }

    debugger;

    for (let e = 0; e < commissionlotcab.LISTCOMMISSIONLOTDETAIL.length; e++) {
      formData.append(
        'LISTCOMMISSIONLOTDETAIL[' + e + '][npolicy]',
        commissionlotcab.LISTCOMMISSIONLOTDETAIL[e].npolicy
      );
      formData.append(
        'LISTCOMMISSIONLOTDETAIL[' + e + '][NPRODUCT]',
        commissionlotcab.LISTCOMMISSIONLOTDETAIL[e].nproduct
      );
      formData.append(
        'LISTCOMMISSIONLOTDETAIL[' + e + '][NBRANCH]',
        commissionlotcab.LISTCOMMISSIONLOTDETAIL[e].nbranch
      );
      formData.append(
        'LISTCOMMISSIONLOTDETAIL[' + e + '][SCERTYPE]',
        commissionlotcab.LISTCOMMISSIONLOTDETAIL[e].scertype
      );
      formData.append(
        'LISTCOMMISSIONLOTDETAIL[' + e + '][NCERTIF]',
        commissionlotcab.LISTCOMMISSIONLOTDETAIL[e].ncertif
      );
      formData.append(
        'LISTCOMMISSIONLOTDETAIL[' + e + '][NRECEIPT]',
        commissionlotcab.LISTCOMMISSIONLOTDETAIL[e].nreceipt
      );
      formData.append(
        'LISTCOMMISSIONLOTDETAIL[' + e + '][NUSERREGISTER]',
        commissionlotcab.LISTCOMMISSIONLOTDETAIL[e].nuserregister
      );
    }
    for (let e = 0; e < commissionlotcab.LISTCOMMISSIONLOTATTACH.length; e++) {
      formData.append(
        'LISTCOMMISSIONLOTATTACH[' + e + '][NID_COMMLOT_ATTACH]',
        commissionlotcab.LISTCOMMISSIONLOTATTACH[e].NID_COMMLOT_ATTACH
      );
      // formData.append("LISTCOMMISSIONLOTATTACH["+e+"][fileattach]",commissionlotcab.LISTCOMMISSIONLOTATTACH[e].fileattach,commissionlotcab.LISTCOMMISSIONLOTATTACH[e].fileattach.name);
    }

    /*for (let e = 0; e < commissionlotcab.LISTCOMMISSIONLOTDETAIL.length; e++) {
      formData.append("LISTCOMMISSIONLOTDETAIL[0][sbranch]","ramo");
     }*/


    return this.http.post(
      this._baseUrl + '/commissionlot/savecommission',
      formData
    );
    // .subscribe(response => { console.log(response); })
  }

  getUploadedFile(id) {
    // id = 13;
    // id = 31;

    const url = `${id}`;
    const c = new CommissionLotFilter('', '', 0, 0, id, '', '', 0, 0, 0, '');
    const body = JSON.stringify(c);

    // console.log('ingreso llamada');
    // console.log(body);
    // console.log(this._baseUrl);

    return this.http
      .post(this._baseUrl + '/commissionlot/dowloadfile', body)
      .map(
        response => response,
        error => {
          console.log(error);
        }
      );

    /*  return this.http.get(this._baseUrl + '/commissionlot/dowloadfile/' + url).subscribe(
        response =>{ response
          console.log('termino trajo el archivo');
        },
        error => {
          console.log(error);
        });   */
    // let headers = new HttpHeaders().append("Authorization", "Bearer " + token)
  }

  generarLotePdf(numeroLote: number) {
    const endpoint = 'commissionlot';
    const action = 'GetDetailLotPdf';
    const url = `${endpoint}/${action}/${numeroLote}`;

    // console.log(numeroLote);

    return this.api.get(url);
  }

  AppendArrayCFile(form_data: FormData, values, name) {
    // debugger;
    if (!values && name) { form_data.append(name, ''); }
    else {
      if (typeof values == 'object') {
        for (let key in values) {
          if (key == 'fileattach') {
            form_data.append('[' + key + ']', values[key], values[key].name);
            // console.log('[' + key + ']' + '  ' + values[key], values[key].name);
          }
          // formData.append('fileattach', fileToUpload, fileToUpload.name);
          else {
            if (typeof values[key] == 'object') {
              this.AppendArrayCFile(
                form_data,
                values[key],
                name + '[' + key + ']'
              );
            }
            else {
              form_data.append('[' + key + ']', values[key]);
              // console.log('[' + key + ']' + '  ' + values[key]);
            }
          }
        }
      } // else
      //  form_data.append(name, values);
    }
    return form_data;
  }

  AppendArray(form_data: FormData, values, name) {
    // debugger;
    if (!values && name) {
      //  form_data.append(name, "");
      console.log('dsa');
    }
    else {
      if (typeof values == 'object') {
        for (let key in values) {
          if (key == 'fileattach') {
            /*form_data.append(name + '[' + key + ']', values[key], values[key].name);*/
            console.log(name + '[' + key + ']');
            console.log(values[key]);
            console.log(values[key].name);
          } else {
            if (typeof values[key] == 'object') {
              this.AppendArray(form_data, values[key], name + '[' + key + ']');
            } else {
              form_data.append(name + '[' + key + ']', values[key]);
            }
          }
        }
      } // else
      //  form_data.append(name, values);
    }
    return form_data;
  }

  getCommissionLotState(commissionlot: CommissionLotState) {
    // console.log('ingreso a llamar al metodo');
    const body = JSON.stringify(commissionlot);
    return this.http
      .post(this._baseUrl + '/CommissionLot/getcommissionlotstate', body, {
        headers: this.headers
      })
      .map(
        response => response,
        error => {
          console.log(error);
        }
      );
  }

  updCommissionLotState(commissionlot: CommissionLotFilter) {
    // console.log('ingreso a llamar al metodo');
    const body = JSON.stringify(commissionlot);
    return this.http
      .post(this._baseUrl + '/CommissionLot/updcommlotstate', body, {
        headers: this.headers
      })
      .map(
        response => response,
        error => {
          console.log(error);
        }
      );
  }

  getCommissionState(commissionlot: CommissionState) {
    // console.log('ingreso a llamar al metodo');
    const body = JSON.stringify(commissionlot);
    return this.http
      .post(this._baseUrl + '/CommissionLot/getcommissionstate', body, {
        headers: this.headers
      })
      .map(
        response => response,
        error => {
          console.log(error);
        }
      );
  }

  getCommissionLotStateApprob(commissionlot: CommissionLotState) {
    // console.log('ingreso a llamar al metodo');
    const body = JSON.stringify(commissionlot);
    return this.http
      .post(this._baseUrl + '/CommissionLot/getcommlotstateaproba', body, {
        headers: this.headers
      })
      .map(
        response => response,
        error => {
          console.log(error);
        }
      );
  }

  getBranch(tablet: TableType) {
    const body = JSON.stringify(tablet);
    return this.http
      .post(this._baseUrl + '/Tool/getbranch', body, { headers: this.headers })
      .map(
        response => response,
        error => {
          console.log(error);
        }
      );
  }
  getPostAnularLote(paryrollcab: CommissionLot) {
    const body = JSON.stringify(paryrollcab);
    return this.http
      .post(this._baseUrl + '/CommissionLot/anularlote', body, {
        headers: this.headers
      })
      .map(
        response => response,
        error => {
          console.log(error);
        }
      );
  }

  getPostEnviarExactus(exactuscab: CommissionLotExactus) {
    const body = JSON.stringify(exactuscab);
    return this.http
      .post(this._baseUrl + '/CommissionLot/enviarexactus', body, {
        headers: this.headers
      })
      .map(
        response => response,
        error => {
          console.log(error);
        }
      );
  }

  getVoucherType(tablet: TableType) {
    const body = JSON.stringify(tablet);
    return this.http
      .post(this._baseUrl + '/Tool/getvouchertype', body, {
        headers: this.headers
      })
      .map(
        response => response,
        error => {
          console.log(error);
        }
      );
  }

  getAccountType(tablet: TableType) {
    const body = JSON.stringify(tablet);
    return this.http
      .post(this._baseUrl + '/Tool/getaccounttype', body, {
        headers: this.headers
      })
      .map(
        response => response,
        error => {
          console.log(error);
        }
      );
  }


  deleteFileAttach(id: Number) {
    const endpoint = 'commissionlot';
    const action = 'DeleteFileAttach';
    const url = `${endpoint}/${action}/${id}`;

    // console.log('invocar servicio eliminar');

    return this.api.get(url);
  }

}




/*
var datosValidadores = fichaeventocontacto.contactosModel.getJson().length == 0 ? false : fichaeventocontacto.contactosModel.getJson();
                    baseFile.AppendArray(formData, datosValidadores, 'Contactos');


					  AppendArray: function (form_data, values, name) {
        if (!values && name)
            form_data.append(name, "");
        else {
            if (typeof values == 'object') {
                for (key in values) {
                    if (typeof values[key] == 'object')
                        baseFile.AppendArray(form_data, values[key], name + '[' + key + ']');
                    else
                        form_data.append(name + '[' + key + ']', values[key]);
                }
            } else
                form_data.append(name, values);
        }
        return form_data;
*/
