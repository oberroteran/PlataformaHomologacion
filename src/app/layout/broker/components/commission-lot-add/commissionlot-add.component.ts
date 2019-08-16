import {
  Component,
  OnInit,
  ComponentFactoryResolver,
  ViewContainerRef,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CommissionLotService } from '../../services/commisslot/comissionlot.service';
import { CommissionLotAttach } from '../../models/commissionlot/commissionlotattach';
import { CommissionLotCab } from '../../models/commissionlot/commissionlotcab';
import { CommissionLotDetail } from '../../models/commissionlot/commisssionlotdetail';
import { CommissionLotFilter } from '../../models/commissionlot/commissionlotfilter';
import { FileUploadComponent } from '../../shared/fileupload/fileupload.component';
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
import { FileUploadService } from '../../services/fileupload/fileupload.service';
import { TableType } from '../../models/commissionlot/tabletype';
import { CommissionState } from '../../models/commissionlot/commissionstate';
import { AppConfig } from '../../../../app.config';
import { BankService } from '../../../../shared/services/bank/bank.service';
import { DownloadDto } from '../../models/download/download';

defineLocale('es', esLocale);

@Component({
  selector: 'app-commissionlot-add',
  templateUrl: './commissionlot-add.component.html',
  styleUrls: ['./commissionlot-add.component.css']
})
export class CommissionLotAddComponent implements OnInit, OnDestroy {
  @ViewChild('childModal', { static: true }) childModal: ModalDirective;
  @ViewChild('childModalInfo', { static: true }) childModalInfo: ModalDirective;
  @ViewChild('childModalConfirmasivo', { static: true }) childModalConfirmasivo: ModalDirective;

  flag_grabar_commissionlot = false;
  // true grabar planilla con la opcion grabar todos, si es false se genera la planilla despues de pagar el cupon
  IdTipoPago: string;
  messageinfo: string;
  setting_pay = '';
  bDatosFactura = true;
  commissionlotBuscar = '';
  commissionlotimporte = '';
  channelPointId = '0';
  strObservacion = '';
  channelSalesId = '2017000025';
  StateID = 0;
  showSelected = true;
  showCheckbox = false;
  showFiltrosLiquidacion = false;
  showDatosLiquidacion = false;
  showbtnGenerarCommissionLot = false;
  showbtnGrabarTodo = false;
  showbtnEliminardeCommissionLot = false;
  showFiltrosEnviar = false;
  showTitleEvaluacion = false;
  P_NIDPAYROLL: number;
  message: string;
  flagConfirmacion: string;
  snameFile: string;
  ListCertificado = [];
  ListCertificadoFilter = [];
  ListCommissionLotGeneral: any = {};
  listCommissionLotDetail = [];
  listCommissionLotAttach = [];
  public lstStateChannel: StateChannelType[];
  public arrayNumerodoc = '';
  public tipoCanal = 0;
  selectedAll: any;
  selectedAllCommissLot: any;
  selectedAllCommissLotAttach: any;
  public cantidadSoats = 0;
  public totalplanilla = 0;
  public totaldeclarado = 0;
  public saldo = 0;
  nidStateApprob: number;
  public bsConfig: Partial<BsDatepickerConfig>;
  fecha = new Date();
  dia = this.fecha.getDate();
  mes = this.fecha.getMonth() === 0 ? 1 : this.fecha.getMonth();
  anio = this.fecha.getFullYear();
  bsValueIni: Date = new Date(this.anio + '-' + this.mes + '-' + this.dia);
  bsValueFin: Date = new Date();
  bsValueFecOp: Date = new Date();
  sValueFec: string;
  public resultBank: any = {};
  public resultPaymentType: any = {};
  public resultCurrentType: any = {};
  public resultAccountBank: any = {};
  payrollPaymentAdd: any = {};
  public result: any = {};
  public resultPolAsocPlanilla: any = {};
  filter_certificat: any = {};
  public keypayment = 0;
  commissionlotCab = new CommissionLotCab(
    0,
    0,
    0,
    '',
    0,
    0,
    0,
    '',
    '',
    '',
    '',
    0,
    0,
    '',
    '',
    '',
    '',
    [],
    '',
    '',
    0,
    0,
    true,
    [],
    []
  );

  ListChannelSales: any[];
  ListChannelPoint: any[];
  channelPoint = new ChannelPoint('', 0);
  channelSales: ChannelSales;
  selVoucherType: number;
  selAccountType: number;
  selBank: number;
  berror: boolean;

  public lstBranch: TableType[];
  ListBranch: any[];
  ListBranchID = '';

  public lstCommisionState: CommissionState[];
  ListCommissionState: any[];
  ListCommissionStateID = '';
  banks: any[];

