import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { LoadMassiveService } from '../../../services/LoadMassive/load-massive.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-monitoring-error',
  templateUrl: './monitoring-error.component.html',
  styleUrls: ['./monitoring-error.component.css']
})
export class MonitoringErrorComponent implements OnInit {
  listToShow: any = [];
  processlogList: any = [];
  currentPage = 1; // página actual
  rotate = true; //
  maxSize = 10; // cantidad de paginas que se mostrarán en el paginado
  itemsPerPage = 5; // limite de items por página
  totalItems = 0; // total de items encontrados
  isLoading: boolean = false;
  bsConfig: Partial<BsDatepickerConfig>;
  Sprocess: string;
  OpcDetalle: string;
  @Input() public reference: any;
  @Input() public contractor: any;
  @Input() public formModalReference: NgbModalRef;
  constructor(private modalService: NgbModal, private MassiveService: LoadMassiveService) { }

  ngOnInit() {
    console.log(this.contractor.IdDetailProcess);
    this.Sprocess = this.contractor.FileName;
    switch (this.contractor.Opcion) {
      case 'E':
        this.OpcDetalle = 'Error';
        break;
      case 'W':
          this.OpcDetalle = 'Warning';
          break;
    }

    this.GetProcessDetail();
  }

  GetProcessDetail() {
    this.listToShow = [];
    this.processlogList = [];

    this.isLoading = true;
    this.currentPage = 1; // página actual
    this.rotate = true; //
    this.maxSize = 10; // cantidad de paginas que se mostrarán en el paginado
    this.itemsPerPage = 5; // limite de items por página
    this.totalItems = 0; // total de items encontrados

    // let dayIni = this.bsValueIni.getDate() < 10 ? "0" + this.bsValueIni.getDate() : this.bsValueIni.getDate();
    // let monthPreviewIni = this.bsValueIni.getMonth() + 1;
    // let monthIni = monthPreviewIni < 10 ? "0" + monthPreviewIni : monthPreviewIni;
    // let yearIni = this.bsValueIni.getFullYear();


    const data: any = this.contractor.IdDetailProcess;
    const opcion: any = this.contractor.Opcion;
    this.MassiveService.GetProcessLogError(data, opcion).subscribe(
      res => {
        console.log(res);
        this.processlogList = res;
        this.totalItems = this.processlogList.length;
        this.listToShow = this.processlogList.
          slice(((this.currentPage - 1) * this.itemsPerPage), (this.currentPage * this.itemsPerPage));
        /*   if (this.processlogList.length === 0) {
             swal.fire({
               title: 'Información',
               text: 'No se encuentro informacion.',
               type: 'error',
               confirmButtonText: 'OK',
               allowOutsideClick: false,
             }).then((result) => {
               if (result.value) {
               }
             });
           }*/
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
        console.log(err);
      }
    );
  }


  pageChanged(currentPage) {
    this.currentPage = currentPage;
    this.listToShow = this.processlogList.slice(((this.currentPage - 1) * this.itemsPerPage), (this.currentPage * this.itemsPerPage));

    
  }

}
