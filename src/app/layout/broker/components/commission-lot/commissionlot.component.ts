import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';

import { CommissionLot } from '../../models/CommissionLot/commissionlot';

import { CommissionLotState } from '../../models/commissionlot/commissionlotstate';
import { TableType } from '../../models/commissionlot/tabletype';
import { StateService } from '../../services/state/state.service';
import { CommissionLotService } from '../../services/commisslot/comissionlot.service';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { DatePipe } from '@angular/common';
import { UtilityService } from '../../../../shared/services/general/utility.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CommissionLotCab } from '../../models/commissionlot/commissionlotcab';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ExcelService } from '../../../../shared/services/excel/excel.service';
import { CommissionLotFilter } from '../../models/commissionlot/commissionlotfilter';
import { CommissionLotHist } from '../../models/commissionlot/commissionlothist';
import { AppConfig } from '../../../../app.config';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '../../../../../../node_modules/@angular/forms';
import { DownloadDto } from '../../models/download/download';
import { CommissionLotExactus } from '../../models/commissionlot/commissionlotexactus';
import { debugOutputAstAsTypeScript } from '@angular/compiler';
import { NgxSpinnerService } from 'ngx-spinner';
defineLocale('es', esLocale);
@Component({
  selector: 'app-commissionlot',
  templateUrl: './commissionlot.component.html',
  styleUrls: ['./commissionlot.component.css']
})
export class CommissLotComponent implements OnInit {
  @ViewChild('childModal', { static: true }) childModal: ModalDirective;
  @ViewChild('childModalConfirmasivo', { static: true }) childModalConfirmasivo: ModalDirective;
  @ViewChild('childModalHistorial', { static: true }) childModalHistorial: ModalDirective;
  @ViewChild('childModalConfirmarEnvio', { static: true }) childModalConfirmarEnvio: ModalDirective;

  strObservacion: string;
  bHideBody: boolean;
  messageEnvio: string;
  message: string;
  messageinfo: string;
  IdCommLot: number;
  modalRef: BsModalRef;
  flagConfirmacion: string;
  msjHeader: string;
  selectedAll: any;
  public bsConfig: Partial<BsDatepickerConfig>;
  // Array para los campos de tipo texto
  public InputsFilter: any = {};
  // Variable indica si se obtuvo o no Informacion
  fExistRegistro: any = false;
  bopacitysave = false;
  fExistRegistroHistorial: any = false;
  msgErrorLista = '';
  msgErrorListaHist = '';
  // Objecto CommissionLott
  ObjCommissionLot = new CommissionLot('01/01/2017', '31/12/2017', '', 0, 0, 0, 0, 0, 0, 0, 0, '', 0, 0, 0, '', '', '', 0, 0, 0, 0, false);
  /*Variables de paginacion */
  stridcomlot: string;
  strPrecio: string;
  npage = 1;
  paginacion: any = {};
  rotate = true;
  maxSize = 5;
  public currentPage = 0;
  public itemsPerPage = 5;
  public totalItems = 0;
  public tipoCanal = 0;
  public idUser = 0;
  fecha = new Date();
  dia = this.fecha.getDate();
  mes = this.fecha.getMonth() === 0 ? 1 : this.fecha.getMonth();
  anio = this.fecha.getFullYear();
  nidStateApprob: number;
  bsValueIni: Date = new Date(this.anio + '-' + this.mes + '-' + this.dia);
  bsValueFin: Date = new Date();
  ListStateID = '';
  ListCodChannel = '';
  mensaje_validacion = '';
  mensajes_validacion = [];
  // Lista
  ListCommissionLot: CommissionLot[];
  ListCommissionLotExport: CommissionLot[];
  arrayIdCommissionLot = '';
  ListCommissionLotHist: CommissionLotHist[];
  // Estado de Planilla
  public lstStateCommission: CommissionLotState[];
  ListChannelSales: any[];
  planillaBuscar = '';

