import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { VisaService } from '../../../../shared/services/pago/visa.service';
import { AppConfig } from '../../../../app.config';
import { PayrollService } from '../../services/payroll/payroll.service';
import { PayrollCab } from '../../models/Payroll/payrollcab';
import { PayrollPayment } from '../../models/Payroll/payrollpayment';
import { Autorizacion } from '../../../client/shared/models/autorizacion.model';
import { Parameter } from '../../../../shared/models/parameter/parameter';
import { UtilityService } from '../../../../shared/services/general/utility.service';
import { VisaResult } from '../../models/visaresult/visaresult';
import { Cliente } from '../../models/cliente/cliente';

@Component({
  selector: 'app-payroll-resultado-visa',
  templateUrl: './payroll-resultado-visa.component.html',
  styleUrls: ['./payroll-resultado-visa.component.css']
})
export class PayrollResultadoVisaComponent implements OnInit, OnDestroy {
  bLoading = true;
  bAutorizado = false;
  banco = '';
  cuentaBancaria = '';
  usuario;
  planilla: PayrollCab;
  sessionToken = '';
  transactionToken = '';
  public result: any = {};
  messageinfo: string;
  @ViewChild('childModal', { static: true }) childModal: ModalDirective;

  resultado = new VisaResult();
  downloadPdfUrl = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private visaService: VisaService,
    private planillaService: PayrollService,
    private utilityService: UtilityService
  ) {}

  ngOnInit() {
      this.initComponent();
   
  }

  ngOnDestroy() {
    sessionStorage.removeItem('infoPago');
  }

  initComponent() {

    const infoPlanilla = JSON.parse(sessionStorage.getItem('infoPago'));

    if (infoPlanilla !== null) {     
      const vResult = <VisaResult>infoPlanilla;
      this.downloadPdfUrl = `${AppConfig.URL_API}/pago/DownloadCustomerPdf/${
        vResult.pdfID
      }`;
      this.bAutorizado = vResult.aprobado;
      this.resultado = vResult;
      this.bLoading = false;
      return;
    }


    const usuarioSesion = localStorage.getItem('currentUser');

    if (usuarioSesion != null) {
      this.usuario = JSON.parse(usuarioSesion);
    }

    const sessionTransactionKey = this.route.snapshot.paramMap.get('key') || '';

    if (sessionTransactionKey !== '') {
      this.transactionToken = sessionTransactionKey;

      const sessionSessionToken = sessionStorage.getItem('sessionToken');

      // console.log(sessionSessionToken);
      if (sessionSessionToken !== null) {
        this.sessionToken = sessionSessionToken;
      }

      const sessionPlanilla = JSON.parse(sessionStorage.getItem('planilla'));

      // console.log(sessionPlanilla);
      if (sessionPlanilla !== null) {
        this.planilla = sessionPlanilla;
      }

      this.obtenerBanco();
    }
  }

  private obtenerBanco() {
    const filter = new Parameter(
      'PLATAFORMA_DIGITAL',
      'MODULE_PAYROLL',
      'VISANET_SOLES_BANCO',
      '0',
      ''
    );

    this.utilityService.getParameter(filter).subscribe(
      res => {
        // console.log(res);
        this.banco = (<Parameter>res).outsvalue;
        this.obtenerCuentaBancaria();
      },
      err => {
        console.log(err);
      }
    );
  }

  private obtenerCuentaBancaria() {
    const filter = new Parameter(
      'PLATAFORMA_DIGITAL',
      'MODULE_PAYROLL',
      'VISANET_SOLES_CUENTA',
      '0',
      ''
    );

    this.utilityService.getParameter(filter).subscribe(
      res => {
        // console.log(res);
        this.cuentaBancaria = (<Parameter>res).outsvalue;
        this.autorizarTransaccion();
      },
      err => {
        console.log(err);
      }
    );
  }

  autorizarTransaccion() {
    // this.bLoading = false;
    // this.bAutorizado = true;

    const cliente = new Cliente();

    cliente.p_SCANAL = this.usuario.desCanal;

    this.visaService
      .autorizarTransaccion(
        this.transactionToken,
        this.sessionToken,
        '',
        this.planilla.NIDPAYROLL,
        AppConfig.FLUJO_PLANILLA,
        this.usuario.id,
        cliente
      )
      .subscribe(
        res => {
          //console.log('autorizarTransaccion: ', res);

          const autorizacion = <Autorizacion>res;

          this.bLoading = false;

          this.resultado.pdfID = res.pdf_Id;          
          this.resultado.authorizedAmount = res.authorizedAmount;
          this.resultado.cardNumber = res.cardNumber;
          this.resultado.customerName = res.pdf_CustomerName;
          this.resultado.email = res.pdf_Email;
          this.resultado.fullDate = res.pdf_fullDate;          
          this.resultado.orderNumber = res.orderNumber;
          this.resultado.phoneNumber = res.pdf_PhoneNumber;
          this.resultado.errorMessage = res.errorMessage;                    
          this.resultado.fullDate = res.fullDate;          
          this.resultado.transactionDateTime = res.transactionDateTime;
          this.resultado.canal = res.pdf_Canal;
          this.resultado.aprobado = autorizacion.actionCode === '000';
          
          
          this.bAutorizado = this.resultado.aprobado;

          this.downloadPdfUrl = `${
            AppConfig.URL_API
          }/pago/DownloadCustomerPdf/${this.resultado.pdfID}`;

          sessionStorage.setItem('infoPago', JSON.stringify(this.resultado));

          if (this.resultado.aprobado) {
            const planilla = JSON.parse(sessionStorage.getItem('planilla'));

            this.registrarPlanillaDetallePago(autorizacion, planilla);
          } else {
            // do something
          }
        },
        err => {
          console.log(err);
          this.bLoading = false;
        }
      );
  }

  aceptarmsginfo() {
    this.childModal.hide();
    // this.router.navigate(['broker/payroll']);
  }

  registrarPlanillaDetallePago(
    autorizacion: Autorizacion,
    planilla: PayrollCab
  ) {
    const currDay = new Date();
    const dOperacion = `${currDay.getDate()}/${currDay.getMonth() +
      1}/${currDay.getFullYear()}`;
    // console.log(dOperacion);
    const detallePago = new PayrollPayment(
      0, // IdPayRollDetail
      1, // Currency
      planilla.NAMOUNTTOTAL, // NAMOUNT
      2, // NIDPAIDTYPE // 1: Pago Efectivo;2: Pago con Visa;3: Pago con Cupon
      +this.banco, // NBANK
      +this.cuentaBancaria, // NBANKACCOUNT
      autorizacion.authorizedCode, // SOPERATIONNUMBER
      dOperacion, // DOPERATION
      'Pago por Visanet', // SREFERENCE
      '1', // SSTATE
      this.usuario.id, // NUSERREGISTER
      '', // NCURRENCYTEXT
      '', // NBANKTEXT
      '', // NBANKACCOUNTTEXT
      '', // NIDPAIDTYPETEXT
      false
    ); // SELECTED

    planilla.NIDSTATE = 2; // 1: Pendiente; 2:Enviado
    planilla.LISTPAYROLLPAYMENT.push(detallePago);

    // console.log(planilla);

    this.planillaService.getPostGrabarPlanillaManual(planilla).subscribe(
      res => {
        //console.log('getPostGrabarPlanillaManual: ', res);

        this.result = res;
        if (this.planilla.NIDPAYROLL === 0) {
          this.messageinfo =
            'Se generó la Planilla Nro: ' + this.result.noutidpayroll;
          this.childModal.show();
        } else {
          this.messageinfo =
            'Se actualizó los de la Planilla Nro: ' + this.result.noutidpayroll;
          this.childModal.show();
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  irAPlanillas() {
    this.limpiarSessionStorage();
    this.router.navigate(['broker/payroll']);
  }

  limpiarSessionStorage() {
    sessionStorage.removeItem('planilla');
    sessionStorage.removeItem('sessionToken');
  }

  Volver(){
    this.router.navigate(['broker/payrolladd', 'pago',0,0]);
    //this.router.navigate(['broker//payrolladd/add/0/0']);
  }
}
