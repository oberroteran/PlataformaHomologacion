import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PayrollService } from '../../services/payroll/payroll.service';
import { PayrollPayment } from '../../models/Payroll/payrollpayment';
import { PayrollCab } from '../../models/Payroll/payrollcab';
import { PayrollDetail } from '../../models/Payroll/payrolldetail';
import { PayrollFilter } from '../../models/payroll/payrollfilter';
import { Router, ActivatedRoute } from '@angular/router';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { DatePipe } from '@angular/common';
import { StateChannelType } from '../../models/state/statechanneltype';
import { StateService } from '../../services/state/state.service';
import { UtilityService } from '../../../../shared/services/general/utility.service';
import { ChannelPointService } from '../../../../shared/services/channelpoint/channelpoint.service';
import { ChannelSalesService } from '../../../../shared/services/channelsales/channelsales.service';
import { ChannelPoint } from '../../../../shared/models/channelpoint/channelpoint';
import { ChannelSales } from '../../../../shared/models/channelsales/channelsales';
import { ConfirmService } from '../../../../shared/components/confirm/confirm.service';
import { VisaService } from '../../../../shared/services/pago/visa.service';
import { PagoEfectivoService } from '../../../../shared/services/pago/pago-efectivo.service';
import { SessionToken } from '../../../client/shared/models/session-token.model';
import { ButtonVisaComponent } from '../../../../shared/components/button-visa/button-visa.component';
import { AppConfig } from '../../../../app.config';
import { GenerarCip } from '../../../client/shared/models/generar-cip.model';
import { FrameComponent } from '../../../../shared/components/frame/frame.component';
defineLocale('es', esLocale);

@Component({
  selector: 'app-payroll-add',
  templateUrl: './payroll-add.component.html',
  styleUrls: ['./payroll-add.component.css']
})
export class PayrollAddComponent implements OnInit, OnDestroy {
  @ViewChild('childModal', { static: true }) childModal: ModalDirective;
  @ViewChild('childModalInfo', { static: true }) childModalInfo: ModalDirective;
  @ViewChild('childModalConfirmasivo', { static: true }) childModalConfirmasivo: ModalDirective;
  flag_grabar_planilla = false;
  // true grabar planilla con la opcion grabar todos, si es false se genera la planilla despues de pagar el cupon
  IdTipoPago: string;
  messageinfo: string;
  setting_pay = '';
  planillaBuscar = '';
  planillaimporte = '';
  channelPointId = '0';
  strObservacion = '';
  channelSalesId = '2017000025';
  showSelected = true;
  showCheckbox = false;
  showFiltrosLiquidacion = false;
  showDatosLiquidacion = false;
  showbtnGenerarPlanilla = false;
  showbtnGrabarTodo = false;
  showbtnEliminardePlanilla = false;
  showFiltrosEnviar = false;
  showTitleEvaluacion = false;

  message: string;
  flagConfirmacion: string;

  ListCertificado = [];
  ListCertificadoFilter = [];
  ListPayRollGeneral: any = {};
  listPayrollDetail = [];
  listpayrollPaymentAdd = [];
  public lstStateChannel: StateChannelType[];
  public arrayNumerodoc = '';
  public tipoCanal = 0;
  selectedAll: any;
  selectedAllPlanilla: any;
  selectedAllPayment: any;
  public cantidadSoats = 0;
  public totalplanilla = 0;
  public totaldeclarado = 0;
  public saldo=0;

  public bsConfig: Partial<BsDatepickerConfig>;
  fecha = new Date();
  dia = this.fecha.getDate();
  mes = this.fecha.getMonth()==0?1:this.fecha.getMonth();
  anio = this.fecha.getFullYear();
  bsValueIni: Date = new Date(this.anio + '-' + this.mes + '-' + this.dia);
  bsValueFin: Date = new Date();
  bsValueFecOp: Date = new Date();
  public resultBank: any = {};
  public resultPaymentType: any = {};
  public resultCurrentType: any = {};
  public resultAccountBank: any = {};
  payrollPaymentAdd: any = {};
  public result: any = {};
  public resultPolAsocPlanilla: any = {};
  filter_certificat: any = {};

  public keypayment = 0;
  payrollCab = new PayrollCab(0, '', 0, '', 0, 0, 0, 0, [], [], '', '');

  ListChannelSales: any[];
  ListChannelPoint: any[];
  channelPoint = new ChannelPoint('', 0);
  channelSales: ChannelSales;

  usuario;
  bPlanillaManual = false;
  btnVisa;
  frameResult;
  bLoading = false;
  bMostrarButtons = true;
  bMostrarButtonPE = false;
  bVisa = false;
  bPagoEfectivo = false;
  bBotonesActividad = true;