  lstStateApprobCommission: CommissionLotState[];
  // Ramo de la poliza
  public lstBranch: TableType[];
  ListBranch: any[];
  ListBranchID = '';
  // obj Filter
  commlotFilter = new CommissionLotFilter('', '', 0, 0, 0, '', '', 0, 0, 0, '');
  public result: any = {};
  public resultvalidate: any = {};
  @ViewChild('myButton', { static: false }) myButton: ElementRef;
  node: string;
  // Envio de planilla
  commissionLotID: number;
  stateID: number;
  strFechaEliminar: string;
  nLote: string;
  canalHist: number;
  flagAlerta = false;
  constructor(
    private commissionlotService: CommissionLotService,
    // private service: StateService,
    private router: Router,
    private datePipe: DatePipe,
    public utilityService: UtilityService,
    // private modalService: BsModalService,
    private excelService: ExcelService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private spinner: NgxSpinnerService
  ) {
    this.bsConfig = Object.assign({},
      {
        dateInputFormat: 'DD/MM/YYYY',
        locale: 'es',
        containerClass: 'theme-dark-blue',
        showWeekNumbers: true
      });
    // Setear variables de tipo filtro
    this.InputsFilter.P_DATEBEGIN = '';
    this.InputsFilter.P_DATEEND = '';
    this.InputsFilter.p_NIDCOMMLOT = '';
    this.InputsFilter.P_NSTATE = 0;
    this.InputsFilter.P_NPOLICY = '';
    // Variables de salida
    this.InputsFilter.NAMOUNTTOTAL = 0;
    this.InputsFilter.NQUANTITY = 0;
    this.InputsFilter.NIDCOMMLOT = 0;
    this.InputsFilter.NIDSTATE = 0;
    this.InputsFilter.ROWNUMBER = 0;
    this.InputsFilter.ROWTOTAL = 0;
    this.InputsFilter.SIDCOMMLOT = '';
    this.InputsFilter.SREGISTER = '';
    this.paginacion.ItemsPerPage = this.itemsPerPage;
    this.paginacion.TotalItems = this.totalItems;
    this.paginacion.npage = this.npage;
    this.nLote = '';
    this.bopacitysave = false;
  }

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.tipoCanal = +currentUser.tipoCanal;
    this.canalHist = currentUser.canal;
    this.idUser = currentUser.id;

