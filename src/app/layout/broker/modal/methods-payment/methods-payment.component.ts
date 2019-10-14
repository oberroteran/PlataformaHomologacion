// import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Component, OnInit, Input, ViewContainerRef, ComponentFactoryResolver, ViewChild, ChangeDetectorRef } from '@angular/core';
import { VisaService } from '../../../../shared/services/pago/visa.service';
import { ButtonVisaComponent } from '../../../../shared/components/button-visa/button-visa.component';
import { AppConfig } from '../../../../app.config';
import { GenerarCip } from '../../../client/shared/models/generar-cip.model';
import { Auto } from '../../../client/shared/models/auto.model';
import { SessionToken } from '../../../client/shared/models/session-token.model';
import { FrameComponent } from '../../../../shared/components/frame/frame.component';
import { PolicyemitService } from '../../services/policy/policyemit.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-methods-payment',
  templateUrl: './methods-payment.component.html',
  styleUrls: ['./methods-payment.component.css']
})
export class MethodsPaymentComponent implements OnInit {
  @Input() public formModalReference: any; //Referencia al modal creado desde el padre de este componente para ser cerrado desde aquí
  @Input() public correoContracting: any;
  @Input() public dataClient: any;
  @Input() public typePayment: any;
  @Input() public typeMovement: any;
  @Input() public policy: any;
  @Input() public totalPolicy: any;
  @Input() public product: any;


  auto = new Auto();
  bValidationEmission = true;
  mensajeValidation = '';
  bAprobado = false;
  bProcesoCompra = false;
  bLoading = true;
  frameResult;
  btnVisa: any;
  idProcess: any = "";
  cliente: any
  certificado: any

  @ViewChild('modalResultadoPE', { static: true }) modalResultado;

  constructor(
    public cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private policyemitService: PolicyemitService,
    private appConfig: AppConfig,
    private visaService: VisaService,
    private factoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    this.generateProcess();
    this.createVISAButton(this.totalPolicy);
    console.log(this.product)
    //cliente
    console.log(this.dataClient)
    this.cliente = {}
    this.cliente.p_SLEGALNAME = this.dataClient.P_SLEGALNAME;
    this.cliente.p_SCLIENT_NAME = this.dataClient.P_SFIRSTNAME;
    this.cliente.p_SCLIENT_APPPAT = this.dataClient.P_SLASTNAME;
    this.cliente.p_SCLIENT_APPMAT = this.dataClient.P_SLASTNAME2;
    this.cliente.p_SMAIL = this.correoContracting;
    this.cliente.p_NIDPROCESS = this.idProcess;
    this.cliente.p_NPOLICY = this.policy;
    this.cliente.p_NMOVEMENT = this.typeMovement;
    this.cliente.p_NTOTAL = this.totalPolicy;
    this.cliente.p_NUSER = JSON.parse(localStorage.getItem("currentUser"))["id"];
  }

  generateProcess() {
    let dataGen: any = {};
    dataGen.policy = this.policy
    dataGen.movement = this.typeMovement
    dataGen.userCode = JSON.parse(localStorage.getItem("currentUser"))["id"]
    this.policyemitService.generateProcess(dataGen)
      .subscribe(
        res => {
          this.idProcess = res.IdProcess
          localStorage.setItem("contratante", JSON.stringify({
            p_SLEGALNAME: this.dataClient.P_SLEGALNAME,
            p_SCLIENT_NAME: this.dataClient.P_SFIRSTNAME,
            p_SCLIENT_APPPAT: this.dataClient.P_SLASTNAME,
            p_SCLIENT_APPMAT: this.dataClient.P_SLASTNAME2,
            p_SMAIL: this.correoContracting,
            p_NIDPROCESS: this.idProcess,
            p_NPOLICY: this.policy,
            p_NMOVEMENT: this.typeMovement,
            p_NTOTAL: this.totalPolicy,
            p_NPRODUCT: this.product,
            p_NUSER: JSON.parse(localStorage.getItem("currentUser"))["id"]
          }));
          console.log(JSON.parse(localStorage.getItem("contratante")))
        },
        err => {
          console.log(err);
        }
      );
  }

