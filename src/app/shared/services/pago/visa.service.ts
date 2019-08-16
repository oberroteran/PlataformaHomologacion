import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Cliente } from '../../../layout/broker/models/cliente/cliente';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class VisaService {
  endpoint = 'pago';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private api: ApiService) { }

  generarSessionToken(monto, userId) {
    const action = 'visasessiontoken';
    const url = `${this.endpoint}/${action}`;

    const data = {
      Amount: monto,
      UserId: userId
    };
    return this.api.postHeader(url, data, this.headers);
  }

  autorizarTransaccion(
    transactionToken,
    sessionToken,
    processId,
    planillaId,
    flujoId,
    userId,
    cliente: Cliente
  ) {
    const action = 'visaauthorization';
    const url = `${this.endpoint}/${action}`;

    const data = {
      TransactionToken: transactionToken,
      SessionToken: sessionToken,
      ProcesoId: processId,
      PlanillaId: planillaId,
      FlujoId: flujoId,
      UserId: userId,
      // PDF Information
      Pdf_Email: cliente == null ? '' : cliente.p_SMAIL,
      Pdf_CustomerName:
        cliente == null
          ? ''
          : cliente.p_SCLIENT_NAME +
          ' ' +
          cliente.p_SCLIENT_APPPAT +
          ' ' +
          cliente.p_SCLIENT_APPMAT,
      Pdf_PhoneNumber: cliente == null ? '' : cliente.p_SPHONE,
      Pdf_Canal: cliente == null ? '' : cliente.p_SCANAL
    };

    return this.api.post(url, data);
  }
}
