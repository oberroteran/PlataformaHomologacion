import { Component, OnInit, ViewContainerRef, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { AppConfig } from '../../../../../app.config';
import { ButtonVisaComponent } from '../../../../../shared/components/button-visa/button-visa.component';
import { Certificado } from '../../../models/certificado/certificado';
import { VisaService } from '../../../../../shared/services/pago/visa.service';
import { SessionToken } from '../../../../client/shared/models/session-token.model';
import { Contratante } from '../../../../client/shared/models/contratante.model';
import { Auto } from '../../../../client/shared/models/auto.model';
import { FrameComponent } from '../../../../../shared/components/frame/frame.component';
import { EmisionService } from '../../../../client/shared/services/emision.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  btnVisa;

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

  frameResult;
  @ViewChild('modalResultadoPE', { static: true }) modalResultado;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private factoryResolver: ComponentFactoryResolver,
    private visaService: VisaService,
    private appConfig: AppConfig,
    private emisionService: EmisionService
  ) { }

  ngOnInit() {
    //this.crearBotonVisa();

  }
  crearBotonVisa() {
    // let certificado = new Certificado();
    // certificado.P_NPREMIUM = 124.00;
    // let item = {
    //   amount: 60,
    //   expirationTime: "1568156130971",
    //   flujoId: null,
    //   id: 20388,
    //   planillaId: 0,
    //   purchaseNumber: "568153430",
    //   sessionKey: "9aeae54eb2bd8b09f475bcc921df75269badae8f97d3ec7a458ecd3a9ea4411d",
    //   sessionToken: "568153430",
    //   userId: null
    // }
    // sessionStorage.setItem('visasession', JSON.stringify(item));

    // const visasession = JSON.parse(sessionStorage.getItem('visasession'));
    // sessionStorage.setItem('sessionToken', visasession.sessionToken);
    // const factory = this.factoryResolver.resolveComponentFactory(
    //   ButtonVisaComponent
    // );
    // this.btnVisa = factory.create(this.viewContainerRef.parentInjector);
    // this.btnVisa.instance.action = AppConfig.ACTION_FORM_VISA_BROKER;
    // this.btnVisa.instance.amount = certificado.P_NPREMIUM;
    // this.btnVisa.instance.sessionToken = visasession.sessionToken;
    // this.btnVisa.instance.purchaseNumber = visasession.purchaseNumber;
    // this.btnVisa.instance.merchantLogo = AppConfig.MERCHANT_LOGO_VISA;
    // this.btnVisa.instance.userId = ''; // => en el flujo broker se debe enviar el id del usuario
    // // Agregar el componente al componente contenedor
    // this.viewContainerRef.insert(this.btnVisa.hostView);


    this.visaService.generarSessionToken(65.20, 2201) // user Id
      .subscribe(
        res => {
          // console.log(res);
          const data = <SessionToken>res;
          sessionStorage.setItem('sessionToken', data.sessionToken);
          const factory = this.factoryResolver.resolveComponentFactory(ButtonVisaComponent);
          this.btnVisa = factory.create(this.viewContainerRef.parentInjector);
          this.btnVisa.instance.action = AppConfig.ACTION_FORM_VISA_PAYROLL;
          this.btnVisa.instance.amount = 65.20;
          this.btnVisa.instance.sessionToken = data.sessionToken;
          this.btnVisa.instance.purchaseNumber = data.purchaseNumber;
          this.btnVisa.instance.merchantLogo = AppConfig.MERCHANT_LOGO_VISA;
          this.btnVisa.instance.userId = 2201; // Enviar el id del usuario
          // Agregar el componente al componente contenedor
          this.viewContainerRef.insert(this.btnVisa.hostView);
          // this.bLoading = false;
        },
        error => {
          console.log(error);
        }
      );
  }
  // processPE() {
  //   this.bValidationEmission = true;
  //   this.bAprobado = true;
  //   //const data = <GenerarCip>res; // manejarlo mejor
  //   const factory = this.factoryResolver.resolveComponentFactory(
  //     FrameComponent
  //   );
  //   this.frameResult = factory.create(
  //     this.viewContainerRef.parentInjector
  //   );
  //   // this.frameResult.instance.token = res.errorDesc;
  //   this.frameResult.instance.token = "xxxxxxtokenxxxxxxx";
  //   this.frameResult.instance.ancho = '100%';
  //   this.frameResult.instance.alto = '95%';
  //   // Agregar el componente al componente contenedor
  //   this.viewContainerRef.insert(this.frameResult.hostView);
  //   // Abrimos el modal
  //   this.modalResultado.show();
  //   this.bLoading = false;

  //   this.appConfig.pixelEvent(
  //     'virtualEvent',
  //     'SOAT Digital - Cliente - Pago',
  //     'Pago Efectivo',
  //     'Reserva satisfactoria'
  //   );

  //   this.appConfig.pixelSaveClientID();
  //   const idClientTrack = sessionStorage.getItem('idClientTrack');
  // }
  processPE() {
    this.cliente.p_NPERSON_TYP = "1";
    this.cliente.p_NDOCUMENT_TYP = "2";
    this.cliente.p_SDOCUMENT = "72185297";
    this.cliente.p_SLEGALNAME = "";
    this.cliente.p_SCLIENT_NAME = "WALTER FREDY";
    this.cliente.p_SCLIENT_APPPAT = "HUANACO";
    this.cliente.p_SCLIENT_APPMAT = "HUAYTA";
    this.cliente.p_NPROVINCE = "3";
    this.cliente.p_NLOCAT = "301";
    this.cliente.p_NMUNICIPALITY = "30104";
    this.cliente.p_SADDRESS = "ddqweqwe12312";
    this.cliente.p_SMAIL = "adqwe@gmail.com";
    this.cliente.p_SPHONE = "971879879";
    this.cliente.p_NIDPROCESS = "2135304";
    this.cliente.V_NIDPROCESS = "2135304";

    this.canal = "2015000002";
    this.puntoDeVenta = "2";


    let item = {
      ProcessId: "4421210",
      Name: "Nombre Nombre",
      LastName: "Apellido Apellido",
      Email: "abc@hotmail.com",
      Amount: 143.25,
      Client: "client123",
      Canal: "canal123",
      PuntoDeVenta: "pventa123"
    }

    this.emisionService
      .emissionProcessCompletePolicy(
        '',
        '',
        item.ProcessId,
        '',
        AppConfig.FLUJO_CLIENTE, // Constante
        '',
        '2',
        item.Name,
        item.LastName,
        item.Email,
        item.Amount,
        this.cliente,
        this.canal,
        this.puntoDeVenta,
        this.modalidad
      )
      .subscribe(
        res => {
          if (res.errorCode === '0') {
            this.bValidationEmission = true;
            this.bAprobado = true;
            //const data = <GenerarCip>res; // manejarlo mejor
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
}