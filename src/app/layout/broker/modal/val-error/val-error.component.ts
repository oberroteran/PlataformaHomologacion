import { Component, OnInit, Input, AfterContentInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from "@angular/forms";
import Swal from 'sweetalert2';
import { ExcelService } from '../../services/shared/excel.service';

@Component({
  selector: 'app-val-error',
  templateUrl: './val-error.component.html',
  styleUrls: ['./val-error.component.css']
})
export class ValErrorComponent implements OnInit {
  @Input() public formModalReference: any; //Referencia al modal creado desde el padre de este componente para ser cerrado desde aquí
  @Input() public erroresList: any;

  constructor(private excelService: ExcelService) { }

  ngOnInit() {
  }

  GenerarReporte(){
    console.log(this.erroresList);
    this.excelService.generateErroresExcel(this.erroresList, "Errores");
    this.formModalReference.close()
  }
}