    this.onGetLstState();
    this.onGetLstBranch();

  }

  // Evento para buscar
  onEventSearch() {
    this.InputsFilter.P_DATEBEGIN = this.datePipe.transform(this.bsValueIni, 'dd/MM/yyyy');
    this.InputsFilter.P_DATEEND = this.datePipe.transform(this.bsValueFin, 'dd/MM/yyyy');
    this.npage = 0;
    this.onLoadCommissionLot();
  }

  selectAll() {
    for (let i = 0; i < this.ListCommissionLot.length; i++) {
      this.ListCommissionLot[i].selected = this.selectedAll;
    }
  }

  EventDownload(event) {

    if (this.InputsFilter.P_NIDCOMMLOT === '') {
      this.InputsFilter.P_NIDCOMMLOT = 0;
    }
    this.ObjCommissionLot = new CommissionLot(
      this.InputsFilter.P_DATEBEGIN,
      this.InputsFilter.P_DATEEND,
      '',
      this.InputsFilter.P_NIDPAYROLL === '' ? 0 : this.InputsFilter.P_NIDPAYROLL,
      this.InputsFilter.P_NIDCOMMLOT === '' ? 0 : this.InputsFilter.P_NIDCOMMLOT,
      this.InputsFilter.P_NSTATE,
      this.InputsFilter.P_NPOLICY === '' ? 0 : this.InputsFilter.P_NPOLICY,
      this.InputsFilter.P_NBRANCH,
      this.InputsFilter.NQUANTITY,
      this.InputsFilter.NID_COMMLOT,
      this.InputsFilter.NIDSTATE,
      this.InputsFilter.SREGISTER,
      this.InputsFilter.NAMOUNTTOTAL,
      this.InputsFilter.NAMOUNTNETO,
      this.InputsFilter.NAMOUNTIGV,
      this.InputsFilter.SIDCOMMLOT,
      this.InputsFilter.SDESCRIPTION,
      '',
      0, 0,
      this.paginacion.npage,
      this.paginacion.ItemsPerPage,
      false
    );
    this.ObjCommissionLot.NPAGE = 0;
    this.ObjCommissionLot.NRECORDPAGE = 0;
    this.commissionlotService.getPostListCommissionLot(this.ObjCommissionLot).subscribe(
      data => {
        this.ListCommissionLotExport = <CommissionLot[]>data;

        if (this.ListCommissionLotExport.length > 0) {
          this.excelService.exportReportCommissionLot(this.ListCommissionLotExport, 'ReporteCommissionLot');
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  // Descarga individual del lote de comision
  EventDownloadDetailCommLot(nid_commlot: number) {
  }

  checkIfAllSelected() {
    // this.ListPayroll.every(function (item: Payroll) { return item.selected === true; });
  }

  // Metodo de busqueda
  onLoadCommissionLot() {
    this.ObjCommissionLot = new CommissionLot(
      this.InputsFilter.P_DATEBEGIN,
      this.InputsFilter.P_DATEEND,
      '',
      this.InputsFilter.P_NIDPAYROLL === '' ? 0 : this.InputsFilter.P_NIDPAYROLL,
      this.InputsFilter.P_NIDCOMMLOT === '' ? 0 : this.InputsFilter.P_NIDCOMMLOT,
      this.InputsFilter.P_NSTATE,
      this.InputsFilter.P_NPOLICY === '' ? 0 : this.InputsFilter.P_NPOLICY,
      this.InputsFilter.P_NBRANCH,
      this.InputsFilter.NQUANTITY,
      this.InputsFilter.NID_COMMLOT,
      this.InputsFilter.NIDSTATE,
      this.InputsFilter.SREGISTER,
      this.InputsFilter.NAMOUNTTOTAL,
      this.InputsFilter.NAMOUNTNETO,
      this.InputsFilter.NAMOUNTIGV,
      this.InputsFilter.SIDCOMMLOT,
      this.InputsFilter.SDESCRIPTION,
      '', 0, 0,
      this.paginacion.npage,
      this.paginacion.ItemsPerPage,
      false
    );
    // console.log(this.ObjCommissionLot);
    this.commissionlotService.getPostListCommissionLot(this.ObjCommissionLot).subscribe(
      data => {
        this.ListCommissionLot = <CommissionLot[]>data;
        if (this.ListCommissionLot.length > 0) {
          this.fExistRegistro = true;
          this.totalItems = data[0].nrecorD_COUNT;
        } else {
          this.fExistRegistro = false;
          this.msgErrorLista = 'No se encontraron Registros..';
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  VerHistorial(nid_commlot) {
    this.childModalHistorial.show();
    this.commlotFilter.NIDCOMMLOT = nid_commlot;
    this.commissionlotService.getCommissionLotHist(this.commlotFilter).subscribe(
      data => {
        // console.log('historial');
        // console.log(data);
        this.ListCommissionLotHist = <CommissionLotHist[]>data;
        if (this.ListCommissionLotHist.length > 0) {
          this.fExistRegistroHistorial = true;
          this.nLote = this.ListCommissionLotHist[0].niD_COMMLOT.toString();
        } else {
          this.fExistRegistroHistorial = false;
          this.msgErrorListaHist = 'No se encontraron Registros..';
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  validateEnviar() {
    this.flagAlerta = false;
    if (this.nidStateApprob === 0 || this.nidStateApprob === undefined) {
      this.flagAlerta = true;
      this.mensajes_validacion = ['!Debe seleccionar un estado!', ''];
      this.bopacitysave = false;
      return false;
    }
    return true;
  }

  saveEnviar() {
    this.bopacitysave = true;

    if (this.validateEnviar()) {
      const obj = new CommissionLotFilter('', '', 0, 0, 0, '', '', 0, 0, 0, '');
      obj.NIDCOMMLOT = this.commissionLotID;
      obj.NIDSTATUS = this.InputsFilter.P_NSTATE;
      obj.SOBSERVATION = this.strObservacion;
      obj.NUSERREGISTER = this.idUser;
      this.spinner.show();
      this.commissionlotService.updCommissionLotState(obj).subscribe(
        data => {
          this.resultvalidate = data;
          if (this.resultvalidate.nidcommlot === 0) {
            this.flagAlerta = true;
            this.mensajes_validacion = this.resultvalidate.sobservation.split('|');
            this.bopacitysave = false;
            this.spinner.hide();
            return false;
          }
          this.InputsFilter.P_NSTATE = this.ListStateID; // alex gavidia
          this.bopacitysave = false;
          this.childModalConfirmarEnvio.hide();
          this.messageinfo = 'Se envió el lote Nro: ' + obj.NIDCOMMLOT + ', para evaluación.';
          this.childModal.show();
          this.onLoadCommissionLot();
          this.spinner.hide();
        }, error => {
          this.spinner.hide();
          console.log(error);
          this.bopacitysave = false;
        }
      );
    }
  }

  openModalConfirmacionMasivo() {

    let arrayDiferentesPendiente = '';
    let countIdCommissionLot = 0;
    this.ListCommissionLot.forEach(element => {
      if (element.selected === true) {
        countIdCommissionLot++;
        if (!(element.nidstate === 1 || element.nidstate === 3)) {
          arrayDiferentesPendiente += Number(element.sidcomlot).toString() + ',';
        } else {
          this.arrayIdCommissionLot += Number(element.sidcomlot).toString() + ',';
        }
      }
    });
    if (countIdCommissionLot === 0) {
      this.messageinfo = 'Por favor, debe de seleccionar un Lote de Comisión.';
      this.childModal.show();
    } else {
      if (arrayDiferentesPendiente.length > 0) {
        arrayDiferentesPendiente = arrayDiferentesPendiente.slice(0, -1);
        if (arrayDiferentesPendiente.split(',').length === 1) {
          this.messageinfo = 'No se pudo realizar la anulación, debido a que el siguiente Lote de Comisión: '
            + arrayDiferentesPendiente + ' no tiene el estado correcto';
        } else {
          this.messageinfo = 'No se pudo realizar la anulación masiva, debido a que, los siguientes Lotes de Comisión: '
            + arrayDiferentesPendiente + ' no tienen el estado correcto';
        }
        this.childModal.show();
      } else {
        // console.log(countIdCommissionLot);
        this.msjHeader = countIdCommissionLot > 1 ? '¿Esta seguro de anular los lotes seleccionados?' : '¿Está seguro de anular el lote?';
        this.bHideBody = true;
        this.flagConfirmacion = 'anulacionmasivo';
        this.childModalConfirmasivo.show();
      }
    }
  }

  // Al enviar a exactus el lote
  openModalConfirExactus(id: string) {
    this.bHideBody = false;
    this.childModalConfirmasivo.show();
    this.message = '¿Esta seguro de Enviar a Exactus el lote seleccionado? ';
    this.flagConfirmacion = 'envioexactus';
    this.IdCommLot = +id;
    // console.log(this.IdCommLot);
  }

  confirm(): void {
    if (this.flagConfirmacion === 'anulacionmasivo') {
      this.btnAnularPayrollMasivo();
    } else if (this.flagConfirmacion === 'envioexactus') {
      this.btnEnviarExactusLote();
    }
    this.childModalConfirmasivo.hide();
  }

  closeconfirm(): void {
    this.childModalConfirmasivo.hide();
  }

  closeHistorial(): void {
    this.childModalHistorial.hide();
  }

  pageChanged(event: any): void {
    this.paginacion.npage = event.page;
    this.onLoadCommissionLot();
  }

  // Obtener estados
  onGetLstState() {
    const StateChannel = new CommissionLotState(0, '', 0, 0);

    this.commissionlotService.getCommissionLotState(StateChannel).subscribe(
      data => {
        // console.log(data);
        this.lstStateCommission = <CommissionLotState[]>data;
        // this.lstStateChannel = <CommissionLotState[]>data;
        this.lstStateCommission.forEach(element => {
          this.ListStateID += element.nidstate + ',';
        });
        this.ListStateID = this.ListStateID.slice(0, -1);
        this.InputsFilter.P_NSTATE = this.ListStateID;
        this.onEventSearch();
      },
      error => { }
    );

  }

  onGetLstStateApp(id, idstate) {

    const commlotfilter = new CommissionLotState(0, '', this.tipoCanal, idstate);

    this.commissionlotService.getCommissionLotStateApprob(commlotfilter).subscribe(
      data => {
        this.lstStateApprobCommission = <CommissionLotState[]>data;

        // console.log(this.lstStateApprobCommission);
        if (this.lstStateApprobCommission.length > 0) {

          this.childModalConfirmarEnvio.show();
          this.messageEnvio = 'Esta seguro que desea enviar el lote?';
          this.commissionLotID = id;
          this.stateID = idstate;
        }
      },
      error => {

      }
    );
  }

  onGetLstBranch() {
    // console.log('get branch');
    const tableType = new TableType(0, '');

    this.commissionlotService.getBranch(tableType).subscribe(
      data => {
        // console.log(data);
        this.lstBranch = <TableType[]>data;
        // this.lstStateChannel = <CommissionLotState[]>data;
        /* this.lstBranch.forEach(element => {
           this.ListBranchID += element.NID + ',';
         });*/
        // this.ListBranchID = this.ListBranchID.slice(0, -1);
        this.InputsFilter.P_NBRANCH = '0';
        this.onEventSearch();
      },
      error => { }
    );

  }

  EnviarCommLot(id: number, nidstate: number): void {
    this.strObservacion = '';
    this.nidStateApprob = 0;
    this.flagAlerta = false;
    this.onGetLstStateApp(id, nidstate);
  }

  ActualizarLote(id: number): void {
    this.router.navigate(['broker/commissionlot-add', 'upd', id, 0]);
  }

  setAgregarLote() {
    this.router.navigate(['broker/commissionlot-add', 'add', 0, 0]);
  }

  aceptarmsginfo() {
    this.childModal.hide();
  }

  btnAnularPayrollMasivo() {
    // tslint:disable-next-line: max-line-length
    const payrollCab = new CommissionLot('01/01/2017', '31/12/2017', '', 0, 0, 0, 0, 0, 0, 0, 0, '', 0, 0, 0, '', '', '', 0, 0, 0, 0, false);
    let result: any = {};
    payrollCab.NIDCOMMLOTLIST = this.arrayIdCommissionLot;
    this.commissionlotService.getPostAnularLote(payrollCab)
      .subscribe(
        data => {
          result = data;
          this.messageinfo = result.noutidcommlot;
          this.childModal.show();
          this.onLoadCommissionLot();
          this.selectedAll = false;
          this.arrayIdCommissionLot = ''; // ALEX GAVIDIA
        },
        error => {
          console.log(error);
        }
      );
  }

  // Pendiente el envio a exactus
  btnEnviarExactusLote() {
    const lotExactus = new CommissionLotExactus(0, '', 0);
    lotExactus.NID_COMMLOT = this.IdCommLot;
    let result: any = {};
    this.commissionlotService.getPostEnviarExactus(lotExactus)
      .subscribe(
        data => {
          result = data;
          // console.log(result.smensaje);
          this.messageinfo = result.smensaje;
          this.childModal.show();
          this.onLoadCommissionLot();
          this.selectedAll = false;
        },
        error => {
          console.log(error);
        }
      );

  }

  onSelectState(StateID) {
    if (StateID === '0') {
      // console.log('StateID 0 ' + this.ListStateID);
      this.InputsFilter.P_NSTATE = this.ListStateID;
    } else {
      // console.log('StateID != 0  ' + StateID);
      this.InputsFilter.P_NSTATE = StateID;  //
    }
  }

  onSelectBranch(StateID) {
    if (StateID === '0') {
      this.InputsFilter.P_NBRANCH = '0';
    } else {
      this.InputsFilter.P_NBRANCH = StateID;
    }
  }

  confirmEnviar() {
    // this.router.navigate(['broker/commissionlot-add', 'send', this.commissionLotID, this.stateID]);
    this.onEventSearch();
    this.childModalConfirmarEnvio.hide();
  }

  closeEnviar() {
    this.childModalConfirmarEnvio.hide();
  }

  onImprimir(id) {
    this.commissionlotService.generarLotePdf(id).subscribe(
      res => {
        const obj = <DownloadDto>(res);

        if (obj.success === true) {
          const _iFrame = <HTMLIFrameElement>document.getElementById('ifrmPdf');

          _iFrame.src = 'about:blank';

          setTimeout(() => { _iFrame.src = `${AppConfig.URL_API}/commissionlot/DownloadFileByTokenId/${obj.id}`; }, 250);
        } else {
          // Mensaje de error
        }
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

}
