import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from "ngx-bootstrap";
import { DatePipe } from '@angular/common';
import { PolicyService } from '../../../services/policy/policy.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-process-viewer',
  templateUrl: './process-viewer.component.html',
  styleUrls: ['./process-viewer.component.css']
})
export class ProcessViewerComponent implements OnInit {
  listToShow: any = [];
  processList: any = []
  currentPage = 1; //página actual
  rotate = true; //
  maxSize = 10; // cantidad de paginas que se mostrarán en el paginado
  itemsPerPage = 5; // limite de items por página
  totalItems = 0; //total de items encontrados
  isLoading: boolean = false;

  //Datos para configurar los datepicker
  bsConfig: Partial<BsDatepickerConfig>;
  bsValueIni: Date = new Date();
  bsValueFinMax: Date = new Date();


  constructor(
    private policyService: PolicyService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.visualizadorProcess();
  }

  visualizadorProcess() {

    this.listToShow = [];
    // let msg: string = "";


    // if (msg != "") {
    //   swal.fire("Información", msg, "error");
    // } else {

      this.isLoading = true;
      //Fecha Inicio
      this.currentPage = 1; //página actual
      this.rotate = true; //
      this.maxSize = 10; // cantidad de paginas que se mostrarán en el paginado
      this.itemsPerPage = 5; // limite de items por página
      this.totalItems = 0; //total de items encontrados

      let dayIni = this.bsValueIni.getDate() < 10 ? "0" + this.bsValueIni.getDate() : this.bsValueIni.getDate();
      let monthPreviewIni = this.bsValueIni.getMonth() + 1;
      let monthIni = monthPreviewIni < 10 ? "0" + monthPreviewIni : monthPreviewIni;
      let yearIni = this.bsValueIni.getFullYear();


      let data: any = {};
      data.P_NUSERCODE = JSON.parse(localStorage.getItem("currentUser"))["id"]
      data.P_DEFFECDATE = dayIni + "/" + monthIni + "/" + yearIni;
      data.P_NLIMITPERPAGE = 99999
      data.P_NPAGENUM = 1
      // console.log(data)
      this.policyService.GetVisualizadorProc(data).subscribe(
        res => {
          // console.log(res)
          this.isLoading = false;
          this.processList = res.listProcess;
          this.totalItems = this.processList.length;
          this.listToShow = this.processList.slice(((this.currentPage - 1) * this.itemsPerPage), (this.currentPage * this.itemsPerPage));
          if (this.processList.length == 0) {
            swal.fire({
              title: "Información",
              text: "No se encuentran póliza(s) con los datos ingresados",
              type: "error",
              confirmButtonText: 'OK',
              allowOutsideClick: false,
            }).then((result) => {
              if (result.value) {
              }
            });
          }
        },
        err => {
          this.isLoading = false;
          console.log(err);
        }
      );
    // }
  }

  pageChanged(currentPage) {
    this.currentPage = currentPage;
    this.listToShow = this.processList.slice(((this.currentPage - 1) * this.itemsPerPage), (this.currentPage * this.itemsPerPage));
  }
}