  @ViewChild('modalResultadoPE', { static: true }) modalResultado;

  constructor(private payrollService: PayrollService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private serviceState: StateService,
    private router: Router,
    public utilityService: UtilityService,
    private channelPointService: ChannelPointService,
    private channelSalesService: ChannelSalesService,
    private confirmService: ConfirmService,
    private visaService: VisaService,
    private pagoEfectivoService: PagoEfectivoService,
    private viewContainerRef: ViewContainerRef,
    private factoryResolver: ComponentFactoryResolver) {
    this.bsConfig = Object.assign({},
      {
        dateInputFormat: 'DD/MM/YYYY',
        locale: 'es',
        containerClass: 'theme-dark-blue',
        showWeekNumbers: true
      });
  }

  ngOnInit() {
    this.initComponent();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.tipoCanal = +currentUser.tipoCanal;
    this.channelSalesId = currentUser.canal;
    // console.log(currentUser);
    const id = this.route.snapshot.paramMap.get('id') || '';
    const accion = this.route.snapshot.paramMap.get('accion') || '';
    const nidstate = this.route.snapshot.paramMap.get('nidstate') || '';
    this.LoadChannelSales();
    this.onSelectChannelSales(this.channelSalesId);
    if (accion === 'send') {
      const StateChannel = new StateChannelType(0, '', this.tipoCanal, +nidstate);
      this.serviceState.GetStatexChannelTypexStateAnt(StateChannel).subscribe(
        data => {
          this.lstStateChannel = <StateChannelType[]>data;
          if (this.lstStateChannel.length === 0) {
            this.showSelected = false;
            this.showTitleEvaluacion = false;
            this.showbtnGrabarTodo = false;
          } else {
            this.showSelected = true;
            this.showTitleEvaluacion = true;
            this.showbtnGrabarTodo = false;
          }         
        },
        error => { }
      );
      this.showDatosLiquidacion = true;

      // if (nidstate == '5' || nidstate == '7') {
      this.payrollCab.NIDPAYROLL = +id;
      this.payrollCab.SCODCHANNEL = this.tipoCanal;
      if (this.payrollCab.NIDPAYROLL > 0) {
        this.payrollService.GetPayRollGeneral(this.payrollCab)
          .subscribe(
            data => {
              this.ListPayRollGeneral = <PayrollCab[]>data;
              this.strObservacion = this.ListPayRollGeneral.sobservacion;

              this.listPayrollDetail = this.ListPayRollGeneral.listpayrolldetail;
              this.listpayrollPaymentAdd = this.ListPayRollGeneral.listpayrollpayment;
              this.keypayment = this.listpayrollPaymentAdd.length;
              // sumar el importa total del certificado
              this.cantidadSoats = this.listPayrollDetail.length;
              for (let e = 0; e < this.listPayrollDetail.length; e++) {
                this.totalplanilla += this.listPayrollDetail[e].npremium;
              }
              // sumar el importa total del payment
              console.log(this.listpayrollPaymentAdd);
              debugger;
              for (let i = 0; i < this.listpayrollPaymentAdd.length; i++) {
                this.totaldeclarado += this.listpayrollPaymentAdd[i].namount;
              }
              this.calcular();
            },
            error => {
              console.log(error);
            }
          );
      }
    } else if (accion === 'upd') {
      this.showSelected = false;
      this.showCheckbox = true;
      this.showFiltrosLiquidacion = true;
      this.showDatosLiquidacion = true;
      this.showbtnGenerarPlanilla = true;
      this.showbtnGrabarTodo = true;
      this.showbtnEliminardePlanilla = true;
      this.showFiltrosEnviar = true;
      this.bMostrarButtons = false;
      this.getCertificado();
      this.payrollCab.NIDPAYROLL = +id;
      if (this.payrollCab.NIDPAYROLL > 0) {
        this.payrollService.GetPayRollGeneral(this.payrollCab)
          .subscribe(
            data => {
              this.ListPayRollGeneral = <PayrollCab[]>data;
              this.listPayrollDetail = this.ListPayRollGeneral.listpayrolldetail;
              this.listpayrollPaymentAdd = this.ListPayRollGeneral.listpayrollpayment;
              this.keypayment = this.listpayrollPaymentAdd.length;
              // sumar el importa total del certificado
              this.cantidadSoats = this.listPayrollDetail.length;
              for (let e = 0; e < this.listPayrollDetail.length; e++) {
                this.totalplanilla += this.listPayrollDetail[e].npremium;
              }
              // sumar el importa total del payment
              for (let i = 0; i < this.listpayrollPaymentAdd.length; i++) {
                this.totaldeclarado += this.listpayrollPaymentAdd[i].namount;
              }
              this.calcular();
            },
            error => {
              console.log(error);
            }
          );
      }
    } else if (accion === 'add') {
      this.showSelected = false;
      this.showCheckbox = true;
      this.showFiltrosLiquidacion = true;
      this.showDatosLiquidacion = false;
      this.showbtnGenerarPlanilla = true;
      this.showbtnGrabarTodo = true;
      this.showbtnEliminardePlanilla = true;
      this.showFiltrosEnviar = true;
      this.getCertificado();
      this.obtenerTipoPagoCanal();
    } else if (accion === 'pago') {
      this.showSelected = false;
      this.showCheckbox = true;
      this.showFiltrosLiquidacion = true;
      this.showDatosLiquidacion = false;
      this.showbtnGenerarPlanilla = true;
      this.showbtnGrabarTodo = true;
      this.showFiltrosEnviar = true;
      this.showbtnEliminardePlanilla = true;
      this.bBotonesActividad = true;
      this.getCertificadoSession();
      this.obtenerTipoPagoCanal();
    }

  }

