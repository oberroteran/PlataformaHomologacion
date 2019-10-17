
import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MonitoringViewComponent } from '../monitoring-view/monitoring-view.component';
import { LoadMassiveService } from '../../../services/LoadMassive/load-massive.service';
import { BsDatepickerConfig } from "ngx-bootstrap";
import swal from 'sweetalert2';
@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css']
})


export class MonitoringComponent implements OnInit {

  listToShow: any = [];
  processHeaderList: any = [];
  currentPage = 1; // página actual
  rotate = true; //
  maxSize = 10; // cantidad de paginas que se mostrarán en el paginado
  itemsPerPage = 5; // limite de items por página
  totalItems = 0; // total de items encontrados
  isLoading: boolean = false;
  bsConfig: Partial<BsDatepickerConfig>;
  bsValueIni: Date = new Date();
  bsValueFinMax: Date = new Date();
  constructor(private modalService: NgbModal, private MassiveService: LoadMassiveService) {
    this.bsConfig = Object.assign(
      {},
      {
        dateInputFormat: "DD/MM/YYYY",
        locale: "es",
        showWeekNumbers: false
      }
    );
  }

  ngOnInit() {

  }



  OpenMovimiento(item: any) {
    const modalRef = this.modalService.open
      (MonitoringViewComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.reference = modalRef;
    modalRef.componentInstance.contractor = item;


    modalRef.result.then((Interval) => {
      console.log(Interval);
      this.currentPage = 1;
      clearInterval(Interval);

      this.GetProcessHeader();
    }, (reason) => {
    });

    // modalRef.result.then((shouldReload) => {
    //     if (shouldReload == true) {
    //        this.currentPage = 1;
    //       this.processPageChanged();
    //   }
    // }, (reason) => {
    // });
  }

  GetProcessHeader() {
    this.listToShow = [];
    this.processHeaderList = [];

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


    let data: any = {};

    let dayIni = this.bsValueIni.getDate() < 10 ? "0" + this.bsValueIni.getDate() : this.bsValueIni.getDate();
    let monthPreviewIni = this.bsValueIni.getMonth() + 1;
    let monthIni = monthPreviewIni < 10 ? "0" + monthPreviewIni : monthPreviewIni;
    let yearIni = this.bsValueIni.getFullYear();

    data.P_DEFFECDATE = dayIni + "/" + monthIni + "/" + yearIni;
    this.MassiveService.GetHeaderProcess(data).subscribe(
      res => {
        console.log(res);
        this.processHeaderList = res;
        this.totalItems = this.processHeaderList.length;
        this.listToShow = this.processHeaderList.
          slice(((this.currentPage - 1) * this.itemsPerPage), (this.currentPage * this.itemsPerPage));
        if (this.processHeaderList.length === 0) {
          swal.fire({
            title: 'Información',
            text: 'No se encuentran procesos con la fecha ingresada.',
            type: 'error',
            confirmButtonText: 'OK',
            allowOutsideClick: false,
          }).then((result) => {
            if (result.value) {
            }
          });
        }
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
    this.listToShow = this.processHeaderList.slice(((this.currentPage - 1) * this.itemsPerPage), (this.currentPage * this.itemsPerPage));
  }


}