  public lstVoucherType: TableType[];
  ListVoucherType: any[];
  ListVoucherTypeID = '';

  public lstAccountType: TableType[];
  commissionFilter: CommissionLotFilter;

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
  nCountFile: number = 0;

  LstfilesUpload: FileList;
  fileUpload: File;
  filesComm: Array<File> = [];
  FlagRegresar: boolean = false;
  maxSerie: number = 3;
  flagSerie: number = 0;
  flagGrabarTodo: boolean = false;
  flagModulo: string;
  flagEliminarArchivo: boolean = true;
  amount_netosaldo: number;
  amount_notacredito: number;
  public deleteSnamefile: string;
  public deleteId: Number;


  @ViewChild('modalResultadoPE', { static: true }) modalResultado;

  constructor(
    private commissionlotService: CommissionLotService,
    private banckService: BankService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private serviceState: StateService,
    private router: Router,
    public utilityService: UtilityService,
    private channelPointService: ChannelPointService,
    private channelSalesService: ChannelSalesService,
    private confirmService: ConfirmService,
    private fileUploadService: FileUploadService
  ) {
    this.bsConfig = Object.assign(
      {},
      {
        dateInputFormat: 'DD/MM/YYYY',
        locale: 'es',
        containerClass: 'theme-dark-blue',
        showWeekNumbers: true
      }
    );

    this.sValueFec = new Date().toString();
    this.selVoucherType = 0;
    this.selBank = 0;
    this.selAccountType = 0;
    this.berror = false;
    this.P_NIDPAYROLL = 0;
  }

  ngOnInit() {
    this.initComponent();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.tipoCanal = +currentUser.tipoCanal;
    this.channelSalesId = currentUser.canal;
    const id = this.route.snapshot.paramMap.get('id') || '';
    const accion = this.route.snapshot.paramMap.get('accion') || '';
    const nidstate = this.route.snapshot.paramMap.get('nidstate') || '';
    this.LoadChannelSales();
    this.onSelectChannelSales(this.channelSalesId);
    this.onGetLstBranch();
    this.onGetCommissionState();
    // ALEX GAVIDIA
    if (this.tipoCanal === 14) {
      this.flagEliminarArchivo = false;
    }

    if (accion === 'send') {
    } else if (accion === 'upd') {
      this.showSelected = false;
      this.showCheckbox = true;
      this.showFiltrosLiquidacion = true;
      this.showDatosLiquidacion = true;
      this.showbtnGrabarTodo = true;
      this.showbtnEliminardeCommissionLot = true;
      this.showFiltrosEnviar = true;
      this.bMostrarButtons = false;
      this.getCertificado();
      this.commissionlotCab.NID_COMMLOT = +id;
      if (this.commissionlotCab.NID_COMMLOT > 0) {
        this.commissionFilter = new CommissionLotFilter(
          '',
          '',
          0,
          0,
          this.commissionlotCab.NID_COMMLOT,
          '',
          '',
          0,
          0,
          0,
          ''
        );
        this.commissionlotService
          .GetCommissionLotGeneral(this.commissionFilter)
          .subscribe(
            data => {
              this.ListCommissionLotGeneral = <CommissionLotCab>data;
              this.bDatosFactura = true;
              this.bsValueFecOp = new Date(this.ListCommissionLotGeneral.sregister);
              this.commissionlotCab.SSERIE = this.ListCommissionLotGeneral.sserie;
              this.commissionlotCab.SREGISTER = '';
              this.commissionlotCab.NBANK = this.ListCommissionLotGeneral.nbank;
              this.commissionlotCab.NTYPEDOC = this.ListCommissionLotGeneral.ntypedoc;
              this.commissionlotCab.NQUANTITY = this.ListCommissionLotGeneral.nquantity;
              this.commissionlotCab.NTYPEACCOUNT = this.ListCommissionLotGeneral.ntypeaccount;
              this.commissionlotCab.NBANK = this.ListCommissionLotGeneral.nbank;
              this.commissionlotCab.NTYPEACCOUNT = this.ListCommissionLotGeneral.ntypeaccount;
              this.commissionlotCab.SACCOUNT = this.ListCommissionLotGeneral.saccount;
              this.commissionlotCab.SBILLNUM = this.ListCommissionLotGeneral.sbillnum;
              this.commissionlotCab.SRUC = this.ListCommissionLotGeneral.sruc;
              this.commissionlotCab.SCCI = this.ListCommissionLotGeneral.scci;
              this.commissionlotCab.NAMOUNTIGV = this.ListCommissionLotGeneral.namountigv;
              this.commissionlotCab.NAMOUNTNETO = this.ListCommissionLotGeneral.namountneto;
              this.commissionlotCab.NAMOUNTTOTAL = this.ListCommissionLotGeneral.namounttotal;
              this.commissionlotCab.NIDSTATE = this.ListCommissionLotGeneral.nidstate;
              if ((this.tipoCanal != 14 && (this.commissionlotCab.NIDSTATE == 1 || this.commissionlotCab.NIDSTATE == 3)) ||
                (this.tipoCanal == 14 && this.commissionlotCab.NIDSTATE == 2)) {
                this.showbtnGenerarCommissionLot = true;
                this.showbtnGrabarTodo = true;
              } else {
                this.showbtnGenerarCommissionLot = false;
                this.showbtnGrabarTodo = false;
              }
              if (this.commissionlotCab.NTYPEDOC == 1) {
                this.maxSerie = 3;
                this.flagSerie = 1;
              } else {
                this.maxSerie = 4;
                this.flagSerie = 0;
              }

              this.onGetListBanco(this.commissionlotCab.NBANK);
              this.getVoucherType(this.commissionlotCab.NTYPEDOC);
              this.ongetAccountType(this.commissionlotCab.NTYPEACCOUNT);
              this.listCommissionLotDetail = this.ListCommissionLotGeneral.listcommissionlotdetail;
              this.listCommissionLotAttach = this.ListCommissionLotGeneral.listcommissionlotattach;
              this.keypayment = this.listCommissionLotAttach.length;
              this.cantidadSoats = this.listCommissionLotDetail.length;
              for (let e = 0; e < this.listCommissionLotDetail.length; e++) {
                this.totalplanilla += this.listCommissionLotDetail[e].amount;
              }
              // this.calcular();
            },
            error => {
              console.log(error);
            }
          );
      }
    } else if (accion === 'add') {
      // console.log("add");
      this.showSelected = false;
      this.showCheckbox = true;
      this.showFiltrosLiquidacion = true;
      this.showDatosLiquidacion = false;
      this.showbtnGenerarCommissionLot = true;
      this.showbtnGrabarTodo = true;
      this.showbtnEliminardeCommissionLot = true;
      this.showFiltrosEnviar = true;
      this.onGetListBanco(0);
      this.getVoucherType(0);
      this.ongetAccountType(0);
      /* this.getCertificado();
          this.obtenerTipoPagoCanal();*/
    }
  }

