import { Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { Contratante } from '../models/contratante.model';
import { Sisweb } from '../../../../shared/models/sisweb/sisweb';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class EmisionService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private api: ApiService) { }

  obtenerTarifa(filter: any) {
    const endpoint = 'emission';
    const action = 'obtenerprima';
    const url = `${endpoint}/${action}`;
    const data = JSON.stringify(filter);

    return this.api.postHeader(url, data, this.headers);
  }

  obtenerPlanes(filter: any) {
    const endpoint = 'emission';
    const action = 'obtenerplanes';
    const url = `${endpoint}/${action}`;

    const data = JSON.stringify(filter);
    // console.log('obtenerPlanes-->' +  data);
    return this.api.postHeader(url, data, this.headers);
  }

  UpdatePolicyNuevoProcessId(IdProceso, canal, puntoVenta) {
    const endpoint = 'emissionproc';
    const action = 'ActualizarNuevoCertificadoInProccesId';
    const url = `${endpoint}/${action}`;
    // debugger;
    const data = {
      P_CANAL: canal,
      P_PUNTOVENTA: puntoVenta,
      P_PROCESSID: IdProceso,
      NPOLESP_COMP: 0,
      P_RESULT: 0
    };

    return this.api.post(url, data);
  }

  registrarEmision(IdProceso) {
    const endpoint = 'emissionproc';
    const action = 'EmissionProcessPolicy';
    const url = `${endpoint}/${action}`;

    const data = {
      NIDPROCESS: IdProceso
    };

    return this.api.postHeader(url, data, this.headers);
  }


  processValidatePoliza(IdProceso) {
    const endpoint = 'emissionproc';
    const action = 'EmissionProcessValidatePolicy';
    const url = `${endpoint}/${action}`;

    const data = {
      NIDPROCESS: IdProceso
    };

    return this.api.postHeader(url, data, this.headers);
  }

  changeStatePoliza(numeroPoliza, nuevoEstado) {
    const endpoint = 'emissionproc';
    const action = 'EmissionChangeStatePolicy';
    const url = `${endpoint}/${action}`;

    const data = {
      NUMPOLICY: numeroPoliza,
      NSTATE: nuevoEstado
    };

    return this.api.postHeader(url, data, this.headers);
  }


  emissionProcessCompletePolicy(
    transactionToken,
    sessionToken,
    processId,
    planillaId,
    flujoId,
    userId,
    tipoPago,
    nombres,
    apellidos,
    correo,
    total,
    cliente: Contratante,
    canal,
    puntoDeVenta,
    modalidad
  ) {
    const endpoint = 'emissionproc';
    const action = 'emissionprocesscompletepolicy';
    const url = `${endpoint}/${action}`;
    console.log(url)
    // const oSisweb = new Sisweb();

    const customerName =
      cliente.p_SCLIENT_NAME +
      ' ' +
      cliente.p_SCLIENT_APPPAT.trim() +
      ' ' +
      cliente.p_SCLIENT_APPMAT.trim();

    const data = {
      TransactionToken: transactionToken,
      SessionToken: sessionToken,
      ProcesoId: processId,
      PlanillaId: planillaId,
      FlujoId: flujoId,
      UserId: userId,
      TipoPago: tipoPago,
      Nombres: nombres,
      Apellidos: apellidos,
      Correo: correo,
      Total: total,
      // PDF Information ---------------------
      Pdf_Email: cliente.p_SMAIL,
      Pdf_CustomerName: customerName,
      Pdf_PhoneNumber: cliente.p_SPHONE,
      CodigoCanal: canal,
      CodigoPuntoDeVenta: puntoDeVenta,
      Modalidad: modalidad,
      ChannelCode: sessionStorage.getItem('referenteCode')
    };
    console.log(data)
    //return;
    return this.api.post(url, data);
  }

  generarPolizaDigitalPdf(numeroPoliza: number) {
    const endpoint = 'Certificado';
    const action = 'GetConstanciaPDF';
    const url = `${endpoint}/${action}/${numeroPoliza}`;
    return this.api.get(url, {
      responseType: 'text'
    });
  }

  generarPolizaPdf(numeroPoliza: number) {
    const endpoint = 'emissionproc';
    const action = 'GetPolicyPdf';
    const url = `${endpoint}/${action}/${numeroPoliza}`;

    return this.api.get(url);
  }




  validarInicioVigencia(placa: string, fecha: string) {
    const endpoint = 'emission';
    const action = 'vigencia';
    const url = `${endpoint}/${action}/${placa}/${fecha}`;

    return this.api.get(url);
  }

  autoPorPlaca(placa: string) {
    const endpoint = 'emission';
    const action = 'auto';
    const url = `${endpoint}/${action}/${placa}`;

    return this.api.get(url);
  }

  clientePorDocumento(tipo: string, numero: string) {
    const endpoint = 'emission';
    const action = 'cliente';
    const url = `${endpoint}/${action}/${tipo}/${numero}`;

    return this.api.get(url);
  }

  RenovacionDocumento(tipo: string, numero: string) {
    const endpoint = 'emission';
    const action = 'renovaciondocumento';
    const url = `${endpoint}/${action}/${tipo}/${numero}`;

    return this.api.get(url);
  }

  validarDocumentoCampaign(codchannel: string, tipo: string, numero: string) {
    const action = 'validardocumentocampaign';
    const endpoint = 'emission';
    const url = `${endpoint}/${action}/${codchannel}/${tipo}/${numero}`;

    return this.api.get(url);
  }

  validarBloqueoVenta(canalId) {
    const endpoint = 'emission';
    const action = 'bloqueoventa';
    const url = `${endpoint}/${action}/${canalId}`;

    return this.api.get(url);
  }

  registrarTracking(IdProceso, IdCliente, Prima) {
    const endpoint = 'tracking';
    const action = 'registertracking';
    const url = `${endpoint}/${action}`;
    // console.log('prima');
    // console.log(Prima);
    const data = {
      NIDPROCESS: IdProceso,
      NPREMIUM: Prima,
      NCLIENTID: IdCliente
    };
    return this.api.post(url, data);
    // return this.api.postHeader(url, data,this.headers);
  }

  obtenerTarifarios(filter: any) {
    const endpoint = 'emission';
    const action = 'obtenertarifarios';
    const url = `${endpoint}/${action}`;
    const data = JSON.stringify(filter);

    return this.api.postHeader(url, data, this.headers);
  }

}
