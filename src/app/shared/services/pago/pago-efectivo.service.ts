import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
@Injectable()
export class PagoEfectivoService {
  endpoint = 'pago';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private api: ApiService) { }

  generarCip(nombres,
    apellidos,
    correo,
    monto,
    procesoId,
    planillaId,
    flujoId,
    usuario) {
    const action = 'generarcip';
    const url = `${this.endpoint}/${action}`;

    const data = {
      Nombres: nombres,
      Apellidos: apellidos,
      Correo: correo,
      Total: monto,
      ProcesoId: procesoId,
      PlanillaId: planillaId,
      FlujoId: flujoId,
      Usuario: usuario
    };
    return this.api.postHeader(url, data, this.headers);
  }
}
