import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../app.config';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css', './inicio.component.mobile.css']
})
export class InicioComponent implements OnInit {

  constructor(private appConfig: AppConfig) {
    this.appConfig.registerPageSecond('0');
    this.appConfig.registerPageInitial('1');
  }

  ngOnInit() {
    sessionStorage.removeItem('placa');
    sessionStorage.removeItem('auto');
    sessionStorage.removeItem('contratante');
    sessionStorage.removeItem('certificado');

    sessionStorage.removeItem('referenceChannel');
    sessionStorage.removeItem('validaCampaign');
    sessionStorage.removeItem('pagina');
    sessionStorage.removeItem('canalVentaCliente');
    sessionStorage.removeItem('puntoVentaCliente');
  }
}