  generarFactura() {
    const amount_neto = Math.round(this.totalplanilla * 100) / 100;
    const amount_igv = Math.round(((this.totalplanilla * 18) / 100) * 100) / 100;
    this.amount_netosaldo = amount_neto;
    this.amount_notacredito = 0;
    for (let u = 0; u < this.ListCertificado.length; u++) {
      const amount = this.ListCertificado[u].amount;
      // si es nota de credito
      if (amount < 0) {
        this.amount_notacredito = this.amount_notacredito + amount;
        this.amount_netosaldo = this.amount_netosaldo + amount;
        if (this.amount_netosaldo < 0) {
          this.messageinfo = 'Por favor, debe de ingresar el monto ' + (this.amount_notacredito - amount) + ' en notas de crédito.';
          this.childModalInfo.show();
          return false;
        }
      }
    }
    if (this.amount_notacredito != 0) {
      this.messageinfo = 'Por favor, debe de ingresar el monto ' + (this.amount_notacredito) + ' en notas de credito.';
      this.childModalInfo.show();
      return false;
    }

    if (this.totalplanilla > 0) {
      this.bDatosFactura = true;
      this.commissionlotCab.NAMOUNTNETO = amount_neto;
      this.commissionlotCab.NAMOUNTIGV = amount_igv;
      this.commissionlotCab.NAMOUNTTOTAL = amount_neto + amount_igv;
    } else {
      this.bDatosFactura = true;
    }
  }

  LoadChannelSales(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const nusercode = currentUser && currentUser.id;
    this.channelSales = new ChannelSales(nusercode, '0', '');
    this.channelSalesService.getPostChannelSales(this.channelSales).subscribe(
      data => {
        this.ListChannelSales = <any[]>data;
      },
      error => {
        console.log(error);
      }
    );
  }

  onGetLstBranch() {

    // console.log("get branch");
    const tableType = new TableType(0, '');

    this.commissionlotService.getBranch(tableType).subscribe(
      data => {
        // console.log(data);
        this.lstBranch = <TableType[]>data;
        // this.lstStateChannel = <CommissionLotState[]>data;
        this.lstBranch.forEach(element => {
          this.ListBranchID += element.NID + ',';
        });
        this.ListBranchID = this.ListBranchID.slice(0, -1);
        // this.InputsFilter.P_NBRANCH = this.ListBranchID;
        this.onEventSearch();
      },
      error => { }
    );
  }

