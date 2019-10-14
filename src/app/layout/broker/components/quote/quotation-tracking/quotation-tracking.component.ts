import { Component, OnInit, Input } from '@angular/core';
//MODELOS
import {QuotationTracking} from '../../../models/quotation/response/quotation-tracking';
import {QuotationTrackingSearch} from '../../../models/quotation/request/quotation-tracking-search';
//SERVICIOS
import { QuotationService } from '../../../services/quotation/quotation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-quotation-tracking',
  templateUrl: './quotation-tracking.component.html',
  styleUrls: ['./quotation-tracking.component.css']
})
export class QuotationTrackingComponent implements OnInit {
  @Input() public formModalReference:any; //Referencia al modal creado desde el padre de este componente 'contractor-location-index' para ser cerrado desde aquí
  @Input() public quotationNumber:string;

  isLoading: Boolean = false;
  /*Variables de paginacion */
  currentPage = 1; //página actual
  rotate = true; //
  maxSize = 5; // cantidad de paginas que se mostrarán en el paginado
  itemsPerPage = 5; // limite de items por página
  totalItems = 0; //total de items encontrados
  foundResults: any[] = [];

  data=new QuotationTrackingSearch(); 

  constructor(private quotationService:QuotationService) { }

  ngOnInit() {
    this.data.QuotationNumber=this.quotationNumber;
    this.data.PageNumber=1;
    this.data.LimitPerPage=5;

    this.firstSearch();
  }
  firstSearch(){
    this.data.PageNumber=1;
    this.searchTracking();
  }
  pageChanged(event){
    this.data.PageNumber=event;
    this.searchTracking();
  }
  searchTracking(){
    let self=this;
    this.quotationService.getTrackingList(this.data).subscribe(
      res=>{
        this.totalItems = res.TotalRowNumber;
        if (res.TotalRowNumber > 0) {
          this.foundResults = res.GenericResponse;
          this.isLoading = false;
        } else {
          this.totalItems = 0;
          this.foundResults = [];
          this.isLoading = false;
        }

        // if(res.StatusCode==0){
          
        // }else{
        //   Swal.fire("Información",self.listToString(res.Message),"error");
        // }
      },
      err=>{
        console.log(err);
        Swal.fire("Información","Error insperado, contáctese con soporte.","error");
      }
    );
  }

  listToString(inputList: String[]): string {
    let output = "";
    inputList.forEach(function (item) {
      output = output + item + " <br>"
    });
    return output;
  }
}
