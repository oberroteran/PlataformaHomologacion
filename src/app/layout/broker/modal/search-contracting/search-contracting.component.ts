import { Component, OnInit, Input, AfterContentInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from "@angular/forms";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-search-contracting',
  templateUrl: './search-contracting.component.html',
  styleUrls: ['./search-contracting.component.css']
})
export class SearchContractingComponent implements OnInit {
  @Input() public formModalReference: any; //Referencia al modal creado desde el padre de este componente para ser cerrado desde aquí
  @Input() public EListClient: any;

  listToShow: any[] = [];

  public selectedContractor: string;
  public currentPage = 1; //página actual
  public rotate = true; //
  public maxSize = 10; // cantidad de paginas que se mostrarán en el paginado
  public itemsPerPage = 10; // limite de items por página
  public totalItems = 0; //total de items encontrados

  // dtTrigger: Subject = new Subject();

  constructor() { }

  ngOnInit() {
    this.totalItems = this.EListClient.length;
    this.listToShow = this.EListClient.slice(((this.currentPage - 1) * this.itemsPerPage), (this.currentPage * this.itemsPerPage));
  }

  chooseContractor(selection: any) {
    if (selection === undefined) {
      Swal.fire("Información","Ha ocurrido un error inesperado.","error");
    } else {
      this.formModalReference.close(selection);
    }
  }
  chooseContractorByRadioButton() {
    if (this.selectedContractor === undefined) {
      Swal.fire("Información","No ha seleccionado ningún contratante.","error");
    } else {
      this.formModalReference.close(this.EListClient[this.selectedContractor]);
    }
  }
  pageChanged(currentPage) {
    this.currentPage = currentPage;
    this.listToShow = this.EListClient.slice(((this.currentPage - 1) * this.itemsPerPage), (this.currentPage * this.itemsPerPage));

  }

}