  onGetCommissionState() {
    // console.log("get onGetCommissionState");
    const commissionstate = new CommissionState(0, '');

    this.commissionlotService.getCommissionState(commissionstate).subscribe(
      data => {
        // console.log(data);
        this.lstCommisionState = <CommissionState[]>data;
        // this.lstStateChannel = <CommissionLotState[]>data;
        this.lstCommisionState.forEach(element => {
          this.ListCommissionStateID += element.NIDSTATE + ',';
        });
        this.ListCommissionStateID = this.ListCommissionStateID.slice(0, -1);
        // this.InputsFilter.P_NBRANCH = this.ListBranchID;
        this.onEventSearch();
      },
      error => { }
    );
  }

  getVoucherType(nvouchertype) {
    const vouchertype = new TableType(0, '');

    this.commissionlotService.getVoucherType(vouchertype).subscribe(
      data => {
        // console.log(data);
        this.lstVoucherType = <TableType[]>data;
        if (nvouchertype > 0) this.selVoucherType = nvouchertype;
        // this.lstStateChannel = <CommissionLotState[]>data;
        /*  this.lstVoucherType.forEach(element => {
            this.ListVoucherTypeID += element.NID + ',';
          });
          this.l ListCommissionStateID = this.ListCommissionStateID.slice(0, -1);*/
      },
      error => { }
    );
  }

