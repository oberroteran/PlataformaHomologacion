import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from "ngx-bootstrap";
@Component({
  selector: 'app-quotation-request',
  templateUrl: './quotation-request.component.html',
  styleUrls: ['./quotation-request.component.css']
})
export class QuotationRequestComponent implements OnInit {
  public bsValueIni="14/01/2019";
  public bsConfig: Partial<BsDatepickerConfig>;
  constructor() {

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
  }

}
