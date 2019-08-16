import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Routes, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { EmisionService } from '../../shared/services/emision.service';
import { VisaService } from '../../../../shared/services/pago/visa.service';
import { Autorizacion } from '../../shared/models/autorizacion.model';
import { AppConfig } from '../../../../app.config';
import { Contratante } from '../../shared/models/contratante.model';
import { Certificado } from '../../shared/models/certificado.model';


@Component({
  selector: 'app-resultado-visa',
  templateUrl: './resultado-visa.component.html',
  styleUrls: ['./resultado-visa.component.css']
})
export class ResultadoVisaComponent implements OnInit, OnDestroy {
  @ViewChild('modalTerminosCondiciones', { static: true })
  modalTerminosCondiciones;
  certificado = new Certificado();
  bLoading = true;
  bValidationEmission = true;
  mensajeValidation = '';
  transactionKey = '';
  bAprobado = false;
  cliente: Contratante;
  autorizacion = new Autorizacion();
  bProcesoCompra = false;
  bRespuestaVisa = false;
  mensajes = [];
  // Variables de respuesta de pago
  correo = '';
  movil = '';
  pdfID = '';
  downloadUrl = '';
  canal = '';
  puntoDeVenta = '';
  modalidad = '3';
  claseAuto = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private emisionService: EmisionService,
    private visaService: VisaService,
    private appConfig: AppConfig
  ) { }

  ngOnInit() {
    this.initComponent();
  }

  ngOnDestroy() {
    sessionStorage.removeItem('pagoVisaCliente');
  }

  initComponent() {
    sessionStorage.setItem('pagefrom', 'LastStepComponent');
    const pagoRealizado = JSON.parse(sessionStorage.getItem('pagoVisaCliente'));
    this.obtenerDatosCertificado();
    if (pagoRealizado !== null) {
      const payResult = <Autorizacion>pagoRealizado;
      this.bAprobado = payResult.aprobado;
      this.bLoading = false;
      this.bProcesoCompra = false;
      this.bRespuestaVisa = true;
      this.autorizacion = payResult;
      this.pdfID = this.autorizacion.pdf_Id;
      return;
    }

    const autoSession = JSON.parse(sessionStorage.getItem('auto'));
    const transactionKeyy = this.route.snapshot.paramMap.get('key') || '';
    const clienteSesion = sessionStorage.getItem('contratante');

    this.canal = sessionStorage.getItem('canalVentaCliente');
    this.puntoDeVenta = sessionStorage.getItem('puntoVentaCliente');
    // this.modalidad = this.modalidad = sessionStorage.getItem('plan') == null ? '0' : sessionStorage.getItem('plan');

    if (autoSession != null) {
      this.bProcesoCompra = false;
      if (clienteSesion !== null) {
        this.cliente = JSON.parse(clienteSesion);
      }
      if (transactionKeyy !== null) {
        this.transactionKey = transactionKeyy;
      }
      this.claseAuto = autoSession.p_SNAMECLASE;
      this.emissionProcessCompletePolicyVS();
    } else {
      this.bProcesoCompra = true;
    }
  }

  emissionProcessCompletePolicyVS() {
    if (this.transactionKey !== '') {
      const sessionToken = sessionStorage.getItem('sessionToken');

      this.emisionService
        .emissionProcessCompletePolicy(
          this.transactionKey, // transactionToken
          sessionToken, // sessionToken
          this.cliente.p_NIDPROCESS, // processId
          '', // planillaId
          AppConfig.FLUJO_CLIENTE, // Constante // flujoId
          '', // userId
          '1', // tipoPago
          '', // nombres
          '', // apellidos
          '', // correo
          '', // total
          this.cliente,
          this.canal,
          this.puntoDeVenta,
          this.modalidad
        )
        .subscribe(
          res => {
            this.bRespuestaVisa = true;
            this.autorizacion.authorizedAmount = res.authorizedAmount;
            this.autorizacion.cardNumber = res.cardNumber;
            this.autorizacion.orderNumber = res.orderNumber;
            this.autorizacion.transactionDateTime = res.transactionDateTime;
            this.autorizacion.fullDate = res.fullDate;
            this.autorizacion.email = this.cliente.p_SMAIL;
            this.autorizacion.phoneNumber = this.cliente.p_SPHONE;
            this.autorizacion.customerName = res.pdf_CustomerName;
            this.autorizacion.errorMessage = res.errorDesc;
            this.autorizacion.pdf_Id = res.pdf_ID;

            this.pdfID = res.pdf_ID;

            sessionStorage.setItem('pagoVisaCliente', JSON.stringify(this.autorizacion));

            if (res.errorCode === '0') {
              this.bValidationEmission = true;
              this.bAprobado = true;
              this.limpiarSesiones();
              this.appConfig.pixelPagoExitoso(this.autorizacion.orderNumber.toString(),
                this.certificado.P_NPREMIUM.toString(),
                '66',
                this.autorizacion.authorizedAmount.toString(),
                this.claseAuto);
            } else {
              if (res.errorCode === 'EMISION_VALIDATON') {
                this.bValidationEmission = false;
                this.bAprobado = true;
                this.mensajeValidation =
                  res.errorDesc == null
                    ? ''
                    : res.errorDesc.toString().substr(1);
                this.mensajes = this.mensajeValidation.split('|');
              }
              if (res.errorCode === 'PAGO_VALIDATON') {
                this.bValidationEmission = true;
                this.bAprobado = false;
                this.mensajeValidation = res.errorDesc;
              }
            }
            this.bLoading = false;
          },
          err => {
            console.log(err);
            this.bRespuestaVisa = false;
            this.bLoading = false;
            this.bAprobado = false;
          }
        );
    }
  }

  limpiarSesiones() {
    sessionStorage.removeItem('placa');
    sessionStorage.removeItem('auto');
    sessionStorage.removeItem('vigencia');
    sessionStorage.removeItem('contratante');
    sessionStorage.removeItem('certificado');
    sessionStorage.removeItem('plan');
    sessionStorage.removeItem('tarifa');
    sessionStorage.removeItem('sessionToken');
  }

  IrResumen(): void {
    sessionStorage.setItem('pagefrom', 'Step03Component');
    this.router.navigate(['client/resumen']);
  }

  IrPlaca(): void {
    this.router.navigate(['client/placa']);
    this.limpiarSesiones();
  }

  mostrarTerminosCondiciones() {
    this.modalTerminosCondiciones.show();
  }

  cerrarTerminosCondiciones() {
    this.modalTerminosCondiciones.hide();
  }

  downloadPdf() {
    const _iFrame = <HTMLIFrameElement>document.getElementById('ifrmPdf');

    _iFrame.src = 'about:blank';

    setTimeout(() => {
      _iFrame.src =
        AppConfig.URL_API + '/EmissionProc/DownloadCustomerPdf/' + this.pdfID;
    }, 250);
  }

  obtenerDatosCertificado() {
    const certificadoSession = JSON.parse(
      sessionStorage.getItem('certificado')
    );
    if (certificadoSession != null) {
      this.certificado = certificadoSession;
    }
  }

}