  ngOnDestroy(): void {
    if (this.btnVisa) {
      this.btnVisa.destroy();
    }

    if (this.frameResult) {
      this.frameResult.destroy();
    }
  }

  initComponent() {
    const usuarioSession = localStorage.getItem('currentUser');

    if (usuarioSession !== null) {
      this.usuario = JSON.parse(usuarioSession);
    }

    // this.getCertificado();
  }

  btngenerarpayroll() {
    this.showDatosLiquidacion = true;
  }

  aceptarmsginfo() {
    this.childModal.hide();
    this.router.navigate(['broker/payroll']);
  }

  aceptar() {
    this.childModalInfo.hide();
  }

  LoadChannelSales(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const nusercode = currentUser && currentUser.id;
    this.channelSales = new ChannelSales(nusercode, '0', '');
    this.channelSalesService.getPostChannelSales(this.channelSales)
      .subscribe(
        data => {
          this.ListChannelSales = <any[]>data;
          // Si tiene un canal seleccionado por defecto
          // if (this.ListChannelSales.length === 1) {
          //   this.ListChannelSales.forEach(element => {
          //     // this.ChannelSaleSelected = element.nchannel
          //     this.channelSalesId = '2017000025'; // element.nchannel;
          //   });
          // } else {
          //   this.channelSalesId = '0';
          // }
        },
        error => {
          console.log(error);
        }
      );
  }

  onSelectChannelPoint(channelPointId) {
    this.channelPointId = channelPointId;
  }

  onSelectChannelSales(channelSalesId) {
    this.channelSalesId = channelSalesId;
    if (channelSalesId === '0') {
      this.ListChannelPoint = [];
    } else {
      const salePoint = new ChannelPoint(channelSalesId.toString(), 0);
      this.channelPointService.getPostChannelPoint(salePoint)
        .subscribe(
          data => {
            // console.log(data);
            this.ListChannelPoint = <any[]>data;
          },
          error => {
            console.log(error);
          }
        );
    }
  }

  CancelaryRegresar(): void {
    this.router.navigate(['broker/payroll']);
  }

  onSelectState(StateID) {
    if (StateID === '0') {
      this.payrollCab.NIDSTATE = +StateID;
    } else {
      this.payrollCab.NIDSTATE = +StateID;
    }
  }

  onEventSearch() {
    this.getCertificado();
  }

  getCertificado() {
    const payrollFilterCertificate = new PayrollFilter('01/01/2017', '01/01/2019', 0, '2018000059', '', 0);
    payrollFilterCertificate.DISSUEDAT_INI = this.datePipe.transform(this.bsValueIni, 'dd/MM/yyyy');
    payrollFilterCertificate.DISSUEDAT_FIN = this.datePipe.transform(this.bsValueFin, 'dd/MM/yyyy');
    payrollFilterCertificate.SCHANNEL_BO = this.channelSalesId;
    payrollFilterCertificate.SSALEPOINT_BO = this.channelPointId;
    this.payrollService.getPostCertificado(payrollFilterCertificate)
      .subscribe(
        data => {
          this.ListCertificado = <any[]>data;
          for (let e = 0; e < this.ListCertificado.length; e++) {
            for (let e = 0; e < this.listPayrollDetail.length; e++) {
              const objeto = this.ListCertificado.find(x => x.npolicy === this.listPayrollDetail[e].npolicy);
              const index = this.ListCertificado.indexOf(objeto);
              if (index >= 0) {
                //this.ListCertificado.splice(index); 
                this.ListCertificadoFilter.push(objeto);
              }
            }
          }
          let missing = this.ListCertificado.filter(item => this.ListCertificadoFilter.indexOf(item) < 0);
          this.ListCertificado = missing;
        },
        error => {
          console.log(error);
        }
      );
  }

