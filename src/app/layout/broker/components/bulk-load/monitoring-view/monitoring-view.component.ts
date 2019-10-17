
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoadMassiveService } from '../../../services/LoadMassive/load-massive.service';
import { MonitoringErrorComponent } from '../monitoring-error/monitoring-error.component';
import { BsDatepickerConfig } from "ngx-bootstrap";
import swal from 'sweetalert2';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-monitoring-view',
  templateUrl: './monitoring-view.component.html',
  styleUrls: ['./monitoring-view.component.css']
})


export class MonitoringViewComponent implements OnInit {
  listToShow: any = [];
  FileUpload: File;
  fileTrama: string;
  lastInvalids: any;
  processDetailList: any = [];
  currentPage = 1; // página actual
  rotate = true; //
  maxSize = 10; // cantidad de paginas que se mostrarán en el paginado
  itemsPerPage = 8; // limite de items por página
  totalItems = 0; // total de items encontrados
  isLoading: boolean = false;
  bsConfig: Partial<BsDatepickerConfig>;
  sd: any;
  interval: any;
  @Input() public reference: any;
  @Input() public contractor: any;

  constructor(private modalService: NgbModal, private MassiveService: LoadMassiveService) { }

  ngOnInit() {
    console.log(this.contractor.IdHeaderProcess);
    this.GetProcessDetail();
    this.startTimer();
  }


  startTimer() {
    this.stopTimer();
    this.interval = this.interval = setInterval(() => {
      this.GetProcessDetail();
    }, 1500);
  }

  stopTimer() {
    clearInterval(this.interval);
  }

  GetProcessDetail() {
    // this.listToShow = [];
    // this.processDetailList = [];
    this.currentPage = 1; // página actual
    this.rotate = true; //
    this.maxSize = 10; // cantidad de paginas que se mostrarán en el paginado
    this.itemsPerPage = 5; // limite de items por página
    this.totalItems = 0; // total de items encontrados

    // let dayIni = this.bsValueIni.getDate() < 10 ? "0" + this.bsValueIni.getDate() : this.bsValueIni.getDate();
    // let monthPreviewIni = this.bsValueIni.getMonth() + 1;
    // let monthIni = monthPreviewIni < 10 ? "0" + monthPreviewIni : monthPreviewIni;
    // let yearIni = this.bsValueIni.getFullYear();


    const data: any = this.contractor.IdHeaderProcess;
    this.MassiveService.GetDetailProcess(data).subscribe(
      res => {
        console.log(res);
        this.processDetailList = res;
        this.totalItems = this.processDetailList.length;
        this.listToShow = this.processDetailList.
          slice(((this.currentPage - 1) * this.itemsPerPage), (this.currentPage * this.itemsPerPage));
        if (this.processDetailList.length === 0) {
          this.listToShow = [];
          this.processDetailList = [];
          /*  swal.fire({s
              title: 'Información',
              text: 'No se encuentran procesos con la fecha ingresada.',
              type: 'error',
              confirmButtonText: 'OK',
              allowOutsideClick: false,
            }).then((result) => {
              if (result.value) {
              }
            });*/
        }
      },
      err => {

        console.log(err);
      }
    );
  }

  pageChanged(currentPage) {
    this.currentPage = currentPage;
    this.listToShow = this.processDetailList.slice(((this.currentPage - 1) * this.itemsPerPage), (this.currentPage * this.itemsPerPage));
  }

  ExportData(item: any) {
    const data: any = {};
    this.isLoading = true;
    data.IdHeaderProcess = this.contractor.IdHeaderProcess;
    data.IdFileConfig = item.IdFileConfig;
    data.table_reference = item.table_reference;
    console.log(data);
    this.MassiveService.GetDataExport(data).subscribe(
      res => {
        console.log(res);
        this.fileTrama = res.GenericResponse;
        if (this.fileTrama) {
          const file = new File([this.obtenerBlobFromBase64(this.fileTrama, '')],
            item.FileName.toLowerCase() + '.csv', { type: 'text/plain;charset=utf-8' });
          FileSaver.saveAs(file);
        } else {
          console.log('error');
        }
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
        console.log(err);
      }
    );
  }
  obtenerBlobFromBase64(b64Data: string, contentType: string) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
  OpenMovimiento(item: any, Opcion: any) {
    item.Opcion = Opcion;
    const modalRef = this.modalService.open
      (MonitoringErrorComponent, { size: 'xl', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.reference = modalRef;
    modalRef.componentInstance.contractor = item;

    // modalRef.result.then((shouldReload) => {
    //     if (shouldReload == true) {
    //        this.currentPage = 1;
    //       this.processPageChanged();
    //   }
    // }, (reason) => {
    // });
  }


  UploadFile(archivo: File, item: any) {

    let ExistProcessing = 0;

    console.log(archivo);
    this.isLoading = true;
    this.FileUpload = null;
    if (!archivo) {
      this.FileUpload = null;
    }
    this.FileUpload = archivo;
    this.processDetailList.forEach(e => {
      if (e.IdStatusDetail == 1) {
        swal.fire({
          title: 'Información',
          text: 'El proceso de ' + e.FileName + ' se encuentra ejecuntando !',
          type: 'warning',
          confirmButtonText: 'OK',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.value) {
          }
        });
        ExistProcessing = 1;
        return;
      }


    });
    if (ExistProcessing === 1) { this.startTimer(); this.isLoading = false; return; }
    if (this.FileUpload.name.split('.')[0].toUpperCase() !== item.FileName) {
      swal.fire({
        title: 'Información',
        text: 'El nombre del archivo tiene que ser el mismo del proceso',
        type: 'error',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
      });
      this.startTimer();
      this.isLoading = false;
      return;

    }

    const myFormData: FormData = new FormData();

    myFormData.append('dataFile', this.FileUpload);
    myFormData.append('UserCode', JSON.parse(localStorage.getItem('currentUser'))['id']);
    myFormData.append('idHeaderProcess', item.IdHeaderProcess);
    myFormData.append('idDetailProcess', item.IdDetailProcess);
    myFormData.append('idFileConfig', item.IdFileConfig);
    console.log(myFormData);
    this.MassiveService.UploadFileProcess(myFormData).subscribe(
      res => {
        console.log(res);
        this.isLoading = false;
        swal.fire({
          title: 'Información',
          text: 'Se comenzo el reproceso del archivo ' + item.FileName,
          type: 'success',
          confirmButtonText: 'OK',
          allowOutsideClick: false,
        });
      },
      err => {
        this.isLoading = false;
        console.log(err);
      }
    );
    this.startTimer();


  }

  
}
