import { PdfDigitalReenvio } from './../../models/historial/pdfdigitalreenvio';
import { Component, OnInit, ViewChild } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { HistorialService } from '../../services/historial/historial.service';
import { Historial } from '../../models/historial';
import { UtilityService } from '../../../../shared/services/general/utility.service';
import { ExcelService } from '../../../../shared/services/excel/excel.service';
import { EmisionService } from '../../../client/shared/services/emision.service';
import { AppConfig } from '../../../../app.config';
import { Router } from '@angular/router';
import { BsDatepickerConfig, ModalDirective } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Step05Service } from '../../services/step05/step05.service';
// test
@Component({
  selector: 'app-historial',
  moduleId: module.id,
  templateUrl: 'historial.component.html',
  styleUrls: ['historial.component.css']
})
export class HistorialComponent implements OnInit {
  @ViewChild('childModal', { static: true }) childModal: ModalDirective;
  @ViewChild('childModalConfirmasivo', { static: true }) childModalConfirmasivo: ModalDirective;
  // datepicker
  public bsConfig: Partial<BsDatepickerConfig>;
  // paginacion
  page: number;
  /*Variables de paginacion */
  public itemsPerPage = 10;
  public totalItems = 0;
  public currentPage = 0;
  paginacion: any = {};
  rotate = true;
  maxSize = 5;
  filter: any = {};
  fecha = new Date();
  dia = this.fecha.getDate();
  mes = this.fecha.getMonth() === 0 ? 1 : this.fecha.getMonth();
  anio = this.fecha.getFullYear();

  bsValueIni: Date = new Date();
  bsValueFin: Date = new Date();

  historial: Historial;
  resultStateSalesReport = '0';
  resultSalesModeReport = '0';
  fExistRegistro: any = false;
  historialGrilla: any[];
  historialGrillaExport: any[];
  ListSalesMode: any[];
  returnedArray: Historial[];
  tipoBuscar = '';
  primaBuscar = '';
  estadoBuscar = '';
  fechaBuscar: Date;
  resultError = true;
  listErrores = [];
  msgErrorLista = '';
  username: string;
  resultChannelSalesReport = '';
  resultChannelPointReport = '';

  canal = '';
  id = 0;
  indpuntoVenta = 0;
  numeroPoliza: string;
  message: string;
  flag: string;
  msjHeader: string;
  email: string;
  messageinfo: any;
  bHideBody: Boolean;
  showSeccionEntrega = false;

  constructor(
    private historialService: HistorialService,
    public utilityService: UtilityService,
    private excelService: ExcelService,
    private emissionService: EmisionService,
    private router: Router,
    public datePipe: DatePipe,
    private step05service: Step05Service) {
    this.filter.StatePolicy = '';
    this.filter.TypePolicy = '';
    this.filter.NumPolicy = '';
    this.bsValueIni.setMonth(0, 1);
    this.paginacion.ItemsPerPage = this.itemsPerPage;
    this.paginacion.TotalItems = this.totalItems;
    this.paginacion.CurrentPage = this.currentPage;

    this.bsConfig = Object.assign(
      {},
      {
        dateInputFormat: 'DD/MM/YYYY',
        locale: 'es',
        showWeekNumbers: false
      }
    );
  }