  getCertificadoSession() {

    const payrollFilterCertificate = new PayrollFilter('01/01/2017', '01/01/2019', 0, '2018000059', '', 0);
    payrollFilterCertificate.DISSUEDAT_INI = this.datePipe.transform(this.bsValueIni, 'dd/MM/yyyy');
    payrollFilterCertificate.DISSUEDAT_FIN = this.datePipe.transform(this.bsValueFin, 'dd/MM/yyyy');
    payrollFilterCertificate.SCHANNEL_BO = this.channelSalesId;
    payrollFilterCertificate.SSALEPOINT_BO = this.channelPointId;
    this.payrollService.getPostCertificado(payrollFilterCertificate)
      .subscribe(
        data => {
          this.ListCertificado = <any[]>data;
          const pagoPlanilla = JSON.parse(sessionStorage.getItem('planilla'));
          this.ListPayRollGeneral = <PayrollCab[]>pagoPlanilla;
          this.listPayrollDetail = pagoPlanilla.LISTPAYROLLDETAIL;

          for (let e = 0; e < this.ListCertificado.length; e++) {
            for (let e = 0; e < this.listPayrollDetail.length; e++) {
              const objeto = this.ListCertificado.find(x => x.npolicy === this.listPayrollDetail[e].npolicy);
              const index = this.ListCertificado.indexOf(objeto);
              if (index >= 0) {
                //this.ListCertificado.splice(index); 
                this.ListCertificadoFilter.push(objeto);
              }
            }
          }
          let missing = this.ListCertificado.filter(item => this.ListCertificadoFilter.indexOf(item) < 0);
          this.ListCertificado = missing;

          this.cantidadSoats = this.listPayrollDetail.length;
          for (let e = 0; e < this.listPayrollDetail.length; e++) {
            this.totalplanilla += this.listPayrollDetail[e].npremium;
          } 
          this.calcular();                   
        },
        error => {
          console.log(error);
        }
      );
  }

  selectAll() {
    for (let i = 0; i < this.ListCertificado.length; i++) {
      this.ListCertificado[i].selected = this.selectedAll;
    }
  }

  selectAllPlanilla() {
    for (let i = 0; i < this.listPayrollDetail.length; i++) {
      this.listPayrollDetail[i].selected = this.selectedAllPlanilla;
    }
  }

  selectAllPayment() {
    for (let i = 0; i < this.listpayrollPaymentAdd.length; i++) {
      this.listpayrollPaymentAdd[i].selected = this.selectAllPayment;
    }
  }

  checkIfAllSelected() {
    this.ListCertificado.every(function (item: PayrollDetail) { return item.selected === true; });
  }

  checkIfAllSelectedPlanilla() {
    this.listPayrollDetail.every(function (item: PayrollDetail) { return item.selected === true; });
  }

  checkIfAllSelectedPayment() {
    this.listpayrollPaymentAdd.every(function (item: PayrollPayment) { return item.selected === true; });
  }

  btn_Incluir() {
    let contador = 0;
    for (let i = 0; i < this.ListCertificado.length; i++) {
      if (this.ListCertificado[i].selected === true) {
        this.arrayNumerodoc += this.ListCertificado[i].npolicy + ',';
        contador++;
      }
    }
    if (contador > 0) {
      this.EliminarCertificado();
    } else {
      this.messageinfo = 'Por favor, seleccione un registro';
      this.childModalInfo.show();
    }
  }

  EliminarCertificado() {
    this.arrayNumerodoc = this.arrayNumerodoc.slice(0, -1);
    const arrayDocaElimnar = this.arrayNumerodoc.split(',');
    for (let e = 0; e < arrayDocaElimnar.length; e++) {
      this.cantidadSoats++;
      const npolicy = +arrayDocaElimnar[e];
      const objeto = this.ListCertificado.find(book => book.npolicy === npolicy);
      objeto.selected = false;
      objeto.NIDPAYROLLDETAIL = 1000;
      objeto.NUSERREGISTER = 9999;
      this.totalplanilla += objeto.npremium;
      
      this.listPayrollDetail.push(objeto);
      const Index = this.ListCertificado.indexOf(objeto);
      this.ListCertificado.splice(Index, 1);
    }
    this.arrayNumerodoc = '';
    this.selectedAll = false;
  }