  createVISAButton(amount: number) {
    this.bLoading = false;
    this.cd.detectChanges();
    this.visaService.generarSessionToken(amount, JSON.parse(localStorage.getItem("currentUser"))["id"]) // user Id
      .subscribe(
        res => {
          let data = <SessionToken>res;
          sessionStorage.setItem('visasession', JSON.stringify(data));
          let visasession = JSON.parse(sessionStorage.getItem('visasession'));
          sessionStorage.setItem('sessionToken', visasession.sessionToken);
          let factory = this.factoryResolver.resolveComponentFactory(ButtonVisaComponent);
          this.btnVisa = factory.create(this.viewContainerRef.parentInjector);
          this.btnVisa.instance.action = AppConfig.ACTION_FORM_VISA_KUNTUR;
          this.btnVisa.instance.amount = amount;
          this.btnVisa.instance.sessionToken = res.sessionToken;
          this.btnVisa.instance.purchaseNumber = res.purchaseNumber;
          this.btnVisa.instance.merchantLogo = AppConfig.MERCHANT_LOGO_VISA;
          this.btnVisa.instance.userId = JSON.parse(localStorage.getItem("currentUser"))["id"]; // Enviar el id del usuario
          // Agregar el componente al componente contenedor
          this.viewContainerRef.insert(this.btnVisa.hostView);
          this.bLoading = true;

          // this.ngOnInit();
        },
        error => {
          this.bLoading = true;
          console.log(error);
        }
      );
  }

  ngOnDestroy() {
    if (this.btnVisa) {
      this.btnVisa.destroy();
    }

    if (this.frameResult) {
      this.frameResult.destroy();
    }
  }


  processPE() {
    this.bLoading = false;

    let name = this.dataClient.P_SLEGALNAME == null ? this.dataClient.P_SFIRSTNAME : this.dataClient.P_SLEGALNAME;
    let lastname = this.dataClient.P_SLEGALNAME == null ? this.dataClient.P_SLASTNAME + " " + this.dataClient.P_SLASTNAME2 : "";

    let canal = "2015000002";
    let puntoDeVenta = "2";
    let modalidad = "0";

    let data: any = {};
    data.transactionToken = ""
    data.sessionToken = ""
    data.processId = this.idProcess
    data.planillaId = ""
    data.flujoId = AppConfig.FLUJO_CLIENTE
    data.userId = JSON.parse(localStorage.getItem("currentUser"))["id"]
    data.tipoPago = this.typePayment;
    data.nombres = name
    data.apellidos = lastname
    data.correo = this.correoContracting
    data.total = this.totalPolicy
    data.cliente = this.cliente
    data.canal = canal
    data.puntoDeVenta = puntoDeVenta
    data.modalidad = modalidad
    data.typeMovement = this.typeMovement
    data.policy = this.policy

    this.policyemitService.registerPayment(data)
      .subscribe(
        res => {
          if (res.ErrorCode == "0") {
            this.bValidationEmission = true;
            this.bAprobado = true;
            const data = <GenerarCip>res; // manejarlo mejor
            const factory = this.factoryResolver.resolveComponentFactory(
              FrameComponent
            );
            this.frameResult = factory.create(
              this.viewContainerRef.parentInjector
            );
            this.frameResult.instance.token = res.ErrorDesc;
            this.frameResult.instance.ancho = '100%';
            this.frameResult.instance.alto = '350px';
            // Agregar el componente al componente contenedor
            this.viewContainerRef.insert(this.frameResult.hostView);
            // Abrimos el modal
            this.modalResultado.show();
            this.bLoading = true;
          } else {
            this.bLoading = true;
            Swal.fire({
              title: "Información",
              text: "Ha ocurrido un erro al generar el código CIIP",
              type: "error",
              confirmButtonText: 'OK',
              allowOutsideClick: false,
            })
              .then((result) => {
                if (result.value) {
                  this.router.navigate(['/broker/policy-transactions']);
                }
              });
          }
        },
        err => {
          console.log(err);
        }
      );
  }
  finalizar() {
    this.formModalReference.close();
    this.modalResultado.hide();
    this.router.navigate(['/broker/request-status']);
    // window.location.reload();
  }
}
