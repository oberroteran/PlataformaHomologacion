import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from "ngx-bootstrap";
import { RequestStatus } from "../../../models/requeststatus";
import { UtilityService } from "../../../../../shared/services/general/utility.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-request-quotation',
  templateUrl: './request-quotation.component.html',
  styleUrls: ['./request-quotation.component.css']
})
export class RequestQuotationComponent implements OnInit {

  // datepicker
  public bsConfig: Partial<BsDatepickerConfig>;

  // paginacion
  page: number;

  /*Variables de paginacion */
  public itemsPerPage = 4;
  public totalItems = 0;
  public currentPage = 0;
  paginacion: any = {};
  rotate = true;
  maxSize = 5;
  filter: any = {};

  requestStatus: RequestStatus;
  fExistRegistro: any = false;
  requestStatusGrilla: any[];

  bsValueIni: Date = new Date("01/01/2017");
  bsValueFin: Date = new Date();
  msgErrorLista = "";

  constructor(
    public utilityService: UtilityService,
    private datePipe: DatePipe
  ) { 
    this.filter.TypeProduct = "";
    this.filter.Quotation = "";
    this.filter.StateRequest = "";
    this.filter.TypeDocument = "";
    this.filter.NumberDocument = "";
    this.filter.Contractor = "";
    this.filter.Broker = "Nombre de Broker";
    this.paginacion.ItemsPerPage = this.itemsPerPage;
    this.paginacion.TotalItems = this.totalItems;
    this.paginacion.CurrentPage = this.currentPage;

    this.bsConfig = Object.assign(
      {},
      {
        dateInputFormat: "DD/MM/YYYY",
        locale: "es",
        // containerClass: 'theme-dark-blue',
        showWeekNumbers: false
      }
    );
  }

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  }

  private getRequest() {
    this.fExistRegistro = true;
    this.paginacion.CurrentPage = this.currentPage;
    this.requestStatus = new RequestStatus(
      this.utilityService.getValueDefault(this.filter.TypeProduct),
      this.utilityService.getValueDefault(this.filter.Quotation),
      this.datePipe.transform(this.bsValueIni, "dd/MM/yyyy"),
      this.datePipe.transform(this.bsValueFin, "dd/MM/yyyy"),
      this.utilityService.getValueDefault(this.filter.StateRequest),
      this.utilityService.getValueDefault(this.filter.TypeDocument),
      this.utilityService.getValueDefault(this.filter.NumberDocument),
      this.utilityService.getValueDefault(this.filter.Contractor),
      this.paginacion.CurrentPage,
      this.paginacion.ItemsPerPage
    );
    console.log(this.requestStatus);
    // console.log(this.historial);
    // this.historialService.getHistorial(this.requestStatus).subscribe(
    //   histGrilla => {
    //     console.log(histGrilla);
    //     this.requestStatusGrilla = <any[]>histGrilla;
    //     this.msgErrorLista = "";
    //     if (this.requestStatusGrilla.length > 0) {
    //       this.fExistRegistro = true;
    //       this.totalItems = histGrilla[0].nrecorD_COUNT;
    //     } else {
    //       this.fExistRegistro = false;
    //       this.msgErrorLista = "No se encontraron Registros..";
    //     }
    //   },
    //   err => {
    //     console.log(err);
    //     this.fExistRegistro = false;
    //     this.msgErrorLista =
    //       "Error de Sistemas. Comunicarse con Soporte!";
    //   }
    // );
  }
  
  EventSearch(event) {
    this.getRequest();
  }

}