  btn_Eliminar() {
    let contador = 0;
    for (let e = 0; e < this.listPayrollDetail.length; e++) {
      if (this.listPayrollDetail[e].selected === true) {
        this.arrayNumerodoc += this.listPayrollDetail[e].npolicy + ',';
        contador++;
      }
    }
    if (contador > 0) {
      this.EliminarCertificadoAgregados();
    } else {
      this.messageinfo = 'Por favor, seleccione un registro';
      this.childModalInfo.show();
    }
  }

  EliminarCertificadoAgregados() {
    // eliminar listado matriz
    this.arrayNumerodoc = this.arrayNumerodoc.slice(0, -1);
    const arrayDocaElimnar = this.arrayNumerodoc.split(',');
    for (let e = 0; e < arrayDocaElimnar.length; e++) {
      this.cantidadSoats--;
      const npolicy = +arrayDocaElimnar[e];
      const objeto = this.listPayrollDetail.find(book => book.npolicy === npolicy);
      this.totalplanilla -= objeto.npremium;
      objeto.selected = false;
      this.ListCertificado.push(objeto);
      const index = this.listPayrollDetail.indexOf(objeto);
      this.listPayrollDetail.splice(index, 1);
    }
    this.arrayNumerodoc = '';
    this.selectedAllPlanilla = false;
    this.calcular();
  }

  AgregarDatosLiquidacion() {
    if (this.resultCurrentType.id === undefined || this.resultCurrentType.id === null || this.resultCurrentType.id === '0') {
      this.messageinfo = 'Por favor, seleccione tipo de moneda';
      this.childModalInfo.show();
      return;
    }
    if (this.payrollPaymentAdd.NAMOUNT === undefined || this.payrollPaymentAdd.NAMOUNT === null || this.payrollPaymentAdd.NAMOUNT === '') {
      this.messageinfo = 'Por favor, ingrese importe';
      this.childModalInfo.show();
      return;
    }
    if (this.resultPaymentType.id === undefined || this.resultPaymentType.id === null || this.resultPaymentType.id === '0') {
      this.messageinfo = 'Por favor, seleccione tipo de pago';
      this.childModalInfo.show();
      return;
    }
    if (this.resultBank.id === undefined || this.resultBank.id === null || this.resultBank.id === '0') {
      this.messageinfo = 'Por favor, seleccione un banco';
      this.childModalInfo.show();
      return;
    }
    if (this.payrollPaymentAdd.SOPERATIONNUMBER === undefined
      || this.payrollPaymentAdd.SOPERATIONNUMBER === null
      || this.payrollPaymentAdd.SOPERATIONNUMBER === '') {
      this.messageinfo = 'Por favor, ingrese numero de operación';
      this.childModalInfo.show();
      return;

    }
    if (this.payrollPaymentAdd.SREFERENCE === undefined
      || this.payrollPaymentAdd.SREFERENCE === null
      || this.payrollPaymentAdd.SREFERENCE === '') {
      this.messageinfo = 'Por favor, ingrese referencia';
      this.childModalInfo.show();
      return;
    }

    this.keypayment++;
    const payrollpayment = new PayrollPayment(0, 0, 0, 0, 0, 0, '', '', '', '', 0, '', '', '', '', false);
    payrollpayment.nidpayrolldetail = this.keypayment;
    payrollpayment.ncurrency = this.resultCurrentType.id;
    payrollpayment.ncurrencytext = this.resultCurrentType.text;

    payrollpayment.nbank = this.resultBank.id;
    payrollpayment.nbanktext = this.resultBank.text;

    payrollpayment.nbankaccount = this.resultAccountBank.id;
    payrollpayment.nbankaccounttext = this.resultAccountBank.text;

    payrollpayment.nidpaidtype = this.resultPaymentType.id;
    payrollpayment.nidpaidtypetext = this.resultPaymentType.text;

    payrollpayment.namount = +this.payrollPaymentAdd.NAMOUNT;
    payrollpayment.soperationnumber = this.payrollPaymentAdd.SOPERATIONNUMBER;
    payrollpayment.doperationdate = this.datePipe.transform(this.bsValueFecOp, 'dd/MM/yyyy');
    payrollpayment.sreference = this.payrollPaymentAdd.SREFERENCE;
    payrollpayment.sstate = '2';
    payrollpayment.nuserregister = 9997;
    payrollpayment.selected = false;
  
    if (this.listpayrollPaymentAdd.length > 0) {

      const objeto = this.listpayrollPaymentAdd.find(payrollpaymentsearch =>
        payrollpaymentsearch.nbank === payrollpayment.nbank &&
        payrollpaymentsearch.soperationnumber === payrollpayment.soperationnumber
      );
      if (objeto != null) {
        this.messageinfo = 'El número de operación ya existe';
        this.childModalInfo.show();
        return;
      } else {
        this.listpayrollPaymentAdd.push(payrollpayment);
      }
    } else {
      this.listpayrollPaymentAdd.push(payrollpayment);
    }
    this.totaldeclarado += payrollpayment.namount;

    this.payrollPaymentAdd.NAMOUNT = '';
    this.payrollPaymentAdd.SOPERATIONNUMBER = '';
    this.payrollPaymentAdd.SREFERENCE = '';
    this.calcular();
  }

