import { Router } from '@angular/router';
import { SessionToken } from '../../../client/shared/models/session-token.model';
import { Prima } from '../../../client/shared/models/prima.model';
import { Auto } from '../../models/auto/auto.model';
import { Certificado } from '../../models/certificado/certificado';
import {
  Component,
  OnInit,
  ViewContainerRef,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { VisaService } from '../../../../shared/services/pago/visa.service';
import { EmisionService } from '../../../client/shared/services/emision.service';
import { PagoEfectivoService } from '../../../../shared/services/pago/pago-efectivo.service';
import { GenerarCip } from '../../../client/shared/models/generar-cip.model';
import { ButtonVisaComponent } from '../../../../shared/components/button-visa/button-visa.component';
import { FrameComponent } from '../../../../shared/components/frame/frame.component';
import { Cliente } from '../../models/cliente/cliente';
import { AppConfig } from '../../../../app.config';
import { FormControl } from '@angular/forms';
import { Step05Service } from '../../services/step05/step05.service';
@Component({
  selector: 'app-step05',
  templateUrl: './step05.component.html',
  styleUrls: ['./step05.component.css']
})
export class Step05Component implements OnInit, OnDestroy {
  cliente = new Cliente();
  auto = new Auto();
  tarifa = new Prima();
  bMostrarButtons: boolean;
  bMostrarLoading = false;
  certificado = new Certificado();
  btnVisa;
  mainTitle = '';
  titulos: string[];
  NroCertificado: number;
  Modalidad: any;
  tCertificado: number;

  mostrarVisa = false;
  mostrarPE = false;
  PagoLock = false;
  @ViewChild('modalResultadoPE', { static: true }) modalResultado;
  @ViewChild('modalTerminosCondiciones', { static: true }) modalTerminosCondiciones;
  @ViewChild('modalEjemploSoat', { static: true }) modalEjemploSoat;
  frameResult;
  chkTerminos: FormControl = new FormControl();
  tpDocumento = '';
  setting_pay = '';
  bValido = true;
  mensajes = [];
  canal = '';
  bTiposPagoHabilitados;
  bVisa = false;
  bPagoEfectivo = false;
  bVoucher = false;
  errorDesc = '';
  public TIPO_DOCUMENTO_IDENTIDAD = {
    DNI: '2',
    RUC: '1',
    CE: '4'
  };
  bAceptarTerminos = false;
  ultimaPaginaNavegada = 0;
  paginaActual = 5;
  showSeccionEntrega=false;
  constructor(
    private emisionService: EmisionService,
    private visaService: VisaService,
    private viewContainerRef: ViewContainerRef,
    private factoryResolver: ComponentFactoryResolver,
    private pagoEfectivoService: PagoEfectivoService,
    private step05service: Step05Service,
    private router: Router,
    public cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.initComponent();
    sessionStorage.removeItem('infoPago');
    this.errorDesc = sessionStorage.getItem('errorVisa');
    if (this.errorDesc != null && this.errorDesc !== '') {
      this.mensajes = this.errorDesc.split('|');
      this.bValido = false;
      sessionStorage.removeItem('errorVisa');
    }
  }

  ngOnDestroy() {
    if (this.btnVisa) {
      this.btnVisa.destroy();

      sessionStorage.removeItem('infoPago');
    }

    if (this.frameResult) {
      this.frameResult.destroy();
    }
  }

  initComponent() {
    const sFrom = sessionStorage.getItem('pagefrom');
    if (sFrom === null || sFrom === 'BrokerEmissionComponent') {
      sessionStorage.setItem('pagefrom', 'Step05Component');
      window.location.reload();
    } else if (sFrom === 'LastStepComponent') {
      this.limpiarSessionStorage();
      history.go(1);
      this.router.navigate(['broker/stepAll'], { replaceUrl: true });
      return;
    }
    this.validarNavegacion();
    this.obtenerDatosCliente();
    this.obtenerDatosAuto();
    this.obtenerDatosCertificado();
    this.obtenerTipoPagoCanal();
    this.bMostrarButtons = false;
    this.tpDocumento = this.cliente.p_NDOCUMENT_TYP.toString() === this.TIPO_DOCUMENTO_IDENTIDAD.RUC ? 'RUC' : 'DNI';
    if (this.cliente.p_NDOCUMENT_TYP.toString() === this.TIPO_DOCUMENTO_IDENTIDAD.RUC) {
      this.tpDocumento = 'RUC';
    }
    if (this.cliente.p_NDOCUMENT_TYP.toString() === this.TIPO_DOCUMENTO_IDENTIDAD.DNI) {
      this.tpDocumento = 'DNI';
    }
    if (this.cliente.p_NDOCUMENT_TYP.toString() === this.TIPO_DOCUMENTO_IDENTIDAD.CE) {
      this.tpDocumento = 'CE';
    }
    this.Modalidad = JSON.parse(sessionStorage.getItem('Modalidad'));
    this.tCertificado = this.Modalidad && this.Modalidad['tipoCertificado'];
    this.NroCertificado = Number(this.tCertificado) - 1;
    this.setTitle(this.NroCertificado);
  }

  private validarNavegacion() {
    const sessionUltimaPagina = sessionStorage.getItem('pagina');
    if (sessionUltimaPagina != null) {
      this.ultimaPaginaNavegada = +sessionUltimaPagina;

      if (this.paginaActual - this.ultimaPaginaNavegada > 1) {
        this.volverDatosCertificado();
      }
    } else {
      this.volverValidarPlaca();
    }
  }

  setTitle(id: number) {
    this.titulos = [
      'Crea un SOAT Manual para un tercero',
      'Crea un SOAT Láser para un tercero',
      'Crea un SOAT electrónico para un tercero'
    ];
    this.mainTitle = this.titulos[Number(id)];
  }
  obtenerDatosAuto() {
    const autoSession = JSON.parse(sessionStorage.getItem('auto'));
    if (autoSession != null) {
      this.auto = autoSession;
    }
  }

  obtenerDatosCliente() {
    const clienteSession = JSON.parse(sessionStorage.getItem('contratante'));
    if (clienteSession != null) {
      this.cliente = clienteSession;
    }
  }

  obtenerDatosCertificado() {
    const certificadoSession = JSON.parse(sessionStorage.getItem('certificado'));
    if (certificadoSession != null) {
      this.certificado = certificadoSession;
      this.canal = this.certificado.P_NCODCHANNEL_BO == null ? '' : this.certificado.P_NCODCHANNEL_BO.toString();
    }
  }

  getFechaVigencia() {
    return this.certificado.P_DSTARTDATE.toString()
      .split('-')
      .reverse()
      .join('/');
  }

  setMetodoPago(id) {
    switch (id) {
      case 1:
        this.crearBotonVisa();
        break;
      case 2:
        this.crearBotonPagoEfectivo();
        break;
      case 3:
        this.pagarVoucher();
        break;
      default:
        break;
    }
  }

  pagarVoucher() {
    this.emisionService.registrarEmision(this.cliente.p_NIDPROCESS).subscribe(
      result => {
        if (result.indProcess === 1) {
          this.irResultado();
        } else {
          this.mensajes = result.errorDesc.split('|');
          this.bValido = false;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  irResultado() {
    this.router.navigate(['broker/resvaucher']);
  }

  crearBotonVisa() {
    // this.bMostrarButtons = false;
    this.mostrarVisa = true;
    this.cd.detectChanges();
    /*     this.visaService
          .generarSessionToken(this.certificado.P_NPREMIUM, "")
          .subscribe(
            res => {
              const data = <SessionToken>res; */
    const visasession = JSON.parse(sessionStorage.getItem('visasession'));
    sessionStorage.setItem('sessionToken', visasession.sessionToken);
    const factory = this.factoryResolver.resolveComponentFactory(
      ButtonVisaComponent
    );
    this.btnVisa = factory.create(this.viewContainerRef.parentInjector);
    this.btnVisa.instance.action = AppConfig.ACTION_FORM_VISA_BROKER;
    this.btnVisa.instance.amount = this.certificado.P_NPREMIUM;
    this.btnVisa.instance.sessionToken = visasession.sessionToken;
    this.btnVisa.instance.purchaseNumber = visasession.purchaseNumber;
    this.btnVisa.instance.merchantLogo = AppConfig.MERCHANT_LOGO_VISA;
    this.btnVisa.instance.userId = ''; // => en el flujo broker se debe enviar el id del usuario
    // Agregar el componente al componente contenedor
    this.viewContainerRef.insert(this.btnVisa.hostView);
    /*  },
     error => {
       console.log(error);
     }
   ); */
  }

  crearBotonPagoEfectivo() {
    this.bMostrarButtons = false;
    this.mostrarPE = true;
  }

  onPagar(tipoPago) {
    if (tipoPago === 2) {
      this.mostrarPE = false;
      this.bMostrarLoading = true;
      this.emisionService
        .processValidatePoliza(this.cliente.p_NIDPROCESS)
        .subscribe(
          res => {
            if (res.errorDesc != null && res.errorDesc !== '') {
              this.mensajes = res.errorDesc.split('|');
              this.bMostrarLoading = false;
              this.mostrarPE = true;
              this.bValido = false;
              return;
            }
            this.pagoEfectivoService
              .generarCip(
                this.cliente.p_SCLIENT_NAME,
                `${this.cliente.p_SCLIENT_APPPAT} ${
                this.cliente.p_SCLIENT_APPMAT
                }`,
                this.cliente.p_SMAIL,
                this.certificado.P_NPREMIUM,
                this.cliente.p_NIDPROCESS,
                '',
                AppConfig.FLUJO_BROKER,
                ''
              ) // => en el flujo broker se debe enviar el id del usuario
              .subscribe(
                res => {
                  const data = <GenerarCip>res;
                  if (data.estado === '1') {
                    // Actualiza estado de la poliza
                    this.emisionService
                      .changeStatePoliza(this.certificado.P_NPOLICY, 5)
                      .subscribe(
                        result => {
                          // console.log(result);
                        },
                        err => {
                          console.log(err);
                        }
                      );

                    // Cip generado correctamente
                    const factory = this.factoryResolver.resolveComponentFactory(
                      FrameComponent
                    );
                    this.frameResult = factory.create(
                      this.viewContainerRef.parentInjector
                    );
                    this.frameResult.instance.token = data.token;
                    this.frameResult.instance.ancho = '100%';
                    this.frameResult.instance.alto = '100%';
                    // Agregar el componente al componente contenedor
                    this.viewContainerRef.insert(this.frameResult.hostView);
                    // Abrimos el modal
                    this.modalResultado.show();
                    this.bMostrarLoading = false;
                  } else {
                    // Ocurrio un error al intentar generar el Cip. Por favor, vuelva a intentarlo
                  }
                },
                err => {
                  console.log(err);
                  this.bMostrarLoading = false;
                  this.mostrarPE = true;
                }
              );
          },
          err => {
            console.log(err);
            this.bMostrarLoading = false;
            this.mostrarPE = true;
          }
        );
    }
  }

  finalizar() {
    this.modalResultado.hide();
    this.router.navigate(['broker/rescupon']);
  }

  verEjemploSOAT() {
    this.modalEjemploSoat.show();
  }

  habilitarBotonesPago(value) {
    /* this.bVisa = false;
    this.bPagoEfectivo = false;
    this.bVoucher = false;
    this.bMostrarButtons = false; */
    // if (value) {
    this.modalTerminosCondiciones.show();
    /* if (this.mostrarPE || this.mostrarVisa) {
    } else {
      this.bMostrarButtons = true;
    } */
    // this.PagoLock = true;
    // } else {
    //      this.modalTerminosCondiciones.hide();
    // this.bMostrarButtons = false;
    // this.PagoLock = false;
    //  }
  }

  openModalTerminos() {
    this.modalTerminosCondiciones.show();
  }

  volverValidarPlaca() {
    this.router.navigate(['broker/step01']);
  }

  aceptarTerminos() {
    this.bAceptarTerminos = true;
    this.modalTerminosCondiciones.hide();
  }

  volverDatosCertificado() {
    this.router.navigate(['broker/step04']);
  }

  cerrarTerminos() {
    this.modalTerminosCondiciones.hide();
  }

  obtenerTipoPagoCanal() {
    if (this.canal == null || this.canal === '') {
      this.canal = sessionStorage.getItem('canalVentaCliente');
    }
    this.setting_pay = AppConfig.SETTINGS_SALE;
    this.aceptarTerminos();
    this.resetFormaPago();
    this.step05service.getCanalTipoPago(this.canal, this.setting_pay).subscribe(
      res => {
        if (res != null) {
          this.bTiposPagoHabilitados = res;
          this.showSeccionEntrega = res.bdelivery === 1 ? true : false;
          this.setTipoPago();
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  acceptTerms(event) {
    console.log(event);
    event.preventDefault();
    this.setTipoPago();
    this.bAceptarTerminos = !this.bAceptarTerminos;
  }

  resetFormaPago() {
    this.bVisa = false;
    this.bPagoEfectivo = false;
    this.bVoucher = false;
  }

  setTipoPago() {
    this.PagoLock = false;
    this.PagoLock = false;
    const tiposPago = JSON.parse(JSON.stringify(this.bTiposPagoHabilitados));
    this.bVisa = tiposPago.bvisa === 1 ? true : false;
    if (this.bVisa) {
      this.crearBotonVisa();
    }
    this.bPagoEfectivo = tiposPago.bpagoefectivo === 1 ? true : false;
    this.bVoucher = tiposPago.bvoucher === 1 ? true : false;
  }

  limpiarSessionStorage() {
    sessionStorage.removeItem('placa');
    sessionStorage.removeItem('auto');
    sessionStorage.removeItem('contratante');
    sessionStorage.removeItem('certificado');
  }
}
