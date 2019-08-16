import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmisionService } from '../../../client/shared/services/emision.service';
import { VisaService } from '../../../../shared/services/pago/visa.service';
import { Cliente } from '../../../broker/models/cliente/cliente';
import { Autorizacion } from '../../../client/shared/models/autorizacion.model';
import { AppConfig } from '../../../../app.config';
import { Certificado } from '../../models/certificado/certificado';
import { VisaResult } from '../../models/visaresult/visaresult';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.css']
})
export class ResultadoComponent implements OnInit, OnDestroy {
  bLoading = true;
  bAprobado = false;
  cliente: Cliente;
  certificado: Certificado;
  autorizacion = new Autorizacion();
  resultado = new VisaResult();
  downloadPdfUrl = '';

  constructor(
    private route: ActivatedRoute,
    private emisionService: EmisionService,
    private visaService: VisaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initComponent();
    // this.limpiarSessionStorage();
  }

  ngOnDestroy() {
    // destroy objects
    sessionStorage.removeItem('infoPago');
  }

  initComponent() {
    sessionStorage.setItem('pagefrom', 'LastStepComponent');
    const infoPago = JSON.parse(sessionStorage.getItem('infoPago'));
    const autoSession = JSON.parse(sessionStorage.getItem('auto'));
    const transactionKey = this.route.snapshot.paramMap.get('key') || '';
    const clienteSesion = sessionStorage.getItem('contratante');


    if (infoPago !== null) {
      this.bLoading = false;
      this.resultado = <VisaResult>infoPago;
      this.bAprobado = this.resultado.aprobado;
      this.downloadPdfUrl = `${AppConfig.URL_API}/pago/DownloadCustomerPdf/${
        this.resultado.pdfID
        }`;

      return;
    }

    if (clienteSesion !== null) {
      this.cliente = JSON.parse(clienteSesion);
    }

    const certificadoSession = sessionStorage.getItem('certificado');

    if (certificadoSession !== null) {
      this.certificado = JSON.parse(certificadoSession);
    }

    if (transactionKey !== '') {
      const sessionToken = JSON.parse(sessionStorage.getItem('sessionToken'));

      this.emisionService.processValidatePoliza(this.cliente.p_NIDPROCESS)
        .subscribe(
          res => {
            if (res.errorDesc != null && res.errorDesc !== '') {
              sessionStorage.setItem('errorVisa', res.errorDesc);
              this.IrAResumen();
              return;
            }

            this.visaService
              .autorizarTransaccion(
                transactionKey,
                sessionToken,
                this.cliente == null ? 0 : this.cliente.p_NIDPROCESS,
                '',
                AppConfig.FLUJO_BROKER,
                '',
                this.cliente
              )
              .subscribe(
                res => {
                  this.autorizacion = res;
                  console.log(res);
                  this.resultado.pdfID = res.pdf_Id;
                  // this.resultado.aprobado = true;
                  this.resultado.authorizedAmount = res.authorizedAmount;
                  this.resultado.cardNumber = res.cardNumber;
                  this.resultado.customerName = res.pdf_CustomerName;
                  this.resultado.email = res.pdf_Email;
                  this.resultado.fullDate = res.fullDate;
                  this.resultado.orderNumber = res.orderNumber;
                  this.resultado.phoneNumber = res.pdf_PhoneNumber;
                  this.resultado.transactionDateTime = res.transactionDateTime;
                  this.resultado.aprobado = this.autorizacion.actionCode === '000';
                  this.resultado.errorMessage = res.actionCodeDescription;

                  this.bAprobado = this.resultado.aprobado;

                  console.log(this.resultado);
                  this.downloadPdfUrl = `${
                    AppConfig.URL_API
                    }/pago/DownloadCustomerPdf/${res.pdf_Id}`;

                  sessionStorage.setItem(
                    'infoPago',
                    JSON.stringify(this.resultado)
                  );

                  if (this.resultado.aprobado) {
                    this.emisionService
                      .registrarEmision(this.cliente.p_NIDPROCESS)
                      .subscribe(
                        result => {
                          // console.log(result);
                        },
                        err => {
                          console.log(err);
                        }
                      );
                  } else {
                    // do something when the payment is not sucessfully
                  }
                  console.log(this.resultado);
                  this.bLoading = false;
                },
                err => {
                  console.log(err);

                  this.bLoading = false;
                }
              );


          }, err => {
            console.log(err);
            this.bLoading = false;
          }
        );



    }
  }

  onImprimir() {
    this.emisionService.generarPolizaPdf(+this.certificado.P_NPOLICY).subscribe(
      res => {
        this.downloadPdf(res.fileName);
      },
      err => {
        console.log(err);
      }
    );
  }

  downloadPdf(fileName: string) {
    const url = `${AppConfig.PATH_PDF_FILES}/${fileName}`;
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('target', '_blank');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  IrPlaca(): void {
    this.limpiarSessionStorage();
    this.router.navigate(['broker/stepAll']);
  }

  IrAResumen(): void {
    sessionStorage.setItem('pagefrom', 'BrokerEmissionComponent');
    this.router.navigate(['broker/step05']);
  }

  limpiarSessionStorage() {
    sessionStorage.removeItem('placa');
    sessionStorage.removeItem('auto');
    sessionStorage.removeItem('contratante');
    sessionStorage.removeItem('certificado');
  }
}