  QuitarDatosLiquidacion() {
    for (let i = 0; i < this.listpayrollPaymentAdd.length; i++) {
      if (this.listpayrollPaymentAdd[i].selected === true) {
        this.arrayNumerodoc += this.listpayrollPaymentAdd[i].nidpayrolldetail + ',';
      }
    }
    this.EliminarPayment();
  }

  EliminarPayment() {
    this.arrayNumerodoc = this.arrayNumerodoc.slice(0, -1);
    const arrayDocaElimnar = this.arrayNumerodoc.split(',');
    for (let e = 0; e < arrayDocaElimnar.length; e++) {
      const nidpayrolldetail = +arrayDocaElimnar[e];
      const objeto = this.listpayrollPaymentAdd.find(book => book.nidpayrolldetail === nidpayrolldetail);
      this.keypayment--;
      this.totaldeclarado -= objeto.namount;
      objeto.selected = false;
      const Index = this.listpayrollPaymentAdd.indexOf(objeto);
      this.listpayrollPaymentAdd.splice(Index, 1);
    }
    this.arrayNumerodoc = '';
    this.selectedAllPayment = false;
    this.calcular();
  }

  onVotedParentBank(Bank: any) {
    this.resultBank = Bank;
  }

  onVotedParentAccountBank(AccountBank: any) {
    this.resultAccountBank = AccountBank;
  }

  onVotedCurrentType(CurrentType: any) {
    this.resultCurrentType = CurrentType;
  }

  onVotedParentPaymentType(PaymentType: any) {
    this.resultPaymentType = PaymentType;
  }

  derivarPlanilla() {

    if (this.payrollCab.NIDSTATE === 0) {
      this.messageinfo = 'Por favor seleccione un estado';
      this.childModalInfo.show();
    } else {
      if ((this.totalplanilla - this.totaldeclarado) !== 0) {
        this.messageinfo = 'La planilla debe de cuadrar para ser enviada a evaluación';
        this.childModalInfo.show();
      } else {
        this.payrollCab.sobservacion = this.strObservacion;
        this.payrollService.getPostDerivarPlanilla(this.payrollCab)
          .subscribe(
            data => {
              this.result = data;
              this.messageinfo = this.result.noutidpayroll;
              this.childModal.show();
            },
            error => {
              console.log(error);
            }
          );
      }
    }
  }

  grabarTodo() {
    let valido = this.validarLiquidacion();
    if (valido == false) return;

    this.payrollCab.NAMOUNTTOTAL =Math.round(this.totalplanilla*100)/100;
    this.payrollCab.NIDSTATE = 1;
    this.payrollCab.NQUANTITY = this.cantidadSoats;
    this.payrollCab.NUSERREGISTER = 999;
    this.payrollCab.DREGPAYROLL = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    this.payrollCab.SCODCHANNEL = this.usuario.canal;
    this.payrollCab.LISTPAYROLLDETAIL = this.listPayrollDetail;
    this.payrollCab.LISTPAYROLLPAYMENT = this.listpayrollPaymentAdd;
    this.listPayrollDetail = [];
    this.listpayrollPaymentAdd = [];
    this.cantidadSoats = 0;
    this.totalplanilla = 0;
    this.totaldeclarado = 0;
    this.payrollService.getPostGrabarPlanillaManual(this.payrollCab)
      .subscribe(
        data => {
          this.result = data;
          if (this.payrollCab.NIDPAYROLL === 0) {
            this.messageinfo = 'Se generó la Planilla Nro: ' + this.result.noutidpayroll;
            this.childModal.show();
          } else {
            this.messageinfo = 'Se actualizó los de la Planilla Nro: ' + this.result.noutidpayroll;
            this.childModal.show();
          }
        },
        error => {
          console.log(error);
        }
      );
  }

  validarPlanilla() {
    if (this.cantidadSoats == 0) {
      this.messageinfo = 'El monto de la planilla no puede ser cero';
      this.childModalInfo.show();
      return false;
    }
    return true;
  }
  validarLiquidacion() {
    let valido = this.validarPlanilla();
    if (valido == false) return false;
    // if(this.totaldeclarado==0)
    // {
    //   this.messageinfo = 'El monto a liquidar no puede ser cero';
    //   this.childModalInfo.show();
    //   return false;
    // }
    return true;
  }

