import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PolicyService } from '../../../services/policy/policy.service';
import { Autorizacion } from '../../../../../../app/layout/client/shared/models/autorizacion.model';
import { AppConfig } from '../../../../../app.config';
// import { VisaService } from 'src/app/shared/services/pago/visa.service';
// import { GenerarCip } from 'src/app/layout/client/shared/models/generar-cip.model';
// import { AppConfig } from '../../ src/app/app.config';

@Component({
  selector: 'app-policy-result',
  templateUrl: './policy-result.component.html',
  styleUrls: ['./policy-result.component.css']
})
export class PolicyResultComponent implements OnInit {

  auto: any = {};
  mensajeValidation = '';  
  frameResult;
  btnVisa: any;
  idProcess: any = "";
  cliente: any
  certificado: any
  transactionKey = '';
  autorizacion = new Autorizacion();
  pdfID = '';
  bValidationEmission = true;
  bAprobado = false;
  bLoading = true;
  bProcesoCompra = false;
  bRespuestaVisa = false;
  mensajes = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appConfig: AppConfig,
    private policyService: PolicyService) { }

  ngOnInit() {
    const transactionKeyy = this.route.snapshot.paramMap.get('key') || '';
    if (transactionKeyy !== null) {
      this.transactionKey = transactionKeyy;
    }
    const clienteSesion = localStorage.getItem('contratante');
    if (clienteSesion !== null) {
      this.cliente = JSON.parse(clienteSesion);
    }

    this.bLoading = true;

    // this.bProcesoCompra = true;

    this.processPE()

  }

  processPE() {
    let name = this.cliente.p_SLEGALNAME == null ? this.cliente.p_SCLIENT_NAME : this.cliente.p_SLEGALNAME;
    let lastname = this.cliente.p_SLEGALNAME == null ? this.cliente.p_SCLIENT_APPPAT + " " + this.cliente.p_SCLIENT_APPMAT : "";

    let canal = "2015000002";
    let puntoDeVenta = "2";
    let modalidad = "0";

    const sessionToken = sessionStorage.getItem('sessionToken')

    let data: any = {};
    data.transactionToken = this.transactionKey
    data.sessionToken = sessionToken
    data.processId = this.cliente.p_NIDPROCESS
    data.planillaId = ""
    data.flujoId = "1"
    data.userId = JSON.parse(localStorage.getItem("currentUser"))["id"]
    data.tipoPago = "3";
    data.nombres = name
    data.apellidos = lastname
    data.correo = this.cliente.p_SMAIL
    data.total = this.cliente.p_NTOTAL
    data.cliente = this.cliente
    data.canal = canal
    data.puntoDeVenta = puntoDeVenta
    data.modalidad = modalidad
    data.movement = this.cliente.p_NMOVEMENT
    data.policy = this.cliente.p_NPOLICY
    data.productId = this.cliente.p_NPRODUCT

    this.policyService.registerVisa(data)
      .subscribe(
        res => {
          console.log(res)
          this.bLoading = false;
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
            this.bAprobado = true;
            // this.limpiarSesiones();

          } else {
            if (res.errorCode === 'EMISION_VALIDATON') {
              this.bValidationEmission = false;
              this.bAprobado = false;
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
        },
        err => {
          console.log(err);
          this.bRespuestaVisa = false;
          this.bLoading = false;
          this.bAprobado = false;
        }
      );
  }

  emisionNuevo(): void {
    this.router.navigate(['broker/policy/emit']);
  }

  downloadPdf() {
    const _iFrame = <HTMLIFrameElement>document.getElementById('ifrmPdf');

    _iFrame.src = 'about:blank';

    setTimeout(() => {
      _iFrame.src =
        AppConfig.URL_API + '/EmissionProc/DownloadCustomerPdf/' + this.pdfID;
    }, 250);
  }

}
