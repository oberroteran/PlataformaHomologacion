import {
  Component,
  OnInit,
  ViewContainerRef,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Contratante } from '../../shared/models/contratante.model';
import { PagoEfectivoService } from '../../../../shared/services/pago/pago-efectivo.service';
import { Certificado } from '../../shared/models/certificado.model';
import { Auto } from '../../shared/models/auto.model';
import { Prima } from '../../shared/models/prima.model';
import { FrameComponent } from '../../../../shared/components/frame/frame.component';
import { AppConfig } from '../../../../app.config';
import { EmisionService } from '../../shared/services/emision.service';
import { GenerarCip } from '../../shared/models/generar-cip.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resultado-pagoefectivo',
  templateUrl: './resultado-pagoefectivo.component.html',
  styleUrls: [
    './resultado-pagoefectivo.component.css',
    './resultado-pagoefectivo.component-mobile.css'
  ]
})
export class ResultadoPagoefectivoComponent implements OnInit {
  email: '';
  cliente = new Contratante();
  certificado = new Certificado();
  auto = new Auto();
  bValidationEmission = true;
  mensajeValidation = '';
  bAprobado = false;
  bProcesoCompra = false;
  bLoading = true;
  mensajes = [];
  canal = '';
  puntoDeVenta = '';
  modalidad = '3';
  @ViewChild('modalResultadoPE', { static: true }) modalResultado;
  frameResult;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private pagoEfectivoService: PagoEfectivoService,
    private factoryResolver: ComponentFactoryResolver,
    private emisionService: EmisionService,
    private router: Router,
    private appConfig: AppConfig
  ) { }

  ngOnInit() {
    // console.log('control de cambio');
    this.initComponent();
  }

  initComponent() {
    sessionStorage.setItem('pagefrom', 'LastStepComponent');
    const autoSession = JSON.parse(sessionStorage.getItem('auto'));
    const clienteSession = JSON.parse(sessionStorage.getItem('contratante'));
    this.canal = sessionStorage.getItem('canalVentaCliente');
    this.puntoDeVenta = sessionStorage.getItem('puntoVentaCliente');
    // this.modalidad=this.modalidad=sessionStorage.getItem('plan')==null?'0': sessionStorage.getItem('plan');

    if (autoSession != null) {
      this.bProcesoCompra = false;
      this.obtenerDatosCliente();
      this.obtenerDatosCertificado();
      this.emissionProcessCompletePolicyPE();
    } else {
      this.bProcesoCompra = true;
    }
  }

  limpiarSesion() {
    sessionStorage.removeItem('placa');
    sessionStorage.removeItem('auto');
    sessionStorage.removeItem('vigencia');
    sessionStorage.removeItem('contratante');
    sessionStorage.removeItem('certificado');
    sessionStorage.removeItem('plan');
  }

  emissionProcessCompletePolicyPE() {
    this.emisionService
      .emissionProcessCompletePolicy(
        '',
        '',
        this.cliente.p_NIDPROCESS,
        '',
        AppConfig.FLUJO_CLIENTE, // Constante
        '',
        '2',
        this.cliente.p_SCLIENT_NAME,
        `${this.cliente.p_SCLIENT_APPPAT} ${this.cliente.p_SCLIENT_APPMAT}`,
        this.cliente.p_SMAIL,
        this.certificado.P_NPREMIUM,
        this.cliente,
        this.canal,
        this.puntoDeVenta,
        this.modalidad
      )
      .subscribe(
        res => {
          // console.log('salio al servicio');
          // console.log(res);
          // console.log(res);
          if (res.errorCode === '0') {
            this.bValidationEmission = true;
            this.bAprobado = true;
            const data = <GenerarCip>res; // manejarlo mejor
            const factory = this.factoryResolver.resolveComponentFactory(
              FrameComponent
            );
            this.frameResult = factory.create(
              this.viewContainerRef.parentInjector
            );
            this.frameResult.instance.token = res.errorDesc;
            this.frameResult.instance.ancho = '100%';
            this.frameResult.instance.alto = '95%';
            // Agregar el componente al componente contenedor
            this.viewContainerRef.insert(this.frameResult.hostView);
            // Abrimos el modal
            this.modalResultado.show();
            this.bLoading = false;

            this.appConfig.pixelEvent(
              'virtualEvent',
              'SOAT Digital - Cliente - Pago',
              'Pago Efectivo',
              'Reserva satisfactoria'
            );

            this.appConfig.pixelSaveClientID();
            const idClientTrack = sessionStorage.getItem('idClientTrack');

            this.emisionService
              .registrarTracking(
                this.cliente.p_NIDPROCESS,
                idClientTrack,
                this.certificado.P_NPREMIUM
              )
              .subscribe(
                res => { },
                err => {
                  console.log(err);
                }
              );
            // this.limpiarSesion();
          } else {
            if (res.errorCode === 'EMISION_VALIDATON') {
              this.bValidationEmission = false;
              this.bAprobado = true;
              this.mensajeValidation = res.errorDesc.toString().substr(1);
              this.mensajes = this.mensajeValidation.split('|');
            }
            if (res.errorCode === 'CIP_VALIDATON') {
              this.bValidationEmission = true;
              this.bAprobado = false;
              this.mensajeValidation = res.errorDesc;
            }
          }
          this.bLoading = false;
        },
        err => {
          console.log(err);
          this.bLoading = false;
          this.bAprobado = false;
        }
      );
  }

  finalizar() {
    this.modalResultado.hide();
    this.limpiarSesion();
  }

  obtenerDatosCliente() {
    const clienteSession = JSON.parse(sessionStorage.getItem('contratante'));
    if (clienteSession != null) {
      this.cliente = clienteSession;
    }
    this.canal = sessionStorage.getItem('canalVentaCliente');
    this.puntoDeVenta = sessionStorage.getItem('puntoVentaCliente');
    this.modalidad =
      sessionStorage.getItem('plan') == null
        ? '0'
        : sessionStorage.getItem('plan');
  }

  obtenerDatosCertificado() {
    const certificadoSession = JSON.parse(
      sessionStorage.getItem('certificado')
    );
    if (certificadoSession != null) {
      this.certificado = certificadoSession;
    }
  }

  IrResumen(): void {
    sessionStorage.setItem('pagefrom', 'Step03Component');
    window.location.href = './client/resumen';
  }

  IrPlaca(): void {
    this.router.navigate(['client/placa']);
  }
}