  ongetAccountType(naccounttype) {
    const accounttype = new TableType(0, '');

    this.commissionlotService.getAccountType(accounttype).subscribe(
      data => {
        // console.log(data);
        this.lstAccountType = <TableType[]>data;
        if (naccounttype > 0) this.selAccountType = naccounttype;
      },
      error => { }
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
      this.channelPointService.getPostChannelPoint(salePoint).subscribe(
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

  onSelectState(StateID) {
    if (StateID === '0') {
      this.StateID = +StateID;
    } else {
      this.StateID = +StateID;
    }
  }

  onSelectBranch(BranchID) {
    if (BranchID === '0') {
      this.commissionlotCab.NBRANCH = +BranchID;
    } else {
      this.commissionlotCab.NBRANCH = +BranchID;
    }
  }

  onSelectBank(id) {
    this.commissionlotCab.NBANK = id;
  }

  onSelectvouchertype(id) {
    this.commissionlotCab.NTYPEDOC = id;
    if (this.commissionlotCab.NTYPEDOC == 1) {
      this.maxSerie = 3;
      this.flagSerie = 1;
    } else {
      this.maxSerie = 4;
      this.flagSerie = 0;
    }
    this.commissionlotCab.SSERIE = '';
  }

  onSelectaccounttype(id) {
    this.commissionlotCab.NTYPEACCOUNT = id;
  }

  initComponent() {
    const usuarioSession = localStorage.getItem('currentUser');
    if (usuarioSession !== null) {
      this.usuario = JSON.parse(usuarioSession);
    }
    // this.listarCanales();
  }

  ngOnDestroy(): void {
    if (this.btnVisa) {
      this.btnVisa.destroy();
    }

    if (this.frameResult) {
      this.frameResult.destroy();
    }
  }

  onEventSearch() {
    this.getCertificado();
  }

  getCertificado() {
    if (this.P_NIDPAYROLL > 0) {
    } else { this.P_NIDPAYROLL = 0 };

    const commlotFilterCertificate = new CommissionLotFilter('01/01/2017', '01/01/2019', 0, 0, 0, '', '', 0, 0, 0, '');
    commlotFilterCertificate.DISSUEDAT_INI = this.datePipe.transform(
      this.bsValueIni,
      'dd/MM/yyyy'
    );
    commlotFilterCertificate.DISSUEDAT_FIN = this.datePipe.transform(
      this.bsValueFin,
      'dd/MM/yyyy'
    );
    commlotFilterCertificate.SCHANNEL_BO = this.channelSalesId;
    commlotFilterCertificate.SSALEPOINT_BO = this.channelPointId;
    commlotFilterCertificate.NIDPAYROLL = this.P_NIDPAYROLL;
    commlotFilterCertificate.NIDSTATUS = this.StateID;
    this.commissionlotService
      .getPostCertificateCommission(commlotFilterCertificate)
      .subscribe(
        data => {
          this.ListCertificado = <any[]>data;
          for (let e = 0; e < this.ListCertificado.length; e++) {
            for (let e = 0; e < this.listCommissionLotDetail.length; e++) {
              const objeto = this.ListCertificado.find(x => x.npolicy == this.listCommissionLotDetail[e].npolicy && x.nreceipt == this.listCommissionLotDetail[e].nreceipt);
              const index = this.ListCertificado.indexOf(objeto);
              if (index >= 0) {
                this.ListCertificadoFilter.push(objeto);
              }
            }
          }
          let missing = this.ListCertificado.filter(
            item => this.ListCertificadoFilter.indexOf(item) < 0
          );
          this.ListCertificado = missing;
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

  selectAllCommissionLot() {
    for (let i = 0; i < this.listCommissionLotDetail.length; i++) {
      this.listCommissionLotDetail[i].selected = this.selectedAllCommissLot;
    }
  }

  checkIfAllSelected() {
    this.ListCertificado.every(function (item: CommissionLotDetail) {
      return item.selected === true;
    });
  }

  checkIfAllSelectedPlanilla() {
    this.listCommissionLotDetail.every(function (item: CommissionLotDetail) {
      return item.selected === true;
    });
  }

  btn_Incluir() {
    // console.log(this.ListCertificado);
    let contador = 0;
    for (let i = 0; i < this.ListCertificado.length; i++) {
      if (this.ListCertificado[i].selected === true && this.ListCertificado[i].nidstatuS_COMMISSION === 2) {
        this.arrayNumerodoc += this.ListCertificado[i].npolicy + '|' + this.ListCertificado[i].nreceipt + ',';
        contador++;
      }
    }
    if (contador > 0) {
      this.EliminarCertificado();
      const amount_neto = Math.round(this.totalplanilla * 100) / 100;
      const amount_igv = Math.round(((this.totalplanilla * 18) / 100) * 100) / 100;
      this.commissionlotCab.NAMOUNTNETO = amount_neto;
      this.commissionlotCab.NAMOUNTIGV = amount_igv;
      this.commissionlotCab.NAMOUNTTOTAL = amount_neto + amount_igv;
    } else {
      this.messageinfo = 'Por favor, seleccione un registro';
      this.childModalInfo.show();
    }
  }

  aceptar() {
    this.childModalInfo.hide();
  }

  aceptarmsginfo() {
    this.childModal.hide();
    if (!this.berror) this.router.navigate(['broker/commissionlot']);
  }

  EliminarCertificado() {
    this.arrayNumerodoc = this.arrayNumerodoc.slice(0, -1);
    const arrayDocaElimnar = this.arrayNumerodoc.split(',');
    for (let e = 0; e < arrayDocaElimnar.length; e++) {
      this.cantidadSoats++;
      const narray = arrayDocaElimnar[e];
      const npolicy = arrayDocaElimnar[e].substr(0, arrayDocaElimnar[e].indexOf('|'));
      const nreceipt = arrayDocaElimnar[e].substr(arrayDocaElimnar[e].indexOf('|') + 1, arrayDocaElimnar[e].length);
      // const objeto = this.ListCertificado.find(book => book.npolicy === npolicy);
      const objeto = this.ListCertificado.filter(book => book.npolicy == npolicy && book.nreceipt == nreceipt);

      for (let u = 0; u < objeto.length; u++) {
        objeto[u].selected = false;
        objeto[u].NIDCOMMISIONLOTDETAIL = 1000;
        objeto[u].NUSERREGISTER = 9999;
        this.totalplanilla += objeto[0].amount;
        this.listCommissionLotDetail.push(objeto[u]);
        const Index = this.ListCertificado.indexOf(objeto[u]);
        this.ListCertificado.splice(Index, 1);
      }
    }
    this.arrayNumerodoc = '';
    this.selectedAll = false;
    this.calcular();
  }
  // FileUPLOAD

  onVotedResultFileUpload(fileupload: File) {
    // console.log(fileupload);
    this.fileUpload = fileupload;
    this.snameFile = fileupload.name.toString();
    // this.filesComm.push(this.fileUpload);
    // this.uploadFileToActivity(commissloattach);
    // this.LstfilesUpload.push(fileupload);
    // this.resultChannelPointReport = idChannelSales;
    // this.AdjuntarDocumentos();
  }

  AdjuntarDocumentos() {
    this.snameFile = '';
    if (Math.round(this.fileUpload.size / 1000000) > 25) {
      this.messageinfo = 'El archivo supera el máximo permitido, 25MB.';
      this.childModalInfo.show();
    } else {
      var suma = 0;
      for (let u = 0; u < this.filesComm.length; u++) {
        suma += this.filesComm[u].size;
      }
      suma += this.fileUpload.size;
      if (Math.round(suma / 1000000) > 25) {
        this.messageinfo = 'El archivo supera el máximo permitido, 25MB.';
        this.childModalInfo.show();
      } else {
        this.filesComm.push(this.fileUpload);
        const commissloattach = new CommissionLotAttach(
          0,
          this.nCountFile + 1,
          this.fileUpload,
          this.fileUpload.name,
          this.fileUpload.type,
          this.sValueFec
        );
        this.listCommissionLotAttach.push(commissloattach);
      }
    }
  }

  DeleteAttachCommLot(snamefile: string, id: Number) {

    this.commissionlotService.deleteFileAttach(id).subscribe(
      data => {
        // console.log(data);        
      },
      error => {
        console.error();
      }
    );

    const objeto = this.listCommissionLotAttach.find(x => x.SNAMEFILE === snamefile);
    const index = this.listCommissionLotAttach.indexOf(objeto);
    this.listCommissionLotAttach.splice(index, 1);

    const obj = this.filesComm.find(x => x.name == snamefile);
    const index1 = this.listCommissionLotAttach.indexOf(obj);
    this.filesComm.splice(index1, 1);
  }

  getFile(id) {
    // console.log("descargo");
    console.log(id);
    this.commissionlotService.getUploadedFile(id).subscribe(
      data => {
        var obj = <DownloadDto>data;

        if (obj.success) {
          const _iFrame = <HTMLIFrameElement>document.getElementById('ifrmPdf');

          _iFrame.src = 'about:blank';

          setTimeout(() => {
            _iFrame.src = `${
              AppConfig.URL_API
              }/commissionlot/DownloadFileByTokenId/${obj.id}`;
          }, 250);
        }
      },
      error => {
        console.error();
      }
    );
  }

  downLoadFile(data: any, type: string) {
    var blob = new Blob([data], { type: type.toString() });
    var url = window.URL.createObjectURL(blob);
    var pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Please disable your Pop-up blocker and try again.');
    }
  }

  /*downloadFile(data: Response) {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url= window.URL.createObjectURL(blob);
    window.open(url);
  }*/

  /*uploadFileToActivity(commissloattach) {

    this.fileUploadService.postFile(this.fileUpload).subscribe(data => {
      // do something, if upload success
      console.log(data);
      }, error => {
        console.log(error);
      });
  } */

  grabarTodo() {
    if (!this.validarLote()) return;
    // this.commissionlotCab.NAMOUNTTOTAL =Math.round(this.totalplanilla*100)/100;
    this.commissionlotCab.NIDSTATE = 1;
    this.commissionlotCab.NQUANTITY = this.cantidadSoats;
    // this.commissionlotCab.NUSERREGISTER = 999;
    this.commissionlotCab.SREGISTER = this.datePipe.transform(this.bsValueFecOp, 'dd/MM/yyyy');
    this.commissionlotCab.SCODCHANNEL = this.usuario.canal;
    this.commissionlotCab.LISTCOMMISSIONLOTDETAIL = this.listCommissionLotDetail;
    this.commissionlotCab.LISTCOMMISSIONLOTATTACH = this.listCommissionLotAttach;
    this.listCommissionLotDetail = [];
    this.listCommissionLotAttach = [];
    this.cantidadSoats = 0;
    this.totalplanilla = 0;
    this.totaldeclarado = 0;
    this.commissionlotCab.fileattach = this.filesComm;
    this.commissionlotCab.NBANK = this.selBank;

    this.commissionlotService.SaveCommissionLot(this.commissionlotCab)
      .subscribe(
        data => {
          this.result = data;
          if (this.commissionlotCab.NID_COMMLOT === 0) {
            if (this.result.noutidcommlot > 0) {
              this.messageinfo =
                'Se generó el lote Nro: ' + this.result.noutidcommlot;
              this.berror = false;
              this.childModal.show();
            } else {
              this.messageinfo =
                'Ocurrio un error al generar el lote: ' +
                this.result.noutidcommlot;
              this.berror = true;
              this.childModal.show();
            }
          } else {
            this.messageinfo = 'Se actualizó los de datos del lote Nro: ' + this.result.noutidcommlot;
            this.childModal.show();
          }
        },
        error => {
          console.log(error);
        }
      );
  }

  btn_Eliminar() {
    let contador = 0;
    for (let e = 0; e < this.listCommissionLotDetail.length; e++) {
      if (this.listCommissionLotDetail[e].selected === true) {
        this.arrayNumerodoc += this.listCommissionLotDetail[e].npolicy + '|' + this.listCommissionLotDetail[e].nreceipt + ',';

        contador++;
      }
    }
    if (contador > 0) {
      this.EliminarCertificadoAgregados();
      const amount_neto = Math.round(this.totalplanilla * 100) / 100;
      const amount_igv = Math.round(((this.totalplanilla * 18) / 100) * 100) / 100;
      this.commissionlotCab.NAMOUNTNETO = amount_neto;
      this.commissionlotCab.NAMOUNTIGV = amount_igv;
      this.commissionlotCab.NAMOUNTTOTAL = amount_neto + amount_igv;
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
      const narray = arrayDocaElimnar[e];
      const npolicy = arrayDocaElimnar[e].substr(0, arrayDocaElimnar[e].indexOf('|'));
      const nreceipt = arrayDocaElimnar[e].substr(arrayDocaElimnar[e].indexOf('|') + 1, arrayDocaElimnar[e].length);
      const objeto = this.listCommissionLotDetail.find(book => book.npolicy == npolicy && book.nreceipt == nreceipt);
      this.totalplanilla -= objeto.amount;
      objeto.selected = false;
      this.ListCertificado.push(objeto);
      const index = this.listCommissionLotDetail.indexOf(objeto);
      this.listCommissionLotDetail.splice(index, 1);
    }
    this.arrayNumerodoc = '';
    this.selectedAllCommissLot = false;
    this.calcular();
  }

  onGetListBanco(nbank) {
    this.banckService.getPostBank().subscribe(data => {
      this.banks = <any[]>data;
      // console.log(this.banks);
      if (nbank > 0) this.selBank = nbank;
    });
  }

  calcular() {
    this.saldo =
      Math.round(this.totalplanilla * 100) / 100 -
      Math.round(this.totaldeclarado * 100) / 100;

    this.commissionlotCab.NAMOUNTNETO = 0;
    this.commissionlotCab.NAMOUNTIGV = 0;
    this.commissionlotCab.NAMOUNTTOTAL = 0;
  }

  openModalConfirRegresar() {
    // console.log(this.bDatosFactura);
    if (this.bDatosFactura === true) {
      this.flagModulo = 'RegresarLotes';
      this.message = '¿Está seguro que desea regresar a lotes?';
      this.childModalConfirmasivo.show();
    } else {
      this.router.navigate(['broker/commissionlot']);
    }
  }

  openModalDeleteFileAttach(snamefile: string, id: Number) {
    this.flagModulo = 'DeleteFileAttach';
    this.message = '¿Está seguro que desea eliminar el documento?';
    this.deleteId = id;
    this.deleteSnamefile = snamefile;
    this.childModalConfirmasivo.show();
  }

  openModalConfirGrabarTodo() {
    const amount_neto = Math.round(this.totalplanilla * 100) / 100;
    const amount_igv = Math.round(((this.totalplanilla * 18) / 100) * 100) / 100;
    this.amount_netosaldo = amount_neto;
    this.amount_notacredito = 0;
    for (let u = 0; u < this.ListCertificado.length; u++) {
      const amount = this.ListCertificado[u].amount;
      //si es nota de credito
      if (amount < 0) {
        this.amount_notacredito = this.amount_notacredito + amount;
        this.amount_netosaldo = this.amount_netosaldo + amount;
        if (this.amount_netosaldo < 0) {
          this.messageinfo = 'Por favor, debe ingresar el monto ' + (this.amount_notacredito - amount) + ' en notas de crédito.';
          this.childModalInfo.show();
          return false;
        }
      }
    }
    if (this.amount_notacredito != 0) {
      this.messageinfo = 'Por favor, debe ingresar el monto ' + (this.amount_notacredito) + ' en notas de credito.';
      this.childModalInfo.show();
      return false;
    }

    //if (this.totalplanilla > 0) {
    this.commissionlotCab.NAMOUNTNETO = amount_neto;
    this.commissionlotCab.NAMOUNTIGV = amount_igv;
    this.commissionlotCab.NAMOUNTTOTAL = amount_neto + amount_igv;
    //}

    if (this.commissionlotCab.NAMOUNTTOTAL <= 0) {
      this.messageinfo = 'El monto total debe ser mayor a cero.';
      this.childModalInfo.show();
      return false;
    }

    if (this.bDatosFactura === true) {
      this.flagModulo = 'GrabarTodo';
      this.message = '¿Está seguro que desea grabar?';
      this.childModalConfirmasivo.show();
    }
  }

  confirm(): void {
    switch (this.flagModulo) {
      case 'GrabarTodo':
        this.flagGrabarTodo = true;
        this.grabarTodo();
        break;
      case 'DeleteFileAttach':
        this.DeleteAttachCommLot(this.deleteSnamefile, this.deleteId);
        break;
      default:
        this.FlagRegresar = true;
        this.router.navigate(['broker/commissionlot']);
        break;
    }

    this.childModalConfirmasivo.hide();
  }

  closeconfirm(): void {
    switch (this.flagModulo) {
      case 'GrabarTodo':
        this.flagGrabarTodo = false;
        break;
      default:
        this.FlagRegresar = false;
        break;
    }
    this.childModalConfirmasivo.hide();
  }

  validarLote() {
    if (this.commissionlotCab.SSERIE !== undefined && this.commissionlotCab.SSERIE !== '') {
      if (this.commissionlotCab.NTYPEDOC == 1 && this.commissionlotCab.SSERIE.length !== 3) {
        this.messageinfo = 'La longitud de la serie debe ser 3 caracteres.';
        this.childModalInfo.show();
        return false;
      }
      if (this.commissionlotCab.NTYPEDOC == 2 && this.commissionlotCab.SSERIE.length !== 4) {
        this.messageinfo = 'La longitud de la serie debe ser 4 caracteres.';
        this.childModalInfo.show();
        return false;
      }
    }
    if (this.commissionlotCab.SRUC !== undefined && this.commissionlotCab.SRUC !== '') {
      if (!this.utilityService.isValidateRUC(this.commissionlotCab.SRUC)) {
        this.messageinfo = 'El RUC no es correcto';
        this.childModalInfo.show();
        return false;
      }
    }
    if (this.commissionlotCab.SACCOUNT !== undefined && this.commissionlotCab.SACCOUNT !== '') {
      if (this.commissionlotCab.NBANK == 1 && this.commissionlotCab.NTYPEACCOUNT == 1 && this.commissionlotCab.SACCOUNT.length !== 13) {
        this.messageinfo = 'La longitud del número de cuenta debe ser 13 caracteres.';
        this.childModalInfo.show();
        return false;
      }
      if (this.commissionlotCab.NBANK == 1 && this.commissionlotCab.NTYPEACCOUNT == 2 && this.commissionlotCab.SACCOUNT.length !== 14) {
        this.messageinfo = 'La longitud del número de cuenta debe ser 14 caracteres.';
        this.childModalInfo.show();
        return false;
      }
      if (this.commissionlotCab.NBANK == 1 && this.commissionlotCab.NTYPEACCOUNT == 3 && this.commissionlotCab.SACCOUNT.length !== 13) {
        this.messageinfo = 'La longitud del número de cuenta debe ser 13 caracteres.';
        this.childModalInfo.show();
        return false;
      }
      if (this.commissionlotCab.NBANK == 2 && this.commissionlotCab.NTYPEACCOUNT == 1 && this.commissionlotCab.SACCOUNT.length !== 18) {
        this.messageinfo = 'La longitud del número de cuenta debe ser 18 caracteres.';
        this.childModalInfo.show();
        return false;
      }
      if (this.commissionlotCab.NBANK == 2 && this.commissionlotCab.NTYPEACCOUNT == 2 && this.commissionlotCab.SACCOUNT.length !== 20) {
        this.messageinfo = 'La longitud del número de cuenta debe ser 20 caracteres.';
        this.childModalInfo.show();
        return false;
      }
      if (this.commissionlotCab.NBANK == 2 && this.commissionlotCab.NTYPEACCOUNT == 3 && this.commissionlotCab.SACCOUNT.length !== 20) {
        this.messageinfo = 'La longitud del número de cuenta debe ser 20 caracteres.';
        this.childModalInfo.show();
        return false;
      }
      if (this.commissionlotCab.NBANK == 3 && this.commissionlotCab.NTYPEACCOUNT == 1 && this.commissionlotCab.SACCOUNT.length !== 13) {
        this.messageinfo = 'La longitud del número de cuenta debe ser 13 caracteres.';
        this.childModalInfo.show();
        return false;
      }
      if (this.commissionlotCab.NBANK == 3 && this.commissionlotCab.NTYPEACCOUNT == 2 && this.commissionlotCab.SACCOUNT.length !== 13) {
        this.messageinfo = 'La longitud del número de cuenta debe ser 13 caracteres.';
        this.childModalInfo.show();
        return false;
      }
      if (this.commissionlotCab.NBANK == 3 && this.commissionlotCab.NTYPEACCOUNT == 3 && this.commissionlotCab.SACCOUNT.length !== 20) {
        this.messageinfo = 'La longitud del número de cuenta debe ser 20 caracteres.';
        this.childModalInfo.show();
        return false;
      }
    }
    if (this.commissionlotCab.SCCI !== undefined && this.commissionlotCab.SCCI !== '') {
      if (this.commissionlotCab.SCCI.length !== 20) {
        this.messageinfo = 'La longitud del número de cuenta CCI debe ser 20 caracteres.';
        this.childModalInfo.show();
        return false;
      }
    }
    return true;
  }

  CancelaryRegresar(): void {
    this.router.navigate(['broker/commissionlot']);
  }

  bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var d = Math.floor(Math.log(bytes) / Math.log(1024));
    var i = parseInt(d.toString()); // parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
    //return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  }
}
