import { HeaderComponent } from './../../../../shared/components/header/header.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { VehiculoService } from '../../shared/services/vehiculo.service';
import { Auto } from '../../shared/models/auto.model';
import { Campaign } from '../../../../shared/models/campaign/campaign';
import { ReferenceChannel } from '../../../../shared/models/referencechannel/referencechannel';
import { AppConfig } from '../../../../app.config';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { Logger } from '../../../../shared/models/logger/logger';
import { environment } from '../../../../../environments/environment';
import { isNullOrUndefined } from 'util';
import { SessionStorageService } from '../../../../shared/services/storage/storage-service';

@Component({
  selector: 'app-step01',
  templateUrl: './step01.component.html',
  styleUrls: ['./step01.component.css', './step01.component-mobile.css'],
  providers: [HeaderComponent]
})
export class Step01Component implements OnInit {
  @ViewChild('modalTerminosCondiciones', { static: true }) modalTerminosCondiciones;
  auto: Auto = new Auto();
  logger: Logger = new Logger(0, 'Emision Poliza', '', '', '', 0, new Date(), new Date(), 0, 0, '');
  referencechannel: ReferenceChannel = new ReferenceChannel();
  bTipoVehiculo = true;
  bPlacaOk = true;
  sTipoVehiculo = '1';
  bValido = false;
  bValidado = false;
  codigo = '';
  mensaje = '';
  placa = '';
  bValidar = false;
  bLoading = false;
  longitudPlaca = 6;
  ultimaPaginaNavegada = 0;
  paginaActual = 1;
  miAuto = 'assets/icons/soat_big_car.svg';
  urlCanal = '';
  URL: string;
  var_data: string;
  pixelAnalytics;
  canalVenta: string;
  puntoVenta: string;


  bAceptarTerminos = false;
  texto1 = '';
  texto2 = '';
  texto3 = '';
  texto4 = '';
  texto5 = '';

  constructor(
    private router: Router,
    private vehiculoService: VehiculoService,
    private loggerService: LoggerService,
    private appConfig: AppConfig,
    private cmpHeader: HeaderComponent,
    private sessionStorageService: SessionStorageService
  ) { }

  ngOnInit() {
    sessionStorage.setItem('pagefrom', 'Step01Component');
    this.aceptarTerminos();
    this.leerArchivo();

    this.URL = this.router.url;
    const url_data = this.URL.indexOf('?code=');
    const url_complemento = this.URL.indexOf('&');

    if (url_data >= 0) {
      if (url_complemento >= 0) {
        this.var_data = this.URL.substr(this.URL.indexOf('?code='), this.URL.indexOf('&') - this.URL.indexOf('?code='));
        this.obtenerDatosCanal(this.var_data.replace('?code=', ''));
        const var_ini = this.URL.substr(0, this.URL.indexOf('?code=') + 1);
        const var_fin = this.URL.substr(this.URL.indexOf('&') + 1, this.URL.length);
        window.location.href = './' + var_ini + var_fin;
      } else {
        this.var_data = this.URL.substr(this.URL.indexOf('?code='), this.URL.length);
        this.obtenerDatosCanal(this.var_data.replace('?code=', ''));
        this.router.navigate(['client/placa']);
      }
    } else {
      this.obtenerCanalVenta();
    }
    this.initComponent();
  }

  initComponent() {
    window.scroll(0, 0);
    this.miAuto = 'assets/icons/soat_big_car.svg';
    this.validarNavegacion();
    const autoSession = <Auto>JSON.parse(sessionStorage.getItem('auto'));
    if (autoSession !== null) {
      this.auto = autoSession;
      this.placa = this.auto.p_SREGIST;
    }
  }

  private validarNavegacion() {
    const sessionUltimaPagina = sessionStorage.getItem('pagina');
    if (sessionUltimaPagina != null) {
      this.ultimaPaginaNavegada = +sessionUltimaPagina;
    }
  }

  onSetTipoVehiculo(tipo) {
    this.bTipoVehiculo = tipo;
    if (this.bTipoVehiculo) {
      this.sTipoVehiculo = '1';
      this.longitudPlaca = 6;
    } else {
      this.sTipoVehiculo = '2';
      this.longitudPlaca = 8;
    }
    this.placa = '';
  }

  addLogger() {
    this.loggerService.addLogger(this.logger).subscribe(
      data => { },
      error => {
        console.log(error);
      });
  }