  //#region Pagos
  confirmarMedioPago(tipoPago: string, flag_grabar_planilla: boolean) {
    let valido = this.validarPlanilla();
    if (valido == false) return;

    if (flag_grabar_planilla === true) {
      this.flag_grabar_planilla = flag_grabar_planilla;
      this.bLoading = false;
      this.bMostrarButtons = false;
      this.showDatosLiquidacion = true;
    } else {
      let NPOLICYLIST = '';
      this.listPayrollDetail.forEach(element => {
        NPOLICYLIST += element.npolicy + ',';
      });
      if (this.listPayrollDetail.length > 0) {
        NPOLICYLIST = NPOLICYLIST.slice(0, -1);
        const detaill = new PayrollDetail(0, 0, '', 0, '', 0, 0, '', '', '', '', '', 0, '', '', '', '', '', '', '', '', false, 0);
        detaill.NPOLICYLIST = NPOLICYLIST;
        this.payrollService.ValidarPolizaAsociadoAplanilla(detaill)
          .subscribe(
            data => {
              this.resultPolAsocPlanilla = data;
              let NIDPAYROLLIST;
              this.resultPolAsocPlanilla.forEach(element => {
                NIDPAYROLLIST += element.nidpayroll + ',';
              });
              if (this.resultPolAsocPlanilla.length > 0) {
                NIDPAYROLLIST = NIDPAYROLLIST.slice(0, -1);
                this.messageinfo = 'El número de póliza ' + NIDPAYROLLIST + ' se encuentra asociado a una Planilla';
                this.childModalInfo.show();
              } else {
                this.flag_grabar_planilla = flag_grabar_planilla;
                this.childModalConfirmasivo.show();
                this.message = 'Esta seguro de seleccionar el medio de pago? Esta acción no se puede deshacer';
                this.flagConfirmacion = 'confirmacionmediopago';
                this.IdTipoPago = tipoPago;
              }
            },
            error => {
              console.log(error);
            }
          );
      } else {
        this.childModalConfirmasivo.show();
        this.message = 'Esta seguro de seleccionar el medio de pago? Esta acción no se puede deshacer';
        this.flagConfirmacion = 'confirmacionmediopago';
        this.IdTipoPago = tipoPago;
      }
    }
  }

  registrarPlanilla(tipoPago: string) {
    this.payrollCab.NAMOUNTTOTAL = this.totalplanilla;
    this.payrollCab.NIDSTATE = 1;
    this.payrollCab.NQUANTITY = this.cantidadSoats;
    this.payrollCab.NUSERREGISTER = this.usuario.id;
    this.payrollCab.DREGPAYROLL = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    this.payrollCab.SCODCHANNEL = this.usuario.canal;
    this.payrollCab.LISTPAYROLLDETAIL = this.listPayrollDetail;
    this.payrollCab.LISTPAYROLLPAYMENT = [];
    // this.listPayrollDetail = [];
    // this.listpayrollPaymentAdd = [];
    // this.cantidadSoats = 0;
    // this.totalplanilla = 0;
    // this.totaldeclarado = 0;

    sessionStorage.setItem('planilla', JSON.stringify(this.payrollCab));

    switch (tipoPago) {
      case '1':
        this.mostrarPlanillaManual();
        break;
      case '2':
        this.crearBotonVisa();
        break;
      case '3':
        this.mostrarBotonPagoEfectivo();
        break;
      default:
        break;
    }
    // this.payrollService.getPostGrabarPlanillaManual(this.payrollCab)
    //   .subscribe(
    //     res => {
    //       // console.log(res);
    //       const data = JSON.parse(JSON.stringify(res));
    //       // this.planillaId = data.noutidpayroll;
    //       this.payrollCab.NIDPAYROLL = data.noutidpayroll;

    //       sessionStorage.setItem('planilla', JSON.stringify(this.payrollCab));

    //       switch (tipoPago) {
    //         case '1':
    //           this.mostrarPlanillaManual();
    //           break;
    //         case '2':
    //           this.crearBotonVisa();
    //           break;
    //         case '3':
    //           this.mostrarBotonPagoEfectivo();
    //           break;
    //         default:
    //           break;
    //       }
    //     },
    //     err => {
    //       console.log(err);
    //     }
    //   );
  }

  mostrarPlanillaManual() {
    this.bLoading = false;
    this.bMostrarButtons = false;
    this.bPlanillaManual = true;
    this.showDatosLiquidacion = true;
  }

  crearBotonVisa() {
    // console.log('Pago con Visa');
    this.bMostrarButtons = false;
    this.generarSessionToken();
  }