  ngOnInit() {
    this.msgErrorLista = 'No se encontraron Registros..';
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.id = currentUser && currentUser.id;
    this.canal = currentUser && currentUser.canal;
    this.indpuntoVenta = currentUser && currentUser.indpuntoVenta;


    this.step05service.getCanalTipoPago(this.canal, AppConfig.SETTINGS_SALE).subscribe(
      res => {
        this.showSeccionEntrega = false;
        if (res !== null) {
          this.showSeccionEntrega = res.bdelivery === 1 ? true : false;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  onVotedParentChannelSales(idChannelSales: string) {
    this.resultChannelSalesReport = idChannelSales;
  }
  onVotedParentChannelPoint(idChannelSales: string) {
    this.resultChannelPointReport = idChannelSales;
  }
  private getHistorial() {
    this.fExistRegistro = true;
    this.paginacion.CurrentPage = this.currentPage;
    this.historial = new Historial(
      this.resultStateSalesReport,
      this.resultSalesModeReport,
      this.utilityService.getValueDefault(this.filter.NumPolicy),
      this.datePipe.transform(this.bsValueIni, 'dd/MM/yyyy'),
      this.datePipe.transform(this.bsValueFin, 'dd/MM/yyyy'),
      this.resultChannelSalesReport,
      this.resultChannelPointReport,
      this.paginacion.CurrentPage,
      this.paginacion.ItemsPerPage
    );
    this.historialService.getHistorial(this.historial).subscribe(
      histGrilla => {
        this.historialGrilla = <any[]>histGrilla;
        this.msgErrorLista = '';
        if (this.historialGrilla.length > 0) {
          this.fExistRegistro = true;
          this.totalItems = histGrilla[0].nrecorD_COUNT;
        } else {
          this.fExistRegistro = false;
          this.msgErrorLista = 'No se encontraron Registros..';
        }
      },
      err => {
        console.log(err);
        this.fExistRegistro = false;
        this.msgErrorLista = 'Error de Sistemas. Comunicarse con Soporte!';
      }
    );
  }

  onImprimir(numeroPoliza: number) {
    if (numeroPoliza.toString().substr(0, 1) === '7') {
      this.emissionService.generarPolizaDigitalPdf(numeroPoliza).subscribe(
        res => {
          this.downloadDigitalPdf(res);
        },
        err => {
          console.log(err);
        }
      );

    } else {
      this.emissionService.generarPolizaPdf(numeroPoliza).subscribe(
        res => {
          this.downloadPdf(res.fileName);
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  DownloadPolicyPdf(historial: any) {
    this.historialService.DownloadPolicyPdf(historial).subscribe(
      data => {
        let obj: any;
        obj = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  openModalConfirExactus(id: string) {
    this.email = '';
    this.childModalConfirmasivo.show();
    this.msjHeader = 'Enviar correo electrónico';
    this.message = 'Email:';
    this.flag = 'correo';
    this.numeroPoliza = id;
  }

  confirm(): void {
    if (this.flag === 'correo') {
      this.onEmail(this.numeroPoliza);
      this.childModalConfirmasivo.hide();
    }
  }

  closeconfirm(): void {
    this.childModalConfirmasivo.hide();
  }

  onEmail(numeroPoliza: string) {
    // Enviar Correo
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.username = currentUser && currentUser.username.toLowerCase();
    const pdfDigitalReenvio = new PdfDigitalReenvio(
      numeroPoliza,
      this.email,
      0,
      '1',
      this.username,
      ''
    );
    let result: any = {};
    this.historialService.InsPdfDigitalReenvio(pdfDigitalReenvio).subscribe(
      data => {
        result = data;
        this.messageinfo = result.mensaje;
        this.childModal.show();
      },
      error => {
        console.log(error);
      }
    );
  }

  aceptarmsginfo() {
    this.childModal.hide();
  }

  downloadDigitalPdf(response) {
    if (response) {
      let linkSource = 'data:application/pdf;base64,';
      linkSource += response.file;
      const a = document.createElement('a');
      a.setAttribute('href', linkSource);
      a.setAttribute('download', response.id);
      a.setAttribute('target', '_blank');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      a.click();
      a.remove();

      /*  downloadLink.href = linkSource;
       downloadLink.download = response.id;
       downloadLink.click();
       downloadLink.remove(); */
    }
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

  EventSearch(event) {
    if (this.EventValidate(event) === true) {
      this.getHistorial();
    }
  }

  EventValidate(event) {
    this.currentPage = 0;
    this.totalItems = 0;
    this.resultError = true;
    this.fExistRegistro = false;
    this.historialGrilla = [];
    this.listErrores = [];
    this.listErrores = this.utilityService.isValidateHistorial(
      event,
      this.datePipe.transform(this.bsValueIni, 'dd/MM/yyyy'),
      this.datePipe.transform(this.bsValueFin, 'dd/MM/yyyy')
    );

    if (this.listErrores.length > 0) {
      this.resultError = false;
      return false;
    } else {
      this.resultError = true;
      return true;
    }
  }

  onVotedParentStateSales(idStateSales: string) {
    this.resultStateSalesReport = idStateSales;
  }

  onVotedParentSalesMode(idSalesMode: string) {
    this.resultSalesModeReport = idSalesMode;
  }
  setPage(pageNo: number): void {
    this.currentPage = pageNo;
  }
  pageChanged(event: any): void {
    this.page = event.page;
    this.currentPage = event.page - 1;
    this.getHistorial();
  }

  EventDownload() {
    this.historial = new Historial(
      this.resultStateSalesReport,
      this.resultSalesModeReport,
      this.utilityService.getValueDefault(this.filter.NumPolicy),
      this.datePipe.transform(this.bsValueIni, 'dd/MM/yyyy'),
      this.datePipe.transform(this.bsValueFin, 'dd/MM/yyyy'),
      this.resultChannelSalesReport,
      this.resultChannelPointReport,
      this.paginacion.CurrentPage,
      this.paginacion.ItemsPerPage
    );
    this.historial.NPAGE = '0';
    this.historial.NRECORD_PAGE = '0';

    this.historialService.getHistorial(this.historial).subscribe(
      data => {
        this.historialGrillaExport = <any[]>data;
        if (this.historialGrillaExport.length > 0) {

          if (this.showSeccionEntrega) {
            this.excelService.exportHistorialDetail(
              this.historialGrillaExport,
              'ReporteHistorialVenta'
            );
          } else {
            this.excelService.exportHistorial(
              this.historialGrillaExport,
              'ReporteHistorialVenta'
            );
          }

        }
      },
      err => {
        console.log(err);
      }
    );
  }

  AddSales() {
    this.router.navigate(['broker/salepanel']);
  }
}