  validarPlaca() {
    this.logger.smetod = 'validarPlaca';
    this.logger.dstartdate = new Date();
    this.logger.sdata = '{sTipoVehiculo:' + JSON.stringify(this.sTipoVehiculo) + ', placa:' + JSON.stringify(this.placa) + '}';
    this.bValidar = true;
    this.bLoading = true;
    this.bValido = false;
    this.bValidado = false;
    this.vehiculoService.informacionPlaca(this.canalVenta, this.sTipoVehiculo, this.placa).subscribe(
      data => {
        this.codigo = data.p_VALIDO;
        this.mensaje = data.p_MENSAJE;
        this.bLoading = false;
        this.bValidado = true;
        this.logger.sresponse = JSON.stringify(data);
        this.logger.nsuccess = Number(this.codigo);
        this.logger.serrordes = this.mensaje;
        if (this.codigo === '1') {
          const validaCampaign = new Campaign();
          validaCampaign.fechaCampaign = data.dexpirdat;
          validaCampaign.validaPlacaCampaign = data.nvalida;
          validaCampaign.nidcampaign = data.nidcampaign;
          sessionStorage.setItem('validaCampaign', JSON.stringify(validaCampaign));
          this.setDatosAuto(data);
          this.bPlacaOk = true;
          this.bValido = true;
          this.appConfig.pixelEvent('virtualEvent', 'SOAT Digital - Cliente - Paso 1', 'Validación satisfactoria', '(not available)');
          this.logger.nerrortype = 0;
          this.logger.denddate = new Date();
          this.addLogger();
        } else {
          this.bPlacaOk = false;
          this.bValidar = false;
          this.logger.nerrortype = 1;
          this.logger.denddate = new Date();
          this.addLogger();

          this.auto.p_STYPE_REGIST = this.sTipoVehiculo;
          this.auto.p_SREGIST = this.placa.toString().toUpperCase();
          sessionStorage.setItem('auto', JSON.stringify(this.auto));
          this.appConfig.pixelEvent('virtualEvent', 'SOAT Digital - Cliente - Paso 2', 'No Completado', '(not available)');
        }
      },
      error => {
        console.log(error);
        this.logger.nerrortype = 2;
        this.logger.serrordes = error;
        this.addLogger();
        this.bValidado = true;
        this.bValidar = false;
        this.bLoading = false;
        this.bPlacaOk = false;
        this.mensaje = 'No se pudo realizar la validación de la placa. Por favor vuelve a intentarlo.';
      }
    );
  }

  setDatosAuto(auto) {
    this.auto = auto;
    this.auto.p_STYPE_REGIST = this.sTipoVehiculo;
    this.auto.p_SREGIST = this.placa.toString().toUpperCase();
    sessionStorage.setItem('auto', JSON.stringify(this.auto));
    this.appConfig.pixelEvent('virtualEvent', 'SOAT Digital - Cliente - Paso 2', 'Completado', '(not available)');
    if (this.paginaActual > this.ultimaPaginaNavegada) {
      sessionStorage.setItem('pagina', this.paginaActual.toString());
    }
    setTimeout(() => {
      this.router.navigate(['client/vehiculo']);
    }, 500);
  }

  obtenerDatosCanal(key: string) {
    this.vehiculoService.obtenerCodigoCanal(key).subscribe(
      data => {
        if (data != null) {
          this.referencechannel.referenteCode = key;
          this.referencechannel.referenteCanal = data.scodchannel;
          this.referencechannel.referenteDesCanal = data.sdeschannel;
          this.referencechannel.referentePuntoVenta = data.scodsalepoint;
          this.referencechannel.referenteDesPuntoVenta = data.sdessalepoint;
          this.referencechannel.referenteTipoCanal = data.ntypechannel;
          this.referencechannel.referentePlaceholder = data.splaceholder;
          this.referencechannel.referenteOrigenPublicidad = '1';
          this.referencechannel.referentePlan = data.nidplan;
          if ((data.nidplan == null) || (data.nidplan === 0) || (data.nidplan === undefined)) {
            this.referencechannel.referenteAplicaCupon = '0';
          } else {
            this.referencechannel.referenteAplicaCupon = '1';
          }
          sessionStorage.setItem('referenceChannel', JSON.stringify(this.referencechannel));
          this.obtenerCanalVenta();
        }
      },
      error => {
        console.log(error);
        this.mensaje = 'No se pudo obtener los datos del canal. Por favor vuelve a intentarlo.';
      }
    );
  }

  private obtenerCanalVenta() {
    if (!isNullOrUndefined(this.referencechannel.referenteCanal) && this.referencechannel.referenteCanal !== '') {
      this.canalVenta = this.referencechannel.referenteCanal;
      this.puntoVenta = this.referencechannel.referentePuntoVenta;
    } else {
      this.canalVenta = environment.canaldeventadefault;
      this.puntoVenta = environment.puntodeventadefault;
    }
    this.sessionStorageService.setItem('puntoVentaCliente', this.puntoVenta);
    this.sessionStorageService.setItem('canalVentaCliente', this.canalVenta);
  }

  acceptTerms(event) {
    console.log(event);
    event.preventDefault();
    this.bAceptarTerminos = !this.bAceptarTerminos;
  }

  aceptarTerminos() {
    this.bAceptarTerminos = true;
    this.modalTerminosCondiciones.hide();
  }

  closeModalTerminos() {
    this.modalTerminosCondiciones.hide();
  }

  openModalTerminos() {
    this.modalTerminosCondiciones.show();

  }

  leerArchivo() {
    this.vehiculoService.LeerArchivo().subscribe(data => {
      this.texto1 = data.texto1;
      this.texto2 = data.texto2;
      this.texto3 = data.texto3;
      this.texto4 = data.texto4;
      this.texto5 = data.texto5;
    });
  }
}

