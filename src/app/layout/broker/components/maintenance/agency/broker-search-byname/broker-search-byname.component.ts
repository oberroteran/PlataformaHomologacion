import { Component, OnInit, Input, AfterContentInit } from '@angular/core';
import { FormGroup, FormBuilder,FormControl,Validators,AbstractControl } from '@angular/forms';
import Swal from 'sweetalert2';
//Modelos
import { BrokerAgencySearch } from '../../../../models/maintenance/agency/request/broker-agency-search';
import { BrokerAgency } from '../../../../models/maintenance/agency/response/broker-agency';
//Servicios
import { AgencyService } from '../../../../services/maintenance/agency/agency.service';

@Component({
  selector: 'app-broker-search-byname',
  templateUrl: './broker-search-byname.component.html',
  styleUrls: ['./broker-search-byname.component.css']
})
export class BrokerSearchBynameComponent implements OnInit {
  @Input() public formModalReference:any; //Referencia al modal creado desde el padre de este componente para ser cerrado desde aquí
  @Input() public foundResults:any[]; //
  listToShow: any[] = [];
  isLoading:boolean=false;
  public selectedBroker: string;
  public currentPage = 1; //página actual
  public rotate = true; //
  public maxSize = 10; // cantidad de paginas que se mostrarán en el paginado
  public itemsPerPage = 10; // limite de items por página
  public totalItems = 0; //total de items encontrados

  // dtTrigger: Subject = new Subject();

  constructor() { }

  ngOnInit() {
    this.isLoading=true;
    this.totalItems = this.foundResults.length;
    this.listToShow = this.foundResults.slice(((this.currentPage - 1) * this.itemsPerPage), (this.currentPage * this.itemsPerPage));
    this.isLoading=false;
  }

  chooseBroker(selection: any) {
    if (selection === undefined) {
      Swal.fire("Información","Ha ocurrido un error inesperado.","error");
    } else {
      this.formModalReference.close(selection);
    }
  }
  chooseBrokerByRadioButton() {
    if (this.selectedBroker === undefined) {
      Swal.fire("Información","No ha seleccionado ningún broker.","error");
    } else {
      this.formModalReference.close(this.foundResults[this.selectedBroker]);
    }
  }
  pageChanged(currentPage) {
    this.currentPage = currentPage;
    this.listToShow = this.foundResults.slice(((this.currentPage - 1) * this.itemsPerPage), (this.currentPage * this.itemsPerPage));

  }
}