  generarSessionToken() {
    this.visaService.generarSessionToken(this.totalplanilla, // monto
      this.usuario.id) // user Id
      .subscribe(
        res => {
          // console.log(res);
          const data = <SessionToken>res;
          sessionStorage.setItem('sessionToken', data.sessionToken);
          const factory = this.factoryResolver.resolveComponentFactory(ButtonVisaComponent);
          this.btnVisa = factory.create(this.viewContainerRef.parentInjector);
          this.btnVisa.instance.action = AppConfig.ACTION_FORM_VISA_PAYROLL;
          this.btnVisa.instance.amount = this.payrollCab.NAMOUNTTOTAL; // Enviar el monto total
          this.btnVisa.instance.sessionToken = data.sessionToken;
          this.btnVisa.instance.purchaseNumber = data.purchaseNumber;
          this.btnVisa.instance.merchantLogo = AppConfig.MERCHANT_LOGO_VISA;
          this.btnVisa.instance.userId = this.usuario.id; // Enviar el id del usuario
          // Agregar el componente al componente contenedor
          this.viewContainerRef.insert(this.btnVisa.hostView);
          this.bLoading = false;
        },
        error => {
          console.log(error);
        }
      );
  }

  mostrarBotonPagoEfectivo() {
    // console.log('Pago Efectivo');
    this.bMostrarButtons = false;
    this.bMostrarButtonPE = true;
    this.bLoading = false;
  }

  pagarConPagoEfectivo() {
    this.bMostrarButtonPE = false;
    this.bLoading = true;
    this.pagoEfectivoService
      .generarCip(this.usuario.firstName, // nombres del usuario
        this.usuario.lastName, // apellidos del usuario
        this.usuario.email, // correo del usuario
        this.totalplanilla, // monto
        '', // proceso Id
        this.payrollCab.NIDPAYROLL, // planilla Id
        AppConfig.FLUJO_PLANILLA, 
        this.usuario.id) // usuario Id
      .subscribe(
        res => {
          // console.log(res);
          const data = <GenerarCip>res;

          if (data.estado === '1') { // Cip generado correctamente
            const factory = this.factoryResolver.resolveComponentFactory(FrameComponent);
            this.frameResult = factory.create(this.viewContainerRef.parentInjector);
            this.frameResult.instance.token = data.token;
            this.frameResult.instance.ancho = '100%';
            this.frameResult.instance.alto = '100%';
            // Agregar el componente al componente contenedor
            this.viewContainerRef.insert(this.frameResult.hostView);
            // Abrimos el modal
            this.modalResultado.show();
            this.bLoading = false;

            // GRABAR PLANILLA AQUI
            this.payrollCab.NIDSTATE = 10;
            this.payrollCab.CIPNUMERO = data.cipNumero;
            this.payrollService
              .getPostGrabarPlanillaManual(this.payrollCab)
              .subscribe(
                response => {
                  this.result = response;
                  if (this.payrollCab.NIDPAYROLL === 0) {
                    this.messageinfo = 'Se generó la Planilla Nro: ' + this.result.noutidpayroll;
                    this.childModal.show();
                  } else {
                    this.messageinfo = 'Se actualizó los datos de la Planilla Nro: ' + this.result.noutidpayroll;
                    this.childModal.show();
                  }
                },
                err => {
                  console.log(err);
                }
              );
          } else {
            // Ocurrio un error al intentar generar el Cip. Por favor, vuelva a intentarlo
            this.bLoading = false;
          }
        },
        err => {
          console.log(err);
          this.bLoading = false;
          // this.mostrarPE = true;
        }
      );
  }

  finalizar() {
    document.body.classList.remove("modal-open");
    this.modalResultado.hide();
    this.router.navigate(['broker/payroll']);
  }
  //#endregion


  closeconfirm(): void {
    this.childModalConfirmasivo.hide();
  }

  confirm(): void {
    if (this.flagConfirmacion === 'confirmacionmediopago') {
      this.showbtnEliminardePlanilla = false;
      this.bBotonesActividad = false;
      this.bLoading = true;
      this.registrarPlanilla(this.IdTipoPago);
      this.bLoading = false;
    }
    this.childModalConfirmasivo.hide();
  }


  calcular()
  {
    this.saldo=(Math.round(this.totalplanilla*100)/100) - (Math.round(this.totaldeclarado*100)/100);

  }
  obtenerTipoPagoCanal() {
    this.setting_pay = AppConfig.SETTINGS_PAYROLL;

    this.payrollService.getCanalTipoPago(this.channelSalesId, this.setting_pay).subscribe(
      res => {
        if (res != null) {
          this.bVisa = res['bvisa'] == '1' ? true : false;
          this.bPagoEfectivo = res['bpagoefectivo'] == '1' ? true : false;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

}
